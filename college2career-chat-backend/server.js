import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "adirp7",
    database: "college2career",
});

// HTTP + SOCKET SERVER
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"]
    }
});

// ----------------------------------------------------------------------
// SOCKET.IO LOGIC
// ----------------------------------------------------------------------
io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    // JOIN A GROUP
    socket.on("joinGroup", (groupId) => {
        socket.join(groupId);
        console.log(`User ${socket.id} joined room ${groupId}`);
    });

    // ------------------------------------------------------------------
    // SEND MESSAGE → Save → Broadcast → Mark Delivered
    // ------------------------------------------------------------------
    socket.on("sendMessage", async (data) => {
        const { groupId, senderId, message, messageType, fileUrl } = data;

        try {
            // Save message in DB
            const [result] = await db.query(
                `INSERT INTO messages (groupId, senderId, message, messageType, fileUrl)
             VALUES (?, ?, ?, ?, ?)`,
                [groupId, senderId, message || null, messageType || "text", fileUrl || null]
            );

            // Fetch saved message
            const [rows] = await db.query(
                "SELECT * FROM messages WHERE messageId = ?",
                [result.insertId]
            );

            let savedMsg = rows[0];

            // Fetch sender email (IMPORTANT)
            const [userRow] = await db.query(
                "SELECT email FROM users WHERE usersId = ?",
                [senderId]
            );
            savedMsg.senderEmail = userRow[0]?.email || null;

            // Mark delivered
            await db.query(
                "UPDATE messages SET delivered = 1 WHERE messageId = ?",
                [savedMsg.messageId]
            );
            savedMsg.delivered = 1;

            // Broadcast message (now includes senderEmail)
            io.to(groupId).emit("receiveMessage", savedMsg);

            // Notify sender delivered
            io.to(groupId).emit("messageDelivered", {
                messageId: savedMsg.messageId,
                groupId
            });

        } catch (err) {
            console.log("Message Save Error:", err);
        }
    });

    // ------------------------------------------------------------------
    // TYPING INDICATOR
    // ------------------------------------------------------------------
    socket.on("typing", ({ groupId, usersId }) => {
        socket.to(groupId).emit("typing", { groupId, usersId });
    });

    socket.on("stopTyping", ({ groupId, usersId }) => {
        socket.to(groupId).emit("stopTyping", { groupId, usersId });
    });

    // --------------------------------------------------------------
    // MESSAGE READ FIX — sender MUST NOT be added to readBy
    // --------------------------------------------------------------
    socket.on("markAsRead", async ({ groupId, messageId, usersId }) => {
        try {
            // Never add sender (important)
            const [msgRow] = await db.query(
                "SELECT senderId, readBy FROM messages WHERE messageId = ?",
                [messageId]
            );
            if (!msgRow.length) return;

            const senderId = msgRow[0].senderId;

            // STOP If sender tries to mark read → ignore
            if (senderId == usersId) return;

            let readList = msgRow[0].readBy ? msgRow[0].readBy.split(",") : [];

            if (!readList.includes(usersId.toString())) {
                readList.push(usersId.toString());

                await db.query(
                    "UPDATE messages SET readBy = ? WHERE messageId = ?",
                    [readList.join(","), messageId]
                );
            }

            io.to(groupId).emit("messageRead", {
                messageId,
                groupId,
                readers: readList
            });

        } catch (err) {
            console.log("markAsRead error", err);
        }
    });

    // ------------------------------------------------------------------
    // MARK ENTIRE GROUP AS READ (when chat is opened)
    // ------------------------------------------------------------------
    socket.on("markAsReadBatch", async ({ groupId, usersId }) => {
        try {
            // Fetch all messages of group
            const [msgs] = await db.query(
                "SELECT messageId, readBy FROM messages WHERE groupId = ?",
                [groupId]
            );

            for (const msg of msgs) {
                let readList = msg.readBy ? msg.readBy.split(",") : [];

                if (!readList.includes(usersId.toString())) {
                    readList.push(usersId.toString());

                    await db.query(
                        "UPDATE messages SET readBy = ? WHERE messageId = ?",
                        [readList.join(","), msg.messageId]
                    );

                    // Notify UI
                    io.to(groupId).emit("messageRead", {
                        messageId: msg.messageId,
                        groupId,
                        readers: readList
                    });
                }
            }
        } catch (err) {
            console.log("Batch read error:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// --------------------------------------------------------------
// remove buggy duplicate old code (already removed)
// --------------------------------------------------------------

// ----------------------------------------------------------------------
// APIs
// ----------------------------------------------------------------------

// Create or Get One-to-One Group
app.post("/api/createOrGetOneToOneGroup", async (req, res) => {
    const { user1, user2 } = req.body;

    try {
        const [existing] = await db.query(
            `SELECT cg.groupId 
             FROM chatgroups cg
             JOIN groupmembers gm1 ON gm1.groupId = cg.groupId
             JOIN groupmembers gm2 ON gm2.groupId = cg.groupId
             WHERE gm1.usersId = ? AND gm2.usersId = ?`,
            [user1, user2]
        );

        if (existing.length > 0) {
            return res.json({ status: true, groupId: existing[0].groupId });
        }

        const [group] = await db.query(
            "INSERT INTO chatgroups (groupName, createdBy) VALUES (?, ?)",
            ["direct-chat", user1]
        );

        const groupId = group.insertId;

        await db.query(
            `INSERT INTO groupmembers (groupId, usersId, role)
             VALUES (?, ?, ?), (?, ?, ?)`,
            [groupId, user1, "member", groupId, user2, "member"]
        );

        res.json({ status: true, groupId });

    } catch (err) {
        res.status(500).json({ status: false });
    }
});

// Send via REST
app.post("/api/sendMessage", async (req, res) => {
    const { groupId, senderId, message, messageType } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO messages (groupId, senderId, message, messageType)
             VALUES (?, ?, ?, ?)`,
            [groupId, senderId, message, messageType || "text"]
        );

        const [rows] = await db.query(
            "SELECT * FROM messages WHERE messageId = ?",
            [result.insertId]
        );

        res.json({ status: true, data: rows[0] });

    } catch (err) {
        res.status(500).json({ status: false });
    }
});

// Get messages
app.get("/api/getGroupMessages/:groupId", async (req, res) => {
    const { groupId } = req.params;

    const [rows] = await db.query(
        "SELECT * FROM messages WHERE groupId = ? ORDER BY createdAt ASC",
        [groupId]
    );

    res.json({ status: true, data: rows });
});

// Get user's groups
app.get("/api/getUserGroups/:usersId", async (req, res) => {
    const { usersId } = req.params;

    const [rows] = await db.query(
        `SELECT cg.* 
         FROM chatgroups cg
         JOIN groupmembers gm ON gm.groupId = cg.groupId
         WHERE gm.usersId = ?`,
        [usersId]
    );

    res.json({ status: true, data: rows });
});

// Get Chat Contacts (email)
app.get("/api/getChatContacts/:usersId", async (req, res) => {
    const { usersId } = req.params;

    try {
        const [rows] = await db.query(
            `
SELECT 
    u.usersId AS otherUserId,
    u.email AS otherEmail,
    cg.groupId,
    m.message AS lastMessage,
    m.messageType,
    m.createdAt AS lastMessageTime,
    (
      SELECT COUNT(*) FROM messages
      WHERE groupId = cg.groupId
      AND senderId != ?
      AND (readBy IS NULL OR readBy NOT LIKE CONCAT('%,', ?, ',%')
                         AND readBy NOT LIKE CONCAT(?, ',%')
                         AND readBy NOT LIKE CONCAT('%,', ?))
    ) AS unreadCount
FROM groupmembers gm
JOIN groupmembers gm2 ON gm.groupId = gm2.groupId AND gm2.usersId != gm.usersId
JOIN users u ON u.usersId = gm2.usersId
JOIN chatgroups cg ON cg.groupId = gm.groupId
LEFT JOIN messages m ON m.messageId = (
    SELECT messageId FROM messages 
    WHERE groupId = cg.groupId 
    ORDER BY createdAt DESC 
    LIMIT 1
)
WHERE gm.usersId = ?
ORDER BY lastMessageTime DESC;
`,
            [usersId, usersId, usersId, usersId, usersId]
        );

        res.json({ status: true, data: rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false });
    }
});

// Search Users by email or username
app.get("/api/searchUsers", async (req, res) => {
    const { q, currentUserId } = req.query;

    if (!q || !currentUserId)
        return res.json({ status: false, message: "Missing parameters" });

    try {
        const [rows] = await db.query(
            `SELECT usersId, email 
             FROM users 
             WHERE (email LIKE ?)
             AND usersId != ? 
             LIMIT 20`,
            [`%${q}%`, currentUserId]
        );

        return res.json({ status: true, data: rows });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, message: "DB error" });
    }
});

httpServer.listen(5000, () => {
    console.log("Chat server running on port 5000");
});

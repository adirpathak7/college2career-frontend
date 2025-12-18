import jwt from "jsonwebtoken";

const rooms = {};

export default function videoSignaling(io) {
    io.on("connection", (socket) => {

        socket.on("request-join", ({ roomId, token }) => {
            let email = "Unknown user";

            try {
                if (token) {
                    const decoded = jwt.decode(token);
                    email =
                        decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
                        || decoded?.email
                        || "Unknown user";
                }
            } catch (err) {
                console.log("JWT decode error:", err.message);
            }

            // 🔒 ROOM CREATE (ONLY ONCE)
            if (!rooms[roomId]) {
                rooms[roomId] = {
                    host: socket.id,
                    guest: null,
                    guestEmail: null,
                };

                socket.join(roomId);
                socket.emit("host-confirmed");
                console.log("HOST CREATED:", roomId, email);
                return;
            }

            const room = rooms[roomId];

            // 🚫 MEETING FULL (3rd user)
            if (room.guest) {
                socket.emit("meeting-full");
                return;
            }

            // 🟡 SECOND USER = GUEST
            room.guest = socket.id;
            room.guestEmail = email;

            socket.emit("waiting");
            io.to(room.host).emit("join-request", { email });

            console.log("GUEST REQUEST:", roomId, email);
        });

        socket.on("admit-user", ({ roomId }) => {
            const room = rooms[roomId];
            if (!room || !room.guest) return;

            io.to(room.guest).emit("admitted");
        });

        socket.on("dismiss-user", ({ roomId }) => {
            const room = rooms[roomId];
            if (!room || !room.guest) return;

            io.to(room.guest).emit("dismissed");
            room.guest = null;
            room.guestEmail = null;
        });

        socket.on("final-join", ({ roomId }) => {
            socket.join(roomId);
            socket.to(roomId).emit("user-joined");
        });

        socket.on("offer", ({ roomId, offer }) => {
            socket.to(roomId).emit("offer", offer);
        });

        socket.on("answer", ({ roomId, answer }) => {
            socket.to(roomId).emit("answer", answer);
        });

        socket.on("ice-candidate", ({ roomId, candidate }) => {
            socket.to(roomId).emit("ice-candidate", candidate);
        });

        socket.on("disconnect", () => {
            for (const id in rooms) {
                const room = rooms[id];

                // 👤 Guest left
                if (room.guest === socket.id) {
                    io.to(room.host).emit("user-left", {
                        email: room.guestEmail,
                    });
                    room.guest = null;
                    room.guestEmail = null;
                }

                // 👑 Host left → meeting ends
                if (room.host === socket.id) {
                    if (room.guest) {
                        io.to(room.guest).emit("host-left");
                    }
                    delete rooms[id];
                }
            }
        });
    });
}

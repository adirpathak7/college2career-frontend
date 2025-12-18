import express from "express";

const router = express.Router();

const MEETING_POOL = [
    "c2c-meet-7p@xq8",
    "c2c-meet-jK6C@zSU",
    "c2c-meet-ZFDE36LV",
    "c2c-meet-e7xYN7IF",
    "c2c-meet-6uV3JDQA",
    "c2c-meet-srkKiliZ",
    "c2c-meet-7WN7fIKB",
    "c2c-meet-gei8tVv0",
    "c2c-meet-otOU95aO",
    "c2c-meet-ysD49zLU",
];

router.get("/create-meeting", (req, res) => {
    const randomIndex = Math.floor(Math.random() * MEETING_POOL.length);
    const meetingId = MEETING_POOL[randomIndex];

    res.json({
        status: true,
        meetingId,
    });
});

router.get("/validate/:meetingId", (req, res) => {
    const { meetingId } = req.params;

    const isValid = MEETING_POOL.includes(meetingId);

    res.json({
        valid: isValid,
    });
});

export default router;

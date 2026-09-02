const express = require("express");
const router = express.Router();

const db = require("../lib/db");

/* GET /api/admin/announcements */
router.get("/", (req, res) => {
    const data = db.read();
    return res.json({
        success: true,
        count: data.announcements.length,
        announcements: data.announcements
    });
});

/* POST /api/admin/announcements */
router.post("/", (req, res) => {
    const { title, body, audience = "all" } = req.body;

    if (!title || !body) {
        return res.status(400).json({ success: false, message: "title and body are required." });
    }

    const data = db.read();

    const newAnnouncement = {
        id: `ANN-${String(data.announcements.length + 1).padStart(3, "0")}`,
        title,
        body,
        audience,
        postedAt: new Date().toISOString()
    };

    data.announcements.push(newAnnouncement);
    db.write(data);

    return res.status(201).json({ success: true, announcement: newAnnouncement });
});

/* DELETE /api/admin/announcements/:id */
router.delete("/:id", (req, res) => {
    const data = db.read();
    const exists = data.announcements.some(a => a.id === req.params.id);

    if (!exists) {
        return res.status(404).json({ success: false, message: "Announcement not found." });
    }

    data.announcements = data.announcements.filter(a => a.id !== req.params.id);
    db.write(data);

    return res.json({ success: true, message: "Announcement deleted successfully." });
});

module.exports = router;

const express = require("express");
const router = express.Router();

const db = require("../lib/db");

/* GET /api/admin/resources */
router.get("/", (req, res) => {
    const { cohort = "all" } = req.query;
    const data = db.read();

    let resources = data.resources;

    if (cohort !== "all") {
        resources = resources.filter(r => r.cohort === cohort || r.cohort === "all");
    }

    return res.json({ success: true, count: resources.length, resources });
});

/* POST /api/admin/resources */
router.post("/", (req, res) => {
    const { title, type, cohort = "all" } = req.body;

    if (!title || !type) {
        return res.status(400).json({ success: false, message: "title and type are required." });
    }

    const data = db.read();

    const newResource = {
        id: `RES-${String(data.resources.length + 1).padStart(3, "0")}`,
        title,
        type,
        cohort,
        uploadedAt: new Date().toISOString()
    };

    data.resources.push(newResource);
    db.write(data);

    return res.status(201).json({ success: true, resource: newResource });
});

/* DELETE /api/admin/resources/:id */
router.delete("/:id", (req, res) => {
    const data = db.read();
    const exists = data.resources.some(r => r.id === req.params.id);

    if (!exists) {
        return res.status(404).json({ success: false, message: "Resource not found." });
    }

    data.resources = data.resources.filter(r => r.id !== req.params.id);
    db.write(data);

    return res.json({ success: true, message: "Resource deleted successfully." });
});

module.exports = router;

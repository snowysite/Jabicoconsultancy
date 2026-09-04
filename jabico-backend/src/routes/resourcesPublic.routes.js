const express = require("express");
const router = express.Router();

const db = require("../lib/db");

/* =========================================================
   STUDENT-FACING RESOURCES

   Only ever shows resources an admin has published.
   Matches resources.html / js/resources.js.
========================================================= */

function toListItem(resource) {
    const { fileData, ...rest } = resource;
    return { ...rest, hasFile: Boolean(fileData) };
}

/* GET /api/resources */
router.get("/", (req, res) => {
    const data = db.read();

    const resources = data.resources
        .filter(r => r.status === "published")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({
        success: true,
        count: resources.length,
        resources: resources.map(toListItem)
    });
});

/* GET /api/resources/:id/download */
router.get("/:id/download", (req, res) => {
    const data = db.read();
    const resource = data.resources.find(
        r => r.id === req.params.id && r.status === "published"
    );

    if (!resource) {
        return res.status(404).json({ success: false, message: "Resource not found." });
    }

    if (!resource.fileData) {
        return res.status(404).json({ success: false, message: "This resource has no file attached." });
    }

    resource.downloads = (Number(resource.downloads) || 0) + 1;
    db.write(data);

    const buffer = Buffer.from(resource.fileData, "base64");

    res.setHeader("Content-Type", resource.fileType || "application/octet-stream");
    res.setHeader(
        "Content-Disposition",
        `inline; filename="${(resource.fileName || "download").replace(/"/g, "")}"`
    );

    return res.send(buffer);
});

module.exports = router;

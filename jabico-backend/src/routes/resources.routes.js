const express = require("express");
const router = express.Router();

const db = require("../lib/db");

/* =========================================================
   ADMIN RESOURCES

   A resource is an uploaded file (stored as base64 in
   fileData) plus metadata. Students only ever see
   resources with status "published" - see
   resourcesPublic.routes.js for the student-facing view.
========================================================= */

function toListItem(resource) {
    // Omit the (potentially large) base64 payload from list
    // responses - the admin UI fetches it only when needed
    // via the dedicated download route.
    const { fileData, ...rest } = resource;
    return { ...rest, hasFile: Boolean(fileData) };
}

/* GET /api/admin/resources */
router.get("/", (req, res) => {
    const data = db.read();

    const resources = [...data.resources].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json({
        success: true,
        count: resources.length,
        resources: resources.map(toListItem)
    });
});

/* GET /api/admin/resources/:id/download */
router.get("/:id/download", (req, res) => {
    const data = db.read();
    const resource = data.resources.find(r => r.id === req.params.id);

    if (!resource) {
        return res.status(404).json({ success: false, message: "Resource not found." });
    }

    if (!resource.fileData) {
        return res.status(404).json({ success: false, message: "This resource has no file attached." });
    }

    const buffer = Buffer.from(resource.fileData, "base64");

    res.setHeader("Content-Type", resource.fileType || "application/octet-stream");
    res.setHeader(
        "Content-Disposition",
        `inline; filename="${(resource.fileName || "download").replace(/"/g, "")}"`
    );

    return res.send(buffer);
});

/* POST /api/admin/resources */
router.post("/", (req, res) => {
    const {
        title,
        category,
        description = "",
        status = "published",
        fileName,
        fileType,
        fileSize,
        fileData
    } = req.body;

    if (!title || !category) {
        return res.status(400).json({
            success: false,
            message: "title and category are required."
        });
    }

    if (!fileData) {
        return res.status(400).json({
            success: false,
            message: "Please attach a file to upload."
        });
    }

    const data = db.read();

    const newResource = {
        id: `resource-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        category,
        description,
        status,
        fileName: fileName || "file",
        fileType: fileType || "application/octet-stream",
        fileSize: fileSize || 0,
        fileData,
        downloads: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    data.resources.push(newResource);
    db.write(data);

    return res.status(201).json({ success: true, resource: toListItem(newResource) });
});

/* PUT /api/admin/resources/:id */
router.put("/:id", (req, res) => {
    const data = db.read();
    const resource = data.resources.find(r => r.id === req.params.id);

    if (!resource) {
        return res.status(404).json({ success: false, message: "Resource not found." });
    }

    const { title, category, description, status, fileName, fileType, fileSize, fileData } = req.body;

    if (title !== undefined) resource.title = title;
    if (category !== undefined) resource.category = category;
    if (description !== undefined) resource.description = description;
    if (status !== undefined) resource.status = status;

    // Only replace the file if a new one was actually uploaded
    if (fileData) {
        resource.fileName = fileName || resource.fileName;
        resource.fileType = fileType || resource.fileType;
        resource.fileSize = fileSize || resource.fileSize;
        resource.fileData = fileData;
    }

    resource.updatedAt = new Date().toISOString();

    db.write(data);

    return res.json({ success: true, resource: toListItem(resource) });
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

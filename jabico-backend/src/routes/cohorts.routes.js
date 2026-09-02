const express = require("express");
const router = express.Router();

const db = require("../lib/db");

/* GET /api/admin/cohorts */
router.get("/", (req, res) => {
    const data = db.read();
    return res.json({ success: true, count: data.cohorts.length, cohorts: data.cohorts });
});

/* GET /api/admin/cohorts/:id */
router.get("/:id", (req, res) => {
    const data = db.read();
    const cohort = data.cohorts.find(c => c.id === req.params.id);

    if (!cohort) {
        return res.status(404).json({ success: false, message: "Cohort not found." });
    }

    return res.json({ success: true, cohort });
});

/* POST /api/admin/cohorts */
router.post("/", (req, res) => {
    const {
        name,
        program,
        status = "active",
        startDate,
        endDate,
        maxStudents,
        instructor,
        description
    } = req.body;

    if (!name || !program) {
        return res.status(400).json({
            success: false,
            message: "name and program are required."
        });
    }

    const data = db.read();

    const newCohort = {
        id: `cohort-${String(data.cohorts.length + 1).padStart(2, "0")}`,
        name,
        program,
        status,
        startDate: startDate || null,
        endDate: endDate || null,
        maxStudents: maxStudents ? Number(maxStudents) : 30,
        instructor: instructor || "Admin Team",
        description: description || ""
    };

    data.cohorts.push(newCohort);
    db.write(data);

    return res.status(201).json({ success: true, cohort: newCohort });
});

/* PUT /api/admin/cohorts/:id */
router.put("/:id", (req, res) => {
    const data = db.read();
    const cohort = data.cohorts.find(c => c.id === req.params.id);

    if (!cohort) {
        return res.status(404).json({ success: false, message: "Cohort not found." });
    }

    Object.assign(cohort, req.body);
    db.write(data);

    return res.json({ success: true, cohort });
});

/* DELETE /api/admin/cohorts/:id */
router.delete("/:id", (req, res) => {
    const data = db.read();
    const exists = data.cohorts.some(c => c.id === req.params.id);

    if (!exists) {
        return res.status(404).json({ success: false, message: "Cohort not found." });
    }

    data.cohorts = data.cohorts.filter(c => c.id !== req.params.id);
    db.write(data);

    return res.json({ success: true, message: "Cohort deleted successfully." });
});

module.exports = router;

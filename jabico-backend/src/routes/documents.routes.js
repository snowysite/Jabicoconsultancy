const express = require("express");
const router = express.Router();

const db = require("../lib/db");

/* =========================================================
   GET /api/documents

   Matches js/documents.js. Mounted separately from
   /api/student/* because that's the exact path used
   in the existing frontend code.

   Documents are shared learning materials, not private
   per-student uploads - a document is visible to a
   student if its cohort is "all" or matches the
   student's own cohort.
========================================================= */

router.get("/", (req, res) => {
    const data = db.read();

    const student = data.students.find(s => s.id === req.student.sub);

    const documents = data.documents.filter(
        d => d.cohort === "all" || d.cohort === student?.cohort
    );

    return res.json({ success: true, count: documents.length, documents });
});

module.exports = router;

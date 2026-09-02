const express = require("express");
const router = express.Router();

const db = require("../lib/db");

/* =========================================================
   APPLICATIONS = STUDENTS WITH status "pending"

   index.html's registration form only collects firstName,
   lastName, email and password - there is no separate
   "application" record with its own fields. So a pending
   student registration IS the application waiting on
   admin review.

   Approving an application activates that same student
   record (status -> "active"). Rejecting removes it.
========================================================= */

function toApplication(student) {
    return {
        id: student.id,
        name: student.fullName,
        email: student.email,
        cohort: student.cohort,
        status: student.status,
        appliedAt: student.registeredAt
    };
}

/* =========================================================
   GET /api/admin/applications

   ?status=pending|approved|rejected|all (default: pending)
   ?search=&cohort=&sort=latest|oldest|name
========================================================= */

router.get("/", (req, res) => {
    const { status = "pending", search = "", cohort = "all", sort = "latest" } = req.query;

    const data = db.read();

    // "approved" applications are students whose status is "active"
    // "rejected" applications no longer exist as student records
    // (see reject route below), so that filter will always be empty.
    const statusMap = { approved: "active", pending: "pending" };

    let students = data.students;

    if (status !== "all") {
        const mapped = statusMap[status] || status;
        students = students.filter(s => s.status === mapped);
    } else {
        students = students.filter(s => s.status === "pending" || s.status === "active");
    }

    if (search) {
        const term = String(search).toLowerCase();
        students = students.filter(
            s => s.fullName.toLowerCase().includes(term) || s.email.toLowerCase().includes(term)
        );
    }

    if (cohort !== "all") {
        students = students.filter(s => s.cohort === cohort);
    }

    if (sort === "name") {
        students = [...students].sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sort === "oldest") {
        students = [...students].sort(
            (a, b) => new Date(a.registeredAt) - new Date(b.registeredAt)
        );
    } else {
        students = [...students].sort(
            (a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)
        );
    }

    return res.json({
        success: true,
        count: students.length,
        applications: students.map(toApplication)
    });
});

/* =========================================================
   GET /api/admin/applications/:id
========================================================= */

router.get("/:id", (req, res) => {
    const data = db.read();
    const student = data.students.find(s => s.id === req.params.id);

    if (!student) {
        return res.status(404).json({ success: false, message: "Application not found." });
    }

    return res.json({ success: true, application: toApplication(student) });
});

/* =========================================================
   POST /api/admin/applications/:id/approve

   Sets the student's status to "active" - same effect as
   the Students page's Suspend/Activate toggle.
========================================================= */

router.post("/:id/approve", (req, res) => {
    const { cohort } = req.body;

    const data = db.read();
    const student = data.students.find(s => s.id === req.params.id);

    if (!student) {
        return res.status(404).json({ success: false, message: "Application not found." });
    }

    student.status = "active";
    student.approvedAt = new Date().toISOString();

    if (cohort) {
        student.cohort = cohort;
    }

    db.write(data);

    return res.json({
        success: true,
        message: `${student.fullName}'s application has been approved.`,
        application: toApplication(student)
    });
});

/* =========================================================
   POST /api/admin/applications/:id/reject
   DELETE /api/admin/applications/:id

   Both remove the pending registration entirely.
========================================================= */

function rejectApplication(req, res) {
    const data = db.read();
    const student = data.students.find(s => s.id === req.params.id);

    if (!student) {
        return res.status(404).json({ success: false, message: "Application not found." });
    }

    const name = student.fullName;
    data.students = data.students.filter(s => s.id !== req.params.id);
    db.write(data);

    return res.json({
        success: true,
        message: `${name}'s application has been rejected.`
    });
}

router.post("/:id/reject", rejectApplication);
router.delete("/:id", rejectApplication);

module.exports = router;

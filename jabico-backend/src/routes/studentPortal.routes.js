const express = require("express");
const router = express.Router();

const db = require("../lib/db");

/* =========================================================
   GET /api/student/courses

   Matches js/my-courses.js - returns modules for the
   logged-in student's cohort.
========================================================= */

router.get("/courses", (req, res) => {
    const data = db.read();
    const student = data.students.find(s => s.id === req.student.sub);

    if (!student) {
        return res.status(404).json({ success: false, message: "Student not found." });
    }

    const courses = data.courses.filter(
        c => c.cohort === "all" || c.cohort === student.cohort
    );

    return res.json({ success: true, count: courses.length, courses });
});

/* =========================================================
   GET /api/student/schedule

   Matches js/schedule.js
========================================================= */

router.get("/schedule", (req, res) => {
    const data = db.read();
    const student = data.students.find(s => s.id === req.student.sub);

    if (!student) {
        return res.status(404).json({ success: false, message: "Student not found." });
    }

    const schedule = data.schedule.filter(
        s => s.cohort === "all" || s.cohort === student.cohort
    );

    return res.json({ success: true, count: schedule.length, schedule });
});

/* =========================================================
   GET /api/student/notifications
   PATCH /api/student/notifications/:id/read

   Matches js/notifications.js
========================================================= */

router.get("/notifications", (req, res) => {
    const data = db.read();

    const notifications = data.notifications.filter(
        n => n.studentId === req.student.sub
    );

    return res.json({
        success: true,
        count: notifications.length,
        notifications
    });
});

router.patch("/notifications/:id/read", (req, res) => {
    const data = db.read();
    const notification = data.notifications.find(
        n => n.id === req.params.id && n.studentId === req.student.sub
    );

    if (!notification) {
        return res.status(404).json({ success: false, message: "Notification not found." });
    }

    notification.read = true;
    db.write(data);

    return res.json({ success: true, notification });
});

module.exports = router;

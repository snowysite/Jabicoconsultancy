const express = require("express");
const router = express.Router();

const db = require("../lib/db");
const { hashPassword } = require("../lib/auth");

function publicStudent(student) {
    const { passwordHash, ...rest } = student;
    return rest;
}

/* =========================================================
   GET /api/admin/students

   Matches the filter/sort query params used by
   js/admin-students.js's filterStudents():
   ?search=&cohort=&status=&sort=
========================================================= */

router.get("/", (req, res) => {
    const { search = "", cohort = "all", status = "all", sort = "latest" } = req.query;

    const data = db.read();
    let students = data.students;

    if (search) {
        const term = String(search).toLowerCase();
        students = students.filter(
            s =>
                s.fullName.toLowerCase().includes(term) ||
                s.email.toLowerCase().includes(term)
        );
    }

    if (cohort !== "all") {
        students = students.filter(s => s.cohort === cohort);
    }

    if (status !== "all") {
        students = students.filter(s => s.status === status);
    }

    if (sort === "name") {
        students = [...students].sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sort === "progress") {
        students = [...students].sort((a, b) => b.progress - a.progress);
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
        students: students.map(publicStudent)
    });
});

/* =========================================================
   GET /api/admin/students/:id
========================================================= */

router.get("/:id", (req, res) => {
    const data = db.read();
    const student = data.students.find(s => s.id === req.params.id);

    if (!student) {
        return res.status(404).json({ success: false, message: "Student not found." });
    }

    return res.json({ success: true, student: publicStudent(student) });
});

/* =========================================================
   POST /api/admin/students

   Matches the "Add Student" form fields in
   admin-students.html: firstName, lastName, email, cohort, status
========================================================= */

router.post("/", (req, res) => {
    const { firstName, lastName, email, cohort, status = "pending" } = req.body;

    if (!firstName || !lastName || !email || !cohort) {
        return res.status(400).json({
            success: false,
            message: "First name, last name, email and cohort are required."
        });
    }

    const data = db.read();

    const emailExists = data.students.some(
        s => s.email.toLowerCase() === String(email).toLowerCase()
    );

    if (emailExists) {
        return res.status(409).json({
            success: false,
            message: "A student with this email already exists."
        });
    }

    const tempPassword = Math.random().toString(36).slice(-10);

    const newStudent = {
        id: `STU-${String(data.students.length + 1).padStart(3, "0")}`,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: String(email).toLowerCase(),
        passwordHash: hashPassword(tempPassword),
        cohort,
        status,
        role: "student",
        progress: 0,
        registeredAt: new Date().toISOString(),
        approvedAt: status === "active" ? new Date().toISOString() : null,
        lastLogin: null
    };

    data.students.push(newStudent);
    db.write(data);

    return res.status(201).json({
        success: true,
        message: "Student created successfully.",
        student: publicStudent(newStudent),
        temporaryPassword: tempPassword
    });
});

/* =========================================================
   PUT /api/admin/students/:id

   Full update - matches "Edit Student" reusing the same
   addStudentForm fields.
========================================================= */

router.put("/:id", (req, res) => {
    const data = db.read();
    const student = data.students.find(s => s.id === req.params.id);

    if (!student) {
        return res.status(404).json({ success: false, message: "Student not found." });
    }

    const { firstName, lastName, email, cohort, status } = req.body;

    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;
    if (firstName || lastName) student.fullName = `${student.firstName} ${student.lastName}`;
    if (email) student.email = String(email).toLowerCase();
    if (cohort) student.cohort = cohort;
    if (status) student.status = status;

    db.write(data);

    return res.json({
        success: true,
        message: "Student updated successfully.",
        student: publicStudent(student)
    });
});

/* =========================================================
   PATCH /api/admin/students/:id/status

   Matches the Suspend/Activate toggle in the "View Student"
   modal (js/admin-students.js -> suspendStudentBtn).
   Body: { status: "active" | "suspended" }
========================================================= */

router.patch("/:id/status", (req, res) => {
    const { status } = req.body;

    if (!["active", "pending", "suspended"].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "status must be one of: active, pending, suspended."
        });
    }

    const data = db.read();
    const student = data.students.find(s => s.id === req.params.id);

    if (!student) {
        return res.status(404).json({ success: false, message: "Student not found." });
    }

    student.status = status;

    if (status === "active" && !student.approvedAt) {
        student.approvedAt = new Date().toISOString();
    }

    db.write(data);

    return res.json({
        success: true,
        message: `Student status updated to ${status}.`,
        student: publicStudent(student)
    });
});

/* =========================================================
   DELETE /api/admin/students/:id
========================================================= */

router.delete("/:id", (req, res) => {
    const data = db.read();
    const exists = data.students.some(s => s.id === req.params.id);

    if (!exists) {
        return res.status(404).json({ success: false, message: "Student not found." });
    }

    data.students = data.students.filter(s => s.id !== req.params.id);
    db.write(data);

    return res.json({ success: true, message: "Student deleted successfully." });
});

module.exports = router;

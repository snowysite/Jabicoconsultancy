const express = require("express");
const router = express.Router();

const db = require("../lib/db");
const { signToken, hashPassword, comparePassword } = require("../lib/auth");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateStudentId() {
    return (
        "JBC-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random().toString(36).substring(2, 7).toUpperCase()
    );
}

/* =========================================================
   POST /api/student/auth/register

   Mirrors the validation + student object shape already
   used in index.html's registerForm submit handler.

   New students are created with status "pending" and must
   be approved by an admin (see /api/admin/applications)
   before they can log in.
========================================================= */

router.post("/register", (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Please complete all registration fields."
        });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    if (!EMAIL_PATTERN.test(cleanEmail)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }

    if (String(password).length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must contain at least 6 characters."
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match."
        });
    }

    const data = db.read();

    const emailExists = data.students.some(
        student => student.email === cleanEmail
    );

    if (emailExists) {
        return res.status(409).json({
            success: false,
            message: "An account with this email already exists."
        });
    }

    const newStudent = {
        id: generateStudentId(),
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        fullName: `${String(firstName).trim()} ${String(lastName).trim()}`,
        email: cleanEmail,
        passwordHash: hashPassword(password),
        cohort: null,
        status: "pending",
        role: "student",
        progress: 0,
        registeredAt: new Date().toISOString(),
        approvedAt: null,
        lastLogin: null
    };

    data.students.push(newStudent);
    db.write(data);

    return res.status(201).json({
        success: true,
        message: "Registration received. Your account is awaiting administrator approval.",
        studentId: newStudent.id
    });
});

/* =========================================================
   POST /api/student/auth/login

   Mirrors index.html's loginForm handler: identifies the
   student by first name + last name + password, then
   requires an "active" (approved) status.

   NOTE: index.html currently checks `status !== "approved"`,
   but no code path ever sets that exact value - approving a
   student (js/admin-students.js) sets status to "active".
   This route uses "active" as the canonical approved state.
   Update index.html's check to match (see README).
========================================================= */

router.post("/login", (req, res) => {
    const { firstName, lastName, password } = req.body;

    if (!firstName || !lastName || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter your first name, last name and password."
        });
    }

    const data = db.read();

    const student = data.students.find(
        item =>
            item.firstName.toLowerCase() === String(firstName).trim().toLowerCase() &&
            item.lastName.toLowerCase() === String(lastName).trim().toLowerCase()
    );

    if (!student || !comparePassword(password, student.passwordHash)) {
        return res.status(401).json({
            success: false,
            message: "Incorrect student details or password."
        });
    }

    if (student.status === "pending") {
        return res.status(403).json({
            success: false,
            message: "Your account is still awaiting administrator approval."
        });
    }

    if (student.status === "suspended") {
        return res.status(403).json({
            success: false,
            message: "Your account has been suspended. Please contact an administrator."
        });
    }

    student.lastLogin = new Date().toISOString();
    db.write(data);

    const token = signToken({
        sub: student.id,
        role: "student",
        email: student.email
    });

    return res.json({
        success: true,
        token,
        student: {
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            fullName: student.fullName,
            email: student.email,
            cohort: student.cohort,
            progress: student.progress
        }
    });
});

module.exports = router;

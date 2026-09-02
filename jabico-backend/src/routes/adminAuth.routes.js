const express = require("express");
const router = express.Router();

const db = require("../lib/db");
const { signToken, comparePassword } = require("../lib/auth");

/* =========================================================
   POST /api/admin/auth/login

   Matches the DEMO_ADMIN check in js/admin-login.js:
   email: admin@jabicoconsultancy.com
   password: Admin@123
========================================================= */

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide both email and password."
        });
    }

    const data = db.read();

    const admin = data.admins.find(
        item => item.email.toLowerCase() === String(email).toLowerCase()
    );

    if (!admin || !comparePassword(password, admin.passwordHash)) {
        return res.status(401).json({
            success: false,
            message: "Incorrect email or password."
        });
    }

    const token = signToken({
        sub: admin.id,
        role: "admin",
        email: admin.email
    });

    return res.json({
        success: true,
        token,
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email
        }
    });
});

module.exports = router;

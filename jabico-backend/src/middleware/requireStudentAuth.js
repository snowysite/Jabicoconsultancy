const { verifyToken } = require("../lib/auth");

/* =========================================================
   PROTECTS ALL /api/student/* ROUTES EXCEPT REGISTER/LOGIN

   Expects: Authorization: Bearer <token>
========================================================= */

function requireStudentAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            success: false,
            message: "Missing or malformed Authorization header."
        });
    }

    try {
        const payload = verifyToken(token);

        if (payload.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "This action requires a student account."
            });
        }

        req.student = payload;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session. Please log in again."
        });
    }
}

module.exports = requireStudentAuth;

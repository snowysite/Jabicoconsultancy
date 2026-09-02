const { verifyToken } = require("../lib/auth");

/* =========================================================
   PROTECTS ALL /api/admin/* ROUTES EXCEPT LOGIN

   Expects: Authorization: Bearer <token>
========================================================= */

function requireAdminAuth(req, res, next) {
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

        if (payload.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "This action requires an administrator account."
            });
        }

        req.admin = payload;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session. Please log in again."
        });
    }
}

module.exports = requireAdminAuth;

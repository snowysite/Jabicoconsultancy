require("dotenv").config({ quiet: true });

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const requireAdminAuth = require("./src/middleware/requireAdminAuth");
const requireStudentAuth = require("./src/middleware/requireStudentAuth");

const adminAuthRoutes = require("./src/routes/adminAuth.routes");
const studentAuthRoutes = require("./src/routes/studentAuth.routes");
const studentsRoutes = require("./src/routes/students.routes");
const applicationsRoutes = require("./src/routes/applications.routes");
const cohortsRoutes = require("./src/routes/cohorts.routes");
const resourcesRoutes = require("./src/routes/resources.routes");
const resourcesPublicRoutes = require("./src/routes/resourcesPublic.routes");
const announcementsRoutes = require("./src/routes/announcements.routes");
const studentPortalRoutes = require("./src/routes/studentPortal.routes");
const documentsRoutes = require("./src/routes/documents.routes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(morgan("dev"));

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "Jabico Consultancy API is running." });
});

/* =========================================================
   PUBLIC AUTH ROUTES (no token required)
========================================================= */

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/student/auth", studentAuthRoutes);

/* =========================================================
   PROTECTED ADMIN ROUTES
========================================================= */

app.use("/api/admin/students", requireAdminAuth, studentsRoutes);
app.use("/api/admin/applications", requireAdminAuth, applicationsRoutes);
app.use("/api/admin/cohorts", requireAdminAuth, cohortsRoutes);
app.use("/api/admin/resources", requireAdminAuth, resourcesRoutes);
app.use("/api/admin/announcements", requireAdminAuth, announcementsRoutes);

/* =========================================================
   PROTECTED STUDENT ROUTES
========================================================= */

app.use("/api/student", requireStudentAuth, studentPortalRoutes);
app.use("/api/documents", requireStudentAuth, documentsRoutes);
app.use("/api/resources", requireStudentAuth, resourcesPublicRoutes);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `No route matches ${req.method} ${req.originalUrl}`
    });
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
        return res.status(400).json({
            success: false,
            message: "Malformed JSON in request body."
        });
    }

    console.error(err);
    res.status(500).json({
        success: false,
        message: "Something went wrong on the server."
    });
});

app.listen(PORT, () => {
    console.log(`Jabico Consultancy API running on http://localhost:${PORT}`);
});

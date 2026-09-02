/* =========================================================
   SIMPLE JSON FILE DATABASE

   Zero native dependencies on purpose, so this runs
   anywhere Node runs with no build step.

   Swap this file out for a real database (Postgres,
   MongoDB, etc.) later without touching the routes -
   every route only calls db.read() / db.write().
========================================================= */

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

function read() {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
}

function write(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = { read, write };

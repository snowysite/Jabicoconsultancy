/* =========================================================
   JABICO CONSULTANCY
   ADMIN APPLICATIONS - BACKEND CONNECTED
========================================================= */

"use strict";

const ADMIN_TOKEN_KEY = "jabicoAdminToken";
const ADMIN_SESSION_KEY = "jabicoAdminAuthenticated";
const STUDENTS_KEY = "jabicoStudents";

const $ = id => document.getElementById(id);
const applicationsTableBody = $("applicationsTableBody");
const emptyApplications = $("emptyApplications");
const emptyTitle = $("emptyTitle");
const emptyMessage = $("emptyMessage");
const applicationSearch = $("applicationSearch");
const statusFilter = $("statusFilter");
const pendingCount = $("pendingCount");
const approvedCount = $("approvedCount");
const rejectedCount = $("rejectedCount");
const totalCount = $("totalCount");
const sidebarPendingCount = $("sidebarPendingCount");
const notificationDot = $("notificationDot");
const applicationModal = $("applicationModal");
const closeApplicationModal = $("closeApplicationModal");
const modalAvatar = $("modalAvatar");
const modalStudentName = $("modalStudentName");
const modalStudentId = $("modalStudentId");
const modalStudentEmail = $("modalStudentEmail");
const modalStudentDate = $("modalStudentDate");
const modalStudentStatus = $("modalStudentStatus");
const modalApprove = $("modalApprove");
const modalReject = $("modalReject");
const applicationExtraDetails = $("applicationExtraDetails");

let applications = [];
let selectedStudentId = null;
let loadingApplications = false;

function checkAdminAuthentication() {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) !== "true" || !token) {
        window.location.href = "admin-login.html";
        return false;
    }
    return true;
}

function getToken() { return sessionStorage.getItem(ADMIN_TOKEN_KEY); }

async function api(path, options = {}) {
    const token = getToken();
    if (!token) throw new Error("Your admin session has expired. Please log in again.");

    const headers = { Accept: "application/json", ...(options.headers || {}) };
    headers.Authorization = `Bearer ${token}`;
    if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        throw new Error("Your admin session has expired. Please log in again.");
    }
    if (!response.ok || data.success === false) throw new Error(data.message || "Request failed.");
    return data;
}

function escapeHTML(value) {
    const element = document.createElement("div");
    element.textContent = String(value ?? "");
    return element.innerHTML;
}

function escapeAttribute(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getStudentName(student) {
    return student.name || student.fullName || [student.firstName, student.lastName].filter(Boolean).join(" ").trim() || "Unnamed Student";
}

function getInitials(student) {
    const name = getStudentName(student).split(/\s+/).filter(Boolean);
    return ((name[0]?.[0] || "") + (name[1]?.[0] || "")).toUpperCase() || "ST";
}

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function normalizeStatus(status) {
    if (status === "active") return "approved";
    return status || "pending";
}

function getStatusClass(status) {
    switch (normalizeStatus(status)) {
        case "approved": return "status-approved";
        case "rejected": return "status-rejected";
        case "suspended": return "status-suspended";
        default: return "status-pending";
    }
}

function getStatusLabel(status) {
    return normalizeStatus(status).toUpperCase();
}

function updateCounts() {
    const pending = applications.filter(s => normalizeStatus(s.status) === "pending").length;
    const approved = applications.filter(s => normalizeStatus(s.status) === "approved").length;
    const rejected = applications.filter(s => normalizeStatus(s.status) === "rejected").length;
    totalCount.textContent = applications.length;
    pendingCount.textContent = pending;
    approvedCount.textContent = approved;
    rejectedCount.textContent = rejected;
    sidebarPendingCount.textContent = pending;
    notificationDot.style.display = pending > 0 ? "block" : "none";
}

function renderApplications() {
    const searchTerm = applicationSearch.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value || "all";
    let filtered = [...applications];

    if (selectedStatus !== "all") filtered = filtered.filter(s => normalizeStatus(s.status) === selectedStatus);
    if (searchTerm) {
        filtered = filtered.filter(s => {
            const name = getStudentName(s).toLowerCase();
            const email = String(s.email || "").toLowerCase();
            const id = String(s.id || "").toLowerCase();
            return name.includes(searchTerm) || email.includes(searchTerm) || id.includes(searchTerm);
        });
    }

    filtered.sort((a, b) => new Date(b.appliedAt || b.registeredAt || 0) - new Date(a.appliedAt || a.registeredAt || 0));
    applicationsTableBody.innerHTML = "";

    if (!filtered.length) {
        emptyApplications.hidden = false;
        emptyTitle.textContent = searchTerm || selectedStatus !== "all" ? "No Matching Applications" : "No Applications Yet";
        emptyMessage.textContent = searchTerm || selectedStatus !== "all" ? "Try changing your search or filter." : "Student applications will appear here when students register.";
        return;
    }

    emptyApplications.hidden = true;
    filtered.forEach(student => {
        const status = normalizeStatus(student.status);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><div class="student-cell"><div class="student-avatar">${escapeHTML(getInitials(student))}</div><div><strong>${escapeHTML(getStudentName(student))}</strong><span>Student Applicant</span></div></div></td>
            <td class="email-cell">${escapeHTML(student.email || "—")}</td>
            <td><span class="student-id">${escapeHTML(student.id || "—")}</span></td>
            <td>${formatDate(student.appliedAt || student.registeredAt)}</td>
            <td><span class="status-badge ${getStatusClass(status)}">${escapeHTML(getStatusLabel(status))}</span></td>
            <td><div class="action-buttons">
                <button type="button" class="table-action view" data-action="view" data-id="${escapeAttribute(student.id)}">View</button>
                ${status === "pending" ? `<button type="button" class="table-action approve" data-action="approve" data-id="${escapeAttribute(student.id)}">Accept</button><button type="button" class="table-action reject" data-action="reject" data-id="${escapeAttribute(student.id)}">Reject</button>` : ""}
            </div></td>`;
        applicationsTableBody.appendChild(row);
    });
}

async function loadApplications() {
    if (loadingApplications) return;
    loadingApplications = true;
    applicationsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;">Loading applications...</td></tr>`;
    try {
        const data = await api("/api/admin/applications?status=all&sort=latest");
        applications = Array.isArray(data.applications) ? data.applications : [];
        try { localStorage.setItem(STUDENTS_KEY, JSON.stringify(applications)); } catch (_) {}
        updateCounts();
        renderApplications();
    } catch (error) {
        console.error("Unable to load applications:", error);
        applications = [];
        updateCounts();
        emptyApplications.hidden = false;
        emptyTitle.textContent = "Unable to Load Applications";
        emptyMessage.textContent = error.message === "Failed to fetch" ? "Cannot connect to the backend. Make sure it is running on port 4000." : error.message;
        applicationsTableBody.innerHTML = "";
        if (/session has expired|log in again/i.test(error.message)) setTimeout(() => { window.location.href = "admin-login.html"; }, 1200);
    } finally {
        loadingApplications = false;
    }
}

function findApplication(id) { return applications.find(s => String(s.id) === String(id)); }

function openApplication(studentId) {
    const student = findApplication(studentId);
    if (!student) return alert("Student application could not be found.");
    selectedStudentId = student.id;
    modalAvatar.textContent = getInitials(student);
    modalStudentName.textContent = getStudentName(student);
    modalStudentId.textContent = student.id || "—";
    modalStudentEmail.textContent = student.email || "—";
    modalStudentDate.textContent = formatDate(student.appliedAt || student.registeredAt);
    modalStudentStatus.textContent = getStatusLabel(student.status);

    const excluded = new Set(["id", "name", "fullName", "firstName", "lastName", "email", "status", "appliedAt", "registeredAt", "approvedAt", "rejectedAt"]);
    const details = Object.entries(student).filter(([key, value]) => !excluded.has(key) && value !== null && value !== undefined && value !== "");
    applicationExtraDetails.innerHTML = details.length
        ? details.map(([key, value]) => `<div class="detail-item"><span>${escapeHTML(key.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase()))}</span><strong>${escapeHTML(String(value))}</strong></div>`).join("")
        : `<div class="detail-item"><span>Application Details</span><strong>No additional information submitted.</strong></div>`;

    const pending = normalizeStatus(student.status) === "pending";
    modalApprove.style.display = pending ? "inline-flex" : "none";
    modalReject.style.display = pending ? "inline-flex" : "none";
    applicationModal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeApplication() {
    applicationModal.hidden = true;
    selectedStudentId = null;
    document.body.style.overflow = "";
}

async function approveStudent(studentId) {
    const student = findApplication(studentId);
    if (!student || normalizeStatus(student.status) !== "pending") return alert("This application has already been processed.");
    const name = getStudentName(student);
    if (!window.confirm(`Approve ${name}?`)) return;
    try {
        await api(`/api/admin/applications/${encodeURIComponent(studentId)}/approve`, { method: "POST", body: JSON.stringify({}) });
        closeApplication();
        await loadApplications();
        alert(`${name} has been approved successfully.`);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function rejectStudent(studentId) {
    const student = findApplication(studentId);
    if (!student || normalizeStatus(student.status) !== "pending") return alert("This application has already been processed.");
    const name = getStudentName(student);
    if (!window.confirm(`Reject ${name}'s application?`)) return;
    try {
        await api(`/api/admin/applications/${encodeURIComponent(studentId)}/reject`, { method: "POST", body: JSON.stringify({}) });
        closeApplication();
        await loadApplications();
        alert(`${name}'s application has been rejected.`);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

applicationsTableBody.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const id = button.dataset.id;
    if (button.dataset.action === "view") openApplication(id);
    if (button.dataset.action === "approve") approveStudent(id);
    if (button.dataset.action === "reject") rejectStudent(id);
});

applicationSearch.addEventListener("input", renderApplications);
statusFilter.addEventListener("change", renderApplications);
closeApplicationModal.addEventListener("click", closeApplication);
applicationModal.addEventListener("click", event => { if (event.target === applicationModal) closeApplication(); });
modalApprove.addEventListener("click", () => { if (selectedStudentId) approveStudent(selectedStudentId); });
modalReject.addEventListener("click", () => { if (selectedStudentId) rejectStudent(selectedStudentId); });

const logoutButton = $("logoutButton");
const logoutModal = $("logoutModal");
const cancelLogout = $("cancelLogout");
const confirmLogout = $("confirmLogout");
logoutButton?.addEventListener("click", () => { logoutModal.hidden = false; document.body.style.overflow = "hidden"; });
cancelLogout?.addEventListener("click", () => { logoutModal.hidden = true; document.body.style.overflow = ""; });
confirmLogout?.addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem("jabicoAdminEmail");
    sessionStorage.removeItem("jabicoAdminName");
    window.location.href = "admin-login.html";
});

if (checkAdminAuthentication()) loadApplications();

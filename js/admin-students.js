/* =========================================================
   JABICO CONSULTANCY
   ADMIN STUDENT MANAGEMENT JAVASCRIPT

   Connected to the real backend. Requires js/api-config.js
   (defines API_BASE_URL) to be loaded first.
========================================================= */


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =========================================================
   AUTH + API HELPER

   Matches the same conventions used in
   js/admin-login.js and js/applications.js.
========================================================= */

const ADMIN_TOKEN_KEY = "jabicoAdminToken";
const ADMIN_SESSION_KEY = "jabicoAdminAuthenticated";

function checkAdminAuthentication() {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) !== "true" || !token) {
        window.location.href = "admin-login.html";
        return false;
    }
    return true;
}

function getAdminToken() {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

async function api(path, options = {}) {

    const token = getAdminToken();

    if (!token) {
        throw new Error("Your admin session has expired. Please log in again.");
    }

    const headers = { Accept: "application/json", ...(options.headers || {}) };
    headers.Authorization = `Bearer ${token}`;

    if (options.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        throw new Error("Your admin session has expired. Please log in again.");
    }

    if (!response.ok || data.success === false) {
        throw new Error(data.message || "Request failed.");
    }

    return data;

}


/* =========================================================
   ELEMENTS
========================================================= */

const body = document.body;

const sidebar = $("#adminSidebar");
const sidebarOverlay = $("#sidebarOverlay");
const mobileMenuBtn = $("#mobileMenuBtn");
const themeToggle = $("#themeToggle");
const notificationBtn = $("#notificationBtn");
const notificationDropdown = $("#notificationDropdown");
const markNotificationsRead = $("#markNotificationsRead");
const profileButton = $("#profileButton");
const profileDropdown = $("#profileDropdown");

const studentSearch = $("#studentSearch");
const clearStudentSearch = $("#clearStudentSearch");
const cohortFilter = $("#cohortFilter");
const statusFilter = $("#statusFilter");
const sortStudents = $("#sortStudents");
const resetFilters = $("#resetFilters");
const emptyResetBtn = $("#emptyResetBtn");

const studentsEmpty = $("#studentsEmpty");
const studentsTableBody = $("#studentsTableBody");
const visibleStudentCount = $("#visibleStudentCount");
const selectedStudentCount = $("#selectedStudentCount");
const selectAllStudents = $("#selectAllStudents");
const mobileStudentList = $("#mobileStudentList");
const globalSearch = $("#globalSearch");

const addStudentModal = $("#addStudentModal");
const addStudentForm = $("#addStudentForm");
const addStudentTitle = $("#addStudentTitle");
const addStudentBtn = $("#addStudentBtn");

const viewStudentModal = $("#viewStudentModal");
const deleteStudentModal = $("#deleteStudentModal");
const studentActionMenu = $("#studentActionMenu");

const editStudentFromView = $("#editStudentFromView");
const suspendStudentBtn = $("#suspendStudentBtn");
const deleteStudentName = $("#deleteStudentName");
const confirmDeleteStudent = $("#confirmDeleteStudent");
const exportStudentsBtn = $("#exportStudentsBtn");

const adminToast = $("#adminToast");
const toastTitle = $("#toastTitle");
const toastMessage = $("#toastMessage");
const closeToast = $("#closeToast");


/* =========================================================
   STATE
========================================================= */

const state = {
    students: [],       // full list from the API
    visible: [],        // currently filtered/sorted list being shown
    selectedStudentId: null,
    actionStudentId: null,
    formMode: "add",     // "add" | "edit"

    currentFilters: {
        search: "",
        cohort: "all",
        status: "all",
        sort: "latest"
    }
};


/* =========================================================
   LOAD STUDENTS FROM API
========================================================= */

async function loadStudents() {

    try {

        const data = await api("/api/admin/students");

        state.students = data.students;

        filterStudents();

    } catch (error) {

        showToast("Could Not Load Students", error.message, "error");

        if (studentsTableBody) {
            studentsTableBody.innerHTML = "";
        }

    }

}


/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("show");
    mobileMenuBtn.setAttribute("aria-expanded", "true");
    body.style.overflow = "hidden";
}

function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("show");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    body.style.overflow = "";
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
        sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
}

document.addEventListener("click", event => {
    if (event.target.closest(".admin-nav-item") && window.innerWidth <= 900) {
        closeSidebar();
    }
});


/* =========================================================
   DARK MODE
========================================================= */

function updateThemeIcon() {
    if (!themeToggle) return;
    const icon = $("i", themeToggle);
    if (body.classList.contains("dark-mode")) {
        icon.className = "fas fa-sun";
        themeToggle.setAttribute("aria-label", "Switch to light mode");
    } else {
        icon.className = "fas fa-moon";
        themeToggle.setAttribute("aria-label", "Switch to dark mode");
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem("jabico-admin-theme");
    if (savedTheme === "dark") body.classList.add("dark-mode");
    updateThemeIcon();
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        const isDark = body.classList.contains("dark-mode");
        localStorage.setItem("jabico-admin-theme", isDark ? "dark" : "light");
        updateThemeIcon();
    });
}


/* =========================================================
   NOTIFICATIONS / PROFILE DROPDOWNS
========================================================= */

function closeNotificationDropdown() {
    if (!notificationDropdown) return;
    notificationDropdown.classList.remove("show");
    notificationBtn?.setAttribute("aria-expanded", "false");
}

if (notificationBtn) {
    notificationBtn.addEventListener("click", event => {
        event.stopPropagation();
        const isOpen = notificationDropdown.classList.contains("show");
        closeProfileDropdown();
        if (isOpen) {
            closeNotificationDropdown();
        } else {
            notificationDropdown.classList.add("show");
            notificationBtn.setAttribute("aria-expanded", "true");
        }
    });
}

if (markNotificationsRead) {
    markNotificationsRead.addEventListener("click", () => {
        const dot = $(".notification-dot");
        if (dot) dot.style.display = "none";
        showToast("Notifications", "All notifications have been marked as read.");
        closeNotificationDropdown();
    });
}

function closeProfileDropdown() {
    if (!profileDropdown) return;
    profileDropdown.hidden = true;
}

if (profileButton) {
    profileButton.addEventListener("click", event => {
        event.stopPropagation();
        closeNotificationDropdown();
        profileDropdown.hidden = !profileDropdown.hidden;
    });
}


/* =========================================================
   SEARCH
========================================================= */

if (globalSearch) {
    globalSearch.addEventListener("input", event => {
        const value = event.target.value.trim();
        if (value.length > 0) {
            studentSearch.value = value;
            state.currentFilters.search = value.toLowerCase();
            filterStudents();
        }
    });
}

if (studentSearch) {
    studentSearch.addEventListener("input", event => {
        state.currentFilters.search = event.target.value.trim().toLowerCase();
        clearStudentSearch.hidden = state.currentFilters.search.length === 0;
        filterStudents();
    });
}

if (clearStudentSearch) {
    clearStudentSearch.addEventListener("click", () => {
        studentSearch.value = "";
        state.currentFilters.search = "";
        clearStudentSearch.hidden = true;
        filterStudents();
        studentSearch.focus();
    });
}


/* =========================================================
   FILTERS
========================================================= */

if (cohortFilter) {
    cohortFilter.addEventListener("change", event => {
        state.currentFilters.cohort = event.target.value;
        filterStudents();
    });
}

if (statusFilter) {
    statusFilter.addEventListener("change", event => {
        state.currentFilters.status = event.target.value;
        filterStudents();
    });
}

if (sortStudents) {
    sortStudents.addEventListener("change", event => {
        state.currentFilters.sort = event.target.value;
        filterStudents();
    });
}


/* =========================================================
   FILTER + SORT (client-side over the loaded list)
========================================================= */

function filterStudents() {

    const { search, cohort, status, sort } = state.currentFilters;

    let filtered = [...state.students];

    if (search) {
        filtered = filtered.filter(s =>
            `${s.fullName} ${s.email}`.toLowerCase().includes(search)
        );
    }

    if (cohort !== "all") {
        filtered = filtered.filter(s => s.cohort === cohort);
    }

    if (status !== "all") {
        filtered = filtered.filter(s => s.status === status);
    }

    if (sort === "name") {
        filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sort === "progress") {
        filtered.sort((a, b) => b.progress - a.progress);
    } else if (sort === "oldest") {
        filtered.sort((a, b) => new Date(a.registeredAt) - new Date(b.registeredAt));
    } else {
        filtered.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
    }

    state.visible = filtered;

    render(filtered);

}


/* =========================================================
   RENDER (desktop table + mobile cards, both from data)
========================================================= */

function render(students) {

    visibleStudentCount.textContent = students.length;

    if (students.length === 0) {

        studentsEmpty.hidden = false;
        studentsTableBody.innerHTML = "";
        mobileStudentList.innerHTML = "";

    } else {

        studentsEmpty.hidden = true;
        studentsTableBody.innerHTML = students.map(renderRow).join("");
        mobileStudentList.innerHTML = students.map(renderMobileCard).join("");

    }

    attachRowListeners();
    updateSelectedCount();

}


function renderRow(student) {

    const initials = getInitials(student.fullName);
    const avatarClass = getAvatarClass(student.id);

    return `
        <tr class="student-row" data-id="${student.id}">
            <td>
                <label class="checkbox-wrapper">
                    <input type="checkbox" class="student-checkbox">
                    <span></span>
                </label>
            </td>
            <td>
                <div class="student-cell">
                    <div class="student-avatar ${avatarClass}">${initials}</div>
                    <div>
                        <strong>${escapeHTML(student.fullName)}</strong>
                        <span>${escapeHTML(student.email)}</span>
                    </div>
                </div>
            </td>
            <td><span class="cohort-badge">${formatCohort(student.cohort)}</span></td>
            <td class="progress-cell">
                <div class="progress-info"><span>${student.progress}%</span></div>
                <div class="progress-bar"><span style="width:${student.progress}%"></span></div>
            </td>
            <td>
                <span class="status-badge ${student.status}">
                    <i class="fas fa-circle"></i>
                    ${capitalize(student.status)}
                </span>
            </td>
            <td>${formatDate(student.registeredAt)}</td>
            <td>
                <button type="button" class="row-action-btn" data-action-menu aria-label="Student actions">
                    <i class="fas fa-ellipsis"></i>
                </button>
            </td>
        </tr>
    `;

}


function renderMobileCard(student) {

    const initials = getInitials(student.fullName);
    const avatarClass = getAvatarClass(student.id);

    return `
        <article class="mobile-student-card" data-id="${student.id}">
            <div class="mobile-student-top">
                <div class="student-avatar ${avatarClass}">${initials}</div>
                <div class="mobile-student-main">
                    <strong>${escapeHTML(student.fullName)}</strong>
                    <span>${escapeHTML(student.email)}</span>
                </div>
                <button type="button" class="mobile-student-more" data-mobile-action data-id="${student.id}" aria-label="Student actions">
                    <i class="fas fa-ellipsis"></i>
                </button>
            </div>
            <div class="mobile-student-meta">
                <div class="mobile-meta-item">
                    <span>Cohort</span>
                    <strong>${formatCohort(student.cohort)}</strong>
                </div>
                <div class="mobile-meta-item">
                    <span>Status</span>
                    <strong>
                        <span class="status-badge ${student.status}">
                            <i class="fas fa-circle"></i>
                            ${capitalize(student.status)}
                        </span>
                    </strong>
                </div>
            </div>
            <div class="mobile-progress">
                <div class="mobile-progress-header">
                    <span>Progress</span>
                    <strong>${student.progress}%</strong>
                </div>
                <div class="progress-bar"><span style="width:${student.progress}%"></span></div>
            </div>
        </article>
    `;

}


function attachRowListeners() {

    $$("[data-action-menu]", studentsTableBody).forEach(button => {
        button.addEventListener("click", event => {
            event.stopPropagation();
            const row = button.closest(".student-row");
            if (row) openActionMenu(button, row.dataset.id);
        });
    });

    $$("[data-mobile-action]", mobileStudentList).forEach(button => {
        button.addEventListener("click", event => {
            event.stopPropagation();
            openActionMenu(button, button.dataset.id);
        });
    });

    $$(".student-checkbox", studentsTableBody).forEach(checkbox => {
        checkbox.addEventListener("change", updateSelectedCount);
    });

}


/* =========================================================
   ACTION MENU
========================================================= */

function openActionMenu(button, studentId) {

    const rect = button.getBoundingClientRect();
    state.actionStudentId = studentId;
    studentActionMenu.hidden = false;

    const menuWidth = 180;
    let left = rect.right - menuWidth;
    let top = rect.bottom + 6;

    if (left < 10) left = 10;
    if (left + menuWidth > window.innerWidth - 10) left = window.innerWidth - menuWidth - 10;
    if (top + 220 > window.innerHeight) top = rect.top - 226;

    studentActionMenu.style.left = `${left}px`;
    studentActionMenu.style.top = `${top}px`;

}

function closeActionMenu() {
    studentActionMenu.hidden = true;
    state.actionStudentId = null;
}

$$("[data-student-action]", studentActionMenu).forEach(button => {
    button.addEventListener("click", () => {

        const action = button.dataset.studentAction;
        const student = findStudent(state.actionStudentId);

        closeActionMenu();

        if (!student) return;

        if (action === "view") openViewStudent(student);
        if (action === "edit") openEditStudent(student);
        if (action === "delete") openDeleteStudent(student);

        if (action === "message") {
            showToast("Message", `Messaging isn't wired up yet - would message ${student.fullName}.`);
        }

    });
});


document.addEventListener("click", event => {

    if (
        !event.target.closest(".student-action-menu") &&
        !event.target.closest("[data-action-menu]") &&
        !event.target.closest("[data-mobile-action]")
    ) {
        closeActionMenu();
    }

    if (!event.target.closest(".profile-dropdown") && !event.target.closest("#profileButton")) {
        closeProfileDropdown();
    }

    if (!event.target.closest(".notification-wrapper")) {
        closeNotificationDropdown();
    }

});


/* =========================================================
   VIEW STUDENT
========================================================= */

function openViewStudent(student) {

    $("#viewStudentAvatar").textContent = getInitials(student.fullName);
    $("#viewStudentName").textContent = student.fullName;
    $("#viewStudentEmail").textContent = student.email;
    $("#viewStudentId").textContent = student.id;
    $("#viewStudentCohort").textContent = formatCohort(student.cohort);
    $("#viewStudentJoined").textContent = formatDate(student.registeredAt);
    $("#viewStudentProgress").textContent = `${student.progress}%`;

    const statusElement = $("#viewStudentStatus");
    statusElement.className = `status-badge ${student.status}`;
    statusElement.innerHTML = `<i class="fas fa-circle"></i> ${capitalize(student.status)}`;

    state.selectedStudentId = student.id;

    suspendStudentBtn.innerHTML =
        student.status === "suspended"
            ? `<i class="fas fa-user-check"></i> Activate`
            : `<i class="fas fa-user-slash"></i> Suspend`;

    openModal(viewStudentModal);

}


if (suspendStudentBtn) {
    suspendStudentBtn.addEventListener("click", async () => {

        const student = findStudent(state.selectedStudentId);
        if (!student) return;

        const newStatus = student.status === "suspended" ? "active" : "suspended";

        try {

            await api(`/api/admin/students/${student.id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus })
            });

            closeModal(viewStudentModal);
            showToast("Status Updated", `${student.fullName} is now ${newStatus}.`);
            await loadStudents();

        } catch (error) {
            showToast("Update Failed", error.message, "error");
        }

    });
}


if (editStudentFromView) {
    editStudentFromView.addEventListener("click", () => {
        const student = findStudent(state.selectedStudentId);
        closeModal(viewStudentModal);
        if (student) openEditStudent(student);
    });
}


/* =========================================================
   ADD / EDIT STUDENT
========================================================= */

if (addStudentBtn) {
    addStudentBtn.addEventListener("click", () => {
        state.formMode = "add";
        state.selectedStudentId = null;
        addStudentTitle.textContent = "Add New Student";
        addStudentForm.reset();
        openModal(addStudentModal);
    });
}

function openEditStudent(student) {

    state.formMode = "edit";
    state.selectedStudentId = student.id;

    addStudentTitle.textContent = "Edit Student";

    $("#studentFirstName").value = student.firstName;
    $("#studentLastName").value = student.lastName;
    $("#studentEmail").value = student.email;
    $("#studentCohort").value = student.cohort || "cohort-01";
    $("#studentStatus").value = student.status;

    openModal(addStudentModal);

}

if (addStudentForm) {
    addStudentForm.addEventListener("submit", async event => {

        event.preventDefault();

        const payload = {
            firstName: $("#studentFirstName").value.trim(),
            lastName: $("#studentLastName").value.trim(),
            email: $("#studentEmail").value.trim(),
            cohort: $("#studentCohort").value,
            status: $("#studentStatus").value
        };

        const submitButton = $('button[type="submit"]', addStudentForm);
        const originalLabel = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Saving...`;

        try {

            if (state.formMode === "edit") {

                await api(`/api/admin/students/${state.selectedStudentId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload)
                });

                showToast("Student Updated", `${payload.firstName} ${payload.lastName}'s details were saved.`);

            } else {

                const result = await api("/api/admin/students", {
                    method: "POST",
                    body: JSON.stringify(payload)
                });

                showToast(
                    "Student Created",
                    `${payload.firstName} ${payload.lastName} was added. Temporary password: ${result.temporaryPassword}`
                );

            }

            closeModal(addStudentModal);
            addStudentForm.reset();
            await loadStudents();

        } catch (error) {

            showToast(
                state.formMode === "edit" ? "Update Failed" : "Creation Failed",
                error.message,
                "error"
            );

        } finally {

            submitButton.disabled = false;
            submitButton.innerHTML = originalLabel;

        }

    });
}


/* =========================================================
   DELETE STUDENT
========================================================= */

function openDeleteStudent(student) {
    state.selectedStudentId = student.id;
    deleteStudentName.textContent = student.fullName;
    openModal(deleteStudentModal);
}

if (confirmDeleteStudent) {
    confirmDeleteStudent.addEventListener("click", async () => {

        const student = findStudent(state.selectedStudentId);
        if (!student) return;

        try {

            await api(`/api/admin/students/${student.id}`, {
                method: "DELETE"
            });

            closeModal(deleteStudentModal);
            showToast("Student Deleted", `${student.fullName} has been removed.`);
            await loadStudents();

        } catch (error) {
            showToast("Delete Failed", error.message, "error");
        }

    });
}


/* =========================================================
   MODAL HELPERS
========================================================= */

function openModal(modal) {
    if (!modal) return;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    if (!$(".modal.show")) body.style.overflow = "";
}

$$("[data-close-modal]").forEach(button => {
    button.addEventListener("click", () => closeModal(button.closest(".modal")));
});

$$(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", () => closeModal(overlay.closest(".modal")));
});

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    closeActionMenu();
    closeNotificationDropdown();
    closeProfileDropdown();
    $$(".modal.show").forEach(closeModal);
});


/* =========================================================
   RESET FILTERS
========================================================= */

function resetAllFilters() {

    state.currentFilters = { search: "", cohort: "all", status: "all", sort: "latest" };

    studentSearch.value = "";
    cohortFilter.value = "all";
    statusFilter.value = "all";
    sortStudents.value = "latest";
    if (globalSearch) globalSearch.value = "";
    clearStudentSearch.hidden = true;

    filterStudents();

}

if (resetFilters) resetFilters.addEventListener("click", resetAllFilters);
if (emptyResetBtn) emptyResetBtn.addEventListener("click", resetAllFilters);


/* =========================================================
   SELECTION
========================================================= */

if (selectAllStudents) {
    selectAllStudents.addEventListener("change", event => {
        $$(".student-checkbox", studentsTableBody).forEach(checkbox => {
            checkbox.checked = event.target.checked;
        });
        updateSelectedCount();
    });
}

function updateSelectedCount() {

    const checkboxes = $$(".student-checkbox", studentsTableBody);
    const selected = checkboxes.filter(c => c.checked);

    selectedStudentCount.textContent = selected.length;

    if (selectAllStudents) {
        selectAllStudents.checked = checkboxes.length > 0 && selected.length === checkboxes.length;
    }

}


/* =========================================================
   EXPORT CSV
========================================================= */

if (exportStudentsBtn) {
    exportStudentsBtn.addEventListener("click", () => {

        const headers = ["Student ID", "Name", "Email", "Cohort", "Status", "Progress", "Registered"];

        const rows = state.visible.map(s => [
            s.id, s.fullName, s.email, formatCohort(s.cohort), capitalize(s.status), `${s.progress}%`, s.registeredAt
        ]);

        const csv = [headers, ...rows]
            .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "jabico-students.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        showToast("Export Complete", "Student data has been exported successfully.");

    });
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function showToast(title, message, type = "success") {

    if (!adminToast) return;

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    const icon = $(".toast-icon i", adminToast);
    const iconWrapper = $(".toast-icon", adminToast);

    if (type === "error") {
        icon.className = "fas fa-circle-exclamation";
        iconWrapper.style.background = "var(--danger-light)";
        iconWrapper.style.color = "var(--danger)";
    } else {
        icon.className = "fas fa-check";
        iconWrapper.style.background = "var(--success-light)";
        iconWrapper.style.color = "var(--success)";
    }

    adminToast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => adminToast.classList.remove("show"), 4000);

}

if (closeToast) {
    closeToast.addEventListener("click", () => adminToast.classList.remove("show"));
}


/* =========================================================
   UTILITIES
========================================================= */

function findStudent(id) {
    return state.students.find(s => s.id === id);
}

function getInitials(name) {
    return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function getAvatarClass(id) {
    const classes = ["blue", "purple", "green", "orange", "red", "teal", "pink"];
    const numeric = parseInt(String(id).replace(/\D/g, ""), 10) || 0;
    return classes[numeric % classes.length];
}

function formatCohort(cohort) {
    const map = { "cohort-01": "Cohort 01", "cohort-02": "Cohort 02", "cohort-03": "Cohort 03" };
    return map[cohort] || cohort || "Unassigned";
}

function capitalize(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeStudentPage() {
    loadTheme();
    loadStudents();
}

if (checkAdminAuthentication()) {
    initializeStudentPage();
}

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeSidebar();
});

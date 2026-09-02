/* =========================================================
JABICO CONSULTANCY
ADMIN COHORT MANAGEMENT JAVASCRIPT

FRONTEND VERSION

Backend/API integration can later replace the local
DOM/data operations without changing the UI structure.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

"use strict";


/* =====================================================
   AUTH + API HELPER

   Matches the same conventions used in
   js/admin-login.js and js/applications.js.
====================================================== */

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

async function api(path, options = {}) {

    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);

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


if (!checkAdminAuthentication()) {
    return;
}


/* =====================================================
   ELEMENTS
====================================================== */

const sidebar =
    document.getElementById("adminSidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const createCohortButton =
    document.getElementById("createCohortButton");

const cohortModal =
    document.getElementById("cohortModal");

const deleteModal =
    document.getElementById("deleteModal");

const closeModal =
    document.getElementById("closeModal");

const cancelModal =
    document.getElementById("cancelModal");

const cancelDelete =
    document.getElementById("cancelDelete");

const confirmDelete =
    document.getElementById("confirmDelete");

const cohortForm =
    document.getElementById("cohortForm");

const modalTitle =
    document.getElementById("modalTitle");

const cohortGrid =
    document.getElementById("cohortGrid");

const emptyState =
    document.getElementById("emptyState");

const resetFilters =
    document.getElementById("resetFilters");

const globalSearch =
    document.getElementById("globalSearch");

const clearSearch =
    document.getElementById("clearSearch");

const programFilter =
    document.getElementById("programFilter");

const sortCohorts =
    document.getElementById("sortCohorts");

const deleteCohortName =
    document.getElementById("deleteCohortName");


/* =====================================================
   STATE

   This state object is intentionally kept simple.

   Later, these values can come from the backend/API.
====================================================== */

let currentFilter = "all";

let currentSearch = "";

let currentProgram = "all";

let currentSort = "newest";

let editingCard = null;

let deletingCard = null;


/* =====================================================
   SIDEBAR
====================================================== */

function openSidebar() {

    sidebar?.classList.add("open");

    sidebarOverlay?.classList.add("active");

    document.body.style.overflow = "hidden";

}


function closeSidebar() {

    sidebar?.classList.remove("open");

    sidebarOverlay?.classList.remove("active");

    document.body.style.overflow = "";

}


mobileMenuBtn?.addEventListener(
    "click",
    openSidebar
);


sidebarOverlay?.addEventListener(
    "click",
    closeSidebar
);


document
    .querySelectorAll(".admin-nav-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (
                    window.innerWidth <= 850
                ) {
                    closeSidebar();
                }

            }
        );

    });


/* =====================================================
   MODAL HELPERS
====================================================== */

function openModal(modal) {

    if (!modal) return;

    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

}


function closeAnyModal(modal) {

    if (!modal) return;

    modal.classList.remove("open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    if (
        !cohortModal?.classList.contains("open") &&
        !deleteModal?.classList.contains("open")
    ) {

        document.body.style.overflow = "";

    }

}


/* =====================================================
   CREATE COHORT
====================================================== */

createCohortButton?.addEventListener(
    "click",
    () => {

        editingCard = null;

        modalTitle.textContent =
            "Create New Cohort";

        cohortForm.reset();

        openModal(cohortModal);

    }
);


/* =====================================================
   CLOSE COHORT MODAL
====================================================== */

closeModal?.addEventListener(
    "click",
    () => {

        closeAnyModal(cohortModal);

    }
);


cancelModal?.addEventListener(
    "click",
    () => {

        closeAnyModal(cohortModal);

    }
);


/* =====================================================
   CLOSE DELETE MODAL
====================================================== */

cancelDelete?.addEventListener(
    "click",
    () => {

        deletingCard = null;

        closeAnyModal(deleteModal);

    }
);


/* =====================================================
   MODAL OVERLAY CLICK
====================================================== */

document
    .querySelectorAll(".modal-overlay")
    .forEach(overlay => {

        overlay.addEventListener(
            "click",
            () => {

                const modal =
                    overlay.closest(".modal");

                closeAnyModal(modal);

            }
        );

    });


/* =====================================================
   ESC KEY
====================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        closeSidebar();

        closeAnyModal(cohortModal);

        closeAnyModal(deleteModal);

        closeAllCohortMenus();

    }
);


/* =====================================================
   COHORT MENU
====================================================== */

function closeAllCohortMenus() {

    document
        .querySelectorAll(".cohort-menu.open")
        .forEach(menu => {

            menu.classList.remove("open");

        });

}


document
    .querySelectorAll(".cohort-menu-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const wrapper =
                    button.closest(
                        ".cohort-menu-wrapper"
                    );

                const menu =
                    wrapper?.querySelector(
                        ".cohort-menu"
                    );

                if (!menu) return;

                const wasOpen =
                    menu.classList.contains("open");

                closeAllCohortMenus();

                if (!wasOpen) {
                    menu.classList.add("open");
                }

            }
        );

    });


document.addEventListener(
    "click",
    () => {

        closeAllCohortMenus();

    }
);


/* =====================================================
   COHORT ACTIONS
====================================================== */

document
    .querySelectorAll("[data-action]")
    .forEach(element => {

        element.addEventListener(
            "click",
            event => {

                const action =
                    element.dataset.action;

                const card =
                    element.closest(
                        ".cohort-card"
                    );

                if (!card) return;

                event.stopPropagation();

                closeAllCohortMenus();


                if (action === "view") {

                    viewCohort(card);

                }


                if (action === "edit") {

                    editCohort(card);

                }


                if (action === "delete") {

                    askDeleteCohort(card);

                }

            }
        );

    });


/* =====================================================
   VIEW COHORT
====================================================== */

function viewCohort(card) {

    const name =
        card.dataset.name ||
        "Selected Cohort";

    /*
        FRONTEND PLACEHOLDER

        Later this can become:

        window.location.href =
            `admin-cohort-details.html?id=${id}`;

        or:

        router.push(`/admin/cohorts/${id}`);
    */

    showToast(
        `${name} selected`
    );

}


/* =====================================================
   EDIT COHORT
====================================================== */

function editCohort(card) {

    editingCard = card;

    modalTitle.textContent =
        "Edit Cohort";

    const name =
        card.dataset.name || "";

    const program =
        card.dataset.program || "";

    const status =
        card.dataset.status || "active";

    document.getElementById(
        "cohortName"
    ).value = name;

    document.getElementById(
        "cohortProgram"
    ).value = program;

    document.getElementById(
        "cohortStatus"
    ).value = status;

    openModal(cohortModal);

}

/* =====================================================
   DELETE COHORT
====================================================== */

function askDeleteCohort(card) {

    deletingCard = card;

    const name =
        card.dataset.name ||
        "this cohort";

    deleteCohortName.textContent =
        name;

    openModal(deleteModal);

}


/* =====================================================
   CONFIRM DELETE
====================================================== */

confirmDelete?.addEventListener(
    "click",
    async () => {

        if (!deletingCard) {
            return;
        }

        const name =
            deletingCard.dataset.name ||
            "Cohort";

        const id =
            deletingCard.dataset.id;

        try {

            if (id) {
                await api(`/api/admin/cohorts/${id}`, { method: "DELETE" });
            }

            deletingCard.remove();

            deletingCard = null;

            closeAnyModal(deleteModal);

            updateStatistics();

            applyFilters();

            showToast(
                `${name} deleted successfully`
            );

        } catch (error) {

            showToast(error.message, "error");

        }

    }
);


/* =====================================================
   CREATE / UPDATE FORM
====================================================== */

cohortForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const name =
            document.getElementById(
                "cohortName"
            ).value.trim();

        const program =
            document.getElementById(
                "cohortProgram"
            ).value;

        const status =
            document.getElementById(
                "cohortStatus"
            ).value;

        const startDate =
            document.getElementById(
                "startDate"
            ).value;

        const endDate =
            document.getElementById(
                "endDate"
            ).value;

        const maxStudents =
            document.getElementById(
                "maxStudents"
            ).value;

        const instructor =
            document.getElementById(
                "cohortInstructor"
            ).value.trim();

        const description =
            document.getElementById(
                "cohortDescription"
            ).value.trim();


        if (!name || !program) {

            showToast(
                "Please complete the required fields",
                "error"
            );

            return;

        }


        const payload = {
            name,
            program,
            status,
            startDate,
            endDate,
            maxStudents,
            instructor,
            description
        };


        const submitButton =
            cohortForm.querySelector('button[type="submit"]');

        const originalLabel =
            submitButton ? submitButton.innerHTML : "";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Saving...`;
        }


        try {

            /* =============================================
               EDIT EXISTING COHORT
            ============================================== */

            if (editingCard) {

                const id = editingCard.dataset.id;

                await api(`/api/admin/cohorts/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(payload)
                });

                closeAnyModal(cohortModal);

                cohortForm.reset();

                showToast(
                    `${name} updated successfully`
                );

                editingCard = null;

                await loadCohorts();

                return;

            }


            /* =============================================
               CREATE NEW COHORT
            ============================================== */

            await api("/api/admin/cohorts", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            closeAnyModal(cohortModal);

            cohortForm.reset();

            showToast(
                `${name} created successfully`
            );

            await loadCohorts();

        } catch (error) {

            showToast(error.message, "error");

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalLabel;
            }

        }

    }
);


/* =====================================================
   CREATE CARD
====================================================== */

function createCohortCard(data) {

    const card =
        document.createElement("article");

    card.className =
        "cohort-card";

    card.dataset.status =
        data.status;

    card.dataset.program =
        data.program;

    card.dataset.name =
        data.name;

    card.dataset.students =
        data.maxStudents || "0";


    const programIcon =
        getProgramIcon(
            data.program
        );


    const programClass =
        getProgramClass(
            data.program
        );


    const statusLabel =
        data.status.toUpperCase();


    card.innerHTML = `

        <div class="cohort-card-top">

            <div class="cohort-program-icon ${programClass}">
                <i class="${programIcon}"></i>
            </div>

            <div class="cohort-menu-wrapper">

                <button
                    class="cohort-menu-button"
                    type="button"
                    aria-label="Cohort options"
                >
                    <i class="fas fa-ellipsis-vertical"></i>
                </button>

                <div class="cohort-menu">

                    <button data-action="edit">
                        <i class="fas fa-pen"></i>
                        Edit
                    </button>

                    <button data-action="view">
                        <i class="fas fa-eye"></i>
                        View
                    </button>

                    <button
                        data-action="delete"
                        class="danger"
                    >
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>

                </div>

            </div>

        </div>


        <div class="cohort-card-body">

            <div class="status-row">

                <span class="cohort-status ${data.status}">
                    ${statusLabel}
                </span>

                <span class="cohort-id">
                    #JBC-${Date.now().toString().slice(-3)}
                </span>

            </div>

            <h3>
                ${escapeHTML(data.name)}
            </h3>

            <p>
                ${escapeHTML(
                    data.description ||
                    "Jabico Consultancy learning program"
                )}
            </p>


            <div class="cohort-details">

                <div>
                    <i class="fas fa-calendar"></i>
                    <span>
                        ${formatDateRange(
                            data.startDate,
                            data.endDate
                        )}
                    </span>
                </div>

                <div>
                    <i class="fas fa-user-group"></i>
                    <span>
                        ${data.maxStudents || 0}
                        Students
                    </span>
                </div>

                <div>
                    <i class="fas fa-user-tie"></i>
                    <span>
                        ${escapeHTML(
                            data.instructor ||
                            "Admin Team"
                        )}
                    </span>
                </div>

            </div>

        </div>


        <div class="cohort-card-footer">

            <div class="progress-wrapper">

                <div class="progress-label">

                    <span>
                        ${
                            data.status ===
                            "upcoming"
                                ? "Enrollment"
                                : "Progress"
                        }
                    </span>

                    <strong>
                        0%
                    </strong>

                </div>

                <div class="progress-bar">

                    <span
                        style="width:0%"
                    ></span>

                </div>

            </div>


            <button
                class="view-cohort"
                data-action="view"
                type="button"
            >
                View Cohort

                <i class="fas fa-arrow-right"></i>

            </button>

        </div>

    `;

    return card;

}


/* =====================================================
   ATTACH EVENTS TO DYNAMIC CARDS
====================================================== */

function attachCardEvents(card) {

    card
        .querySelectorAll("[data-action]")
        .forEach(element => {

            element.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const action =
                        element.dataset.action;

                    if (action === "view") {
                        viewCohort(card);
                    }

                    if (action === "edit") {
                        editCohort(card);
                    }

                    if (action === "delete") {
                        askDeleteCohort(card);
                    }

                }
            );

        });


    const menuButton =
        card.querySelector(
            ".cohort-menu-button"
        );


    const menu =
        card.querySelector(
            ".cohort-menu"
        );


    menuButton?.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            const open =
                menu.classList.contains(
                    "open"
                );

            closeAllCohortMenus();

            if (!open) {
                menu.classList.add("open");
            }

        }
    );

}


/* =====================================================
   FILTER TABS
====================================================== */

document
    .querySelectorAll(".filter-tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter-tab"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                tab.classList.add(
                    "active"
                );


                currentFilter =
                    tab.dataset.filter ||
                    "all";


                applyFilters();

            }
        );

    });


/* =====================================================
   SEARCH
====================================================== */

globalSearch?.addEventListener(
    "input",
    () => {

        currentSearch =
            globalSearch.value
                .trim()
                .toLowerCase();


        clearSearch.hidden =
            !currentSearch;


        applyFilters();

    }
);


clearSearch?.addEventListener(
    "click",
    () => {

        globalSearch.value = "";

        currentSearch = "";

        clearSearch.hidden = true;

        applyFilters();

        globalSearch.focus();

    }
);


/* =====================================================
   PROGRAM FILTER
====================================================== */

programFilter?.addEventListener(
    "change",
    () => {

        currentProgram =
            programFilter.value;

        applyFilters();

    }
);


/* =====================================================
   SORT
====================================================== */

sortCohorts?.addEventListener(
    "change",
    () => {

        currentSort =
            sortCohorts.value;

        sortCards();

    }
);


/* =====================================================
   APPLY FILTERS
====================================================== */

function applyFilters() {

    const cards =
        Array.from(
            cohortGrid.querySelectorAll(
                ".cohort-card"
            )
        );


    let visibleCount = 0;


    cards.forEach(card => {

        const status =
            card.dataset.status;

        const program =
            card.dataset.program;

        const name =
            (
                card.dataset.name ||
                ""
            ).toLowerCase();


        const matchesStatus =
            currentFilter === "all" ||
            status === currentFilter;


        const matchesProgram =
            currentProgram === "all" ||
            program === currentProgram;


        const matchesSearch =
            !currentSearch ||
            name.includes(
                currentSearch
            );


        const visible =
            matchesStatus &&
            matchesProgram &&
            matchesSearch;


        card.style.display =
            visible
                ? ""
                : "none";


        if (visible) {
            visibleCount++;
        }

    });


    emptyState.hidden =
        visibleCount !== 0;

}


/* =====================================================
   SORT CARDS
====================================================== */

function sortCards() {

    const cards =
        Array.from(
            cohortGrid.querySelectorAll(
                ".cohort-card"
            )
        );


    cards.sort(
        (a, b) => {

            if (
                currentSort ===
                "students"
            ) {

                return (
                    Number(
                        b.dataset.students ||
                        0
                    ) -
                    Number(
                        a.dataset.students ||
                        0
                    )
                );

            }


            if (
                currentSort ===
                "name"
            ) {

                return (
                    a.dataset.name ||
                    ""
                ).localeCompare(
                    b.dataset.name ||
                    ""
                );

            }


            if (
                currentSort ===
                "oldest"
            ) {

                return (
                    a.dataset.name ||
                    ""
                ).localeCompare(
                    b.dataset.name ||
                    ""
                );

            }


            return 0;

        }
    );


    cards.forEach(card => {

        cohortGrid.appendChild(
            card
        );

    });


    applyFilters();

}


/* =====================================================
   RESET FILTERS
====================================================== */

resetFilters?.addEventListener(
    "click",
    resetAllFilters
);


function resetAllFilters() {

    currentFilter = "all";

    currentSearch = "";

    currentProgram = "all";

    currentSort = "newest";


    if (globalSearch) {
        globalSearch.value = "";
    }


    if (programFilter) {
        programFilter.value = "all";
    }


    if (sortCohorts) {
        sortCohorts.value = "newest";
    }


    clearSearch.hidden = true;


    document
        .querySelectorAll(
            ".filter-tab"
        )
        .forEach(tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.filter === "all"
            );

        });


    applyFilters();

}


/* =====================================================
   STATISTICS
====================================================== */

function updateStatistics() {

    const cards =
        Array.from(
            cohortGrid.querySelectorAll(
                ".cohort-card"
            )
        );


    const total =
        cards.length;


    const active =
        cards.filter(
            card =>
                card.dataset.status ===
                "active"
        ).length;


    const upcoming =
        cards.filter(
            card =>
                card.dataset.status ===
                "upcoming"
        ).length;


    const students =
        cards.reduce(
            (
                total,
                card
            ) => {

                return (
                    total +
                    Number(
                        card.dataset.students ||
                        0
                    )
                );

            },
            0
        );


    const totalElement =
        document.getElementById(
            "totalCohorts"
        );


    const activeElement =
        document.getElementById(
            "activeCohorts"
        );


    const upcomingElement =
        document.getElementById(
            "upcomingCohorts"
        );


    const studentsElement =
        document.getElementById(
            "totalStudents"
        );


    if (totalElement) {
        totalElement.textContent =
            total;
    }


    if (activeElement) {
        activeElement.textContent =
            active;
    }


    if (upcomingElement) {
        upcomingElement.textContent =
            upcoming;
    }


    if (studentsElement) {
        studentsElement.textContent =
            students;
    }

}


/* =====================================================
   PROGRAM ICONS
====================================================== */

function getProgramIcon(program) {

    const icons = {

        "digital-marketing":
            "fas fa-bullhorn",

        "business":
            "fas fa-briefcase",

        "technology":
            "fas fa-code"

    };


    return (
        icons[program] ||
        "fas fa-users"
    );

}


function getProgramClass(program) {

    const classes = {

        "digital-marketing":
            "blue",

        "business":
            "purple",

        "technology":
            "green"

    };


    return (
        classes[program] ||
        "blue"
    );

}


/* =====================================================
   DATE FORMAT
====================================================== */

function formatDateRange(
    start,
    end
) {

    if (!start && !end) {
        return "Date not set";
    }


    if (!start) {
        return formatDate(end);
    }


    if (!end) {
        return formatDate(start);
    }


    return (
        `${formatDate(start)} – ${formatDate(end)}`
    );

}


function formatDate(dateString) {

    if (!dateString) {
        return "Date not set";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =====================================================
   ESCAPE HTML
   Prevents unsafe HTML insertion when dynamic data
   eventually comes from the backend.
====================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   TOAST NOTIFICATION
====================================================== */

function showToast(
    message,
    type = "success"
) {

    const existing =
        document.querySelector(
            ".admin-toast"
        );


    existing?.remove();


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `admin-toast ${type}`;


    toast.innerHTML = `

        <div class="toast-icon">

            <i class="${
                type === "error"
                    ? "fas fa-circle-exclamation"
                    : "fas fa-check"
            }"></i>

        </div>

        <span>
            ${escapeHTML(message)}
        </span>

    `;


    document.body.appendChild(
        toast
    );


    requestAnimationFrame(
        () => {

            toast.classList.add(
                "show"
            );

        }
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

            setTimeout(
                () => {
                    toast.remove();
                },
                250
            );

        },
        2800
    );

}


/* =====================================================
   TOAST STYLES
====================================================== */

const toastStyles =
    document.createElement("style");


toastStyles.textContent = `

    .admin-toast {
        position: fixed;
        right: 24px;
        bottom: 24px;
        z-index: 5000;

        display: flex;
        align-items: center;
        gap: 10px;

        min-width: 250px;

        padding: 12px 15px;

        border-radius: 11px;

        background: #ffffff;

        border: 1px solid #e5e7eb;

        box-shadow:
            0 18px 45px
            rgba(15,23,42,.16);

        color: #334155;

        font-size: 11px;
        font-weight: 600;

        transform:
            translateY(15px);

        opacity: 0;

        transition:
            opacity 220ms ease,
            transform 220ms ease;
    }

    .admin-toast.show {
        opacity: 1;
        transform:
            translateY(0);
    }

    .toast-icon {
        width: 28px;
        height: 28px;

        border-radius: 8px;

        display: grid;
        place-items: center;

        background: #ecfdf5;
        color: #16a34a;
    }

    .admin-toast.error .toast-icon {
        background: #fef2f2;
        color: #dc2626;
    }

    @media (max-width: 600px) {

        .admin-toast {
            left: 14px;
            right: 14px;
            bottom: 14px;

            min-width: 0;
        }

    }

`;


document.head.appendChild(
    toastStyles
);


/* =====================================================
   INITIALIZE
====================================================== */

document
    .querySelectorAll(".cohort-card")
    .forEach(card => {

        attachCardEvents(card);

    });


/* =====================================================
   LOAD COHORTS FROM API

   Replaces the demo cards that used to be pre-baked
   into admin-cohorts.html.
====================================================== */

async function loadCohorts() {

    cohortGrid.innerHTML = `
        <p style="padding:30px;text-align:center;color:var(--text-muted, #888);">
            Loading cohorts...
        </p>
    `;

    try {

        const data = await api("/api/admin/cohorts");

        cohortGrid.innerHTML = "";

        (data.cohorts || []).forEach(cohort => {

            const card = createCohortCard(cohort);
            card.dataset.id = cohort.id;

            const idBadge = card.querySelector(".cohort-id");
            if (idBadge) {
                idBadge.textContent = `#${cohort.id.toUpperCase()}`;
            }

            cohortGrid.appendChild(card);
            attachCardEvents(card);

        });

        updateStatistics();
        applyFilters();

    } catch (error) {

        cohortGrid.innerHTML = `
            <p style="padding:30px;text-align:center;color:var(--danger, #d33);">
                ${escapeHTML(
                    error.message === "Failed to fetch"
                        ? "Cannot connect to the backend. Make sure it is running."
                        : error.message
                )}
            </p>
        `;

        if (/session has expired|log in again/i.test(error.message)) {
            setTimeout(() => { window.location.href = "admin-login.html"; }, 1200);
        }

    }

}


loadCohorts();


/* =====================================================
   FUTURE BACKEND INTEGRATION NOTES

   Kept for reference - GET/POST/PUT/DELETE against
   /api/admin/cohorts are now live (see loadCohorts,
   the cohortForm submit handler, and confirmDelete
   above).
====================================================== */


});


/* =========================================
   JABICO CONSULTANCY
   MY COURSES JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================
       STUDENT AUTH + API HELPER
    ====================================== */

    const SESSION_KEY = "jabicoStudentSession";

    function getStudentToken() {
        try {
            const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
            return session?.token || null;
        } catch (error) {
            return null;
        }
    }

    async function api(path, options = {}) {

        const token = getStudentToken();

        if (!token) {
            throw new Error("Your session has expired. Please log in again.");
        }

        const headers = { Accept: "application/json", ...(options.headers || {}) };
        headers.Authorization = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
            localStorage.removeItem(SESSION_KEY);
            throw new Error("Your session has expired. Please log in again.");
        }

        if (!response.ok || data.success === false) {
            throw new Error(data.message || "Request failed.");
        }

        return data;

    }


    /* =====================================
       ELEMENTS
    ====================================== */

    const coursesGrid =
        document.getElementById("coursesGrid");

    const emptyState =
        document.getElementById("emptyState");

    const searchInput =
        document.getElementById("searchInput");

    const statusFilter =
        document.getElementById("statusFilter");

    const courseCount =
        document.getElementById("courseCount");

    const refreshButton =
        document.getElementById("refreshButton");

    const clearSearch =
        document.getElementById("clearSearch");


    /* MODAL */

    const courseModal =
        document.getElementById("courseModal");

    const modalClose =
        document.getElementById("modalClose");

    const modalOverlay =
        document.querySelector(".modal-overlay");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalDescription =
        document.getElementById("modalDescription");

    const modalCategory =
        document.getElementById("modalCategory");

    const modalInstructor =
        document.getElementById("modalInstructor");

    const modalModules =
        document.getElementById("modalModules");

    const modalDuration =
        document.getElementById("modalDuration");

    const modalProgress =
        document.getElementById("modalProgress");

    const modalProgressBar =
        document.getElementById("modalProgressBar");

    const modalContinue =
        document.getElementById("modalContinue");


    /* SIDEBAR */

    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");


    /* =====================================
       STUDENT NAME
    ====================================== */

    const firstName =
        localStorage.getItem("jabicoFirstName");

    const lastName =
        localStorage.getItem("jabicoLastName");

    const studentName =
        document.getElementById("studentName");


    if (firstName || lastName) {

        studentName.textContent =
            `${firstName || ""} ${lastName || ""}`.trim();

    }


    /* =====================================
       YEAR
    ====================================== */

    document.getElementById("currentYear")
        .textContent =
        new Date().getFullYear();


    /* =====================================
       COURSE DATA
       
       TEMPORARY DEMO DATA

       Your backend can later return
       exactly this structure.
    /* =====================================
       COURSES

       Loaded live from the backend - see
       loadCourses() below.
    ====================================== */

    let courses = [];



    /* =====================================
       STATUS LABEL
    ====================================== */

    function getStatusLabel(status) {

        switch (status) {

            case "completed":
                return "Completed";

            case "in-progress":
                return "In Progress";

            case "not-started":
                return "Not Started";

            default:
                return "Unknown";

        }

    }


    /* =====================================
       COURSE ICON
    ====================================== */

    function getCourseIcon(category) {

        const value =
            (category || "").toLowerCase();


        if (
            value.includes("engineering")
        ) {

            return "fa-gears";

        }


        if (
            value.includes("professional")
        ) {

            return "fa-user-tie";

        }


        if (
            value.includes("manufacturing")
        ) {

            return "fa-industry";

        }


        if (
            value.includes("material")
        ) {

            return "fa-cubes";

        }


        return "fa-graduation-cap";

    }


    /* =====================================
       ESCAPE HTML
    ====================================== */

    function escapeHTML(value) {

        const element =
            document.createElement("div");

        element.textContent =
            String(value ?? "");

        return element.innerHTML;

    }


    /* =====================================
       ESCAPE ATTRIBUTE
    ====================================== */

    function escapeAttribute(value) {

        return String(value ?? "")

            .replace(/&/g, "&amp;")

            .replace(/"/g, "&quot;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;");

    }


    /* =====================================
       UPDATE STATISTICS
    ====================================== */

    function updateStatistics() {

        const total =
            courses.length;


        const completed =
            courses.filter(
                course =>
                    course.status === "completed"
            ).length;


        const active =
            courses.filter(
                course =>
                    course.status === "in-progress"
            ).length;


        let average = 0;


        if (total > 0) {

            average =
                Math.round(

                    courses.reduce(
                        (sum, course) =>
                            sum +
                            Number(course.progress || 0),

                        0
                    ) / total

                );

        }


        document.getElementById(
            "totalCourses"
        ).textContent = total;


        document.getElementById(
            "completedCourses"
        ).textContent = completed;


        document.getElementById(
            "averageProgress"
        ).textContent = `${average}%`;


        document.getElementById(
            "activeCourses"
        ).textContent = active;

    }


    /* =====================================
       RENDER COURSES
    ====================================== */

    function renderCourses(list) {


        coursesGrid.innerHTML = "";


        if (!list.length) {

            coursesGrid.style.display =
                "none";

            emptyState.hidden =
                false;

            courseCount.textContent =
                "No courses found";

            return;

        }


        coursesGrid.style.display =
            "grid";

        emptyState.hidden =
            true;


        courseCount.textContent =
            `${list.length} course${list.length === 1 ? "" : "s"} available`;


        list.forEach(course => {


            const card =
                document.createElement("article");


            card.className =
                "course-card";


            const statusClass =

                course.status === "completed"

                    ? "status-completed"

                    : course.status === "in-progress"

                        ? "status-progress"

                        : "status-not-started";


            const buttonText =

                course.status === "completed"

                    ? "Review Course"

                    : course.status === "not-started"

                        ? "Start Course"

                        : "Continue Learning";


            card.innerHTML = `

                <div class="course-card-header">

                    <span class="course-category">
                        ${escapeHTML(course.category)}
                    </span>

                    <div class="course-card-icon">

                        <i class="fa-solid ${getCourseIcon(course.category)}"></i>

                    </div>

                </div>


                <div class="course-card-body">


                    <h3>
                        ${escapeHTML(course.title)}
                    </h3>


                    <p class="course-description">
                        ${escapeHTML(course.description)}
                    </p>


                    <div class="course-instructor">

                        <div class="instructor-avatar">

                            <i class="fa-solid fa-user-tie"></i>

                        </div>


                        <div class="instructor-info">

                            <span>
                                Instructor
                            </span>

                            <strong>
                                ${escapeHTML(course.instructor)}
                            </strong>

                        </div>

                    </div>


                    <div class="progress-heading">

                        <span>
                            Course Progress
                        </span>

                        <strong>
                            ${Number(course.progress || 0)}%
                        </strong>

                    </div>


                    <div class="progress-track">

                        <div
                            class="progress-fill"
                            style="width: ${Math.min(
                                100,
                                Math.max(
                                    0,
                                    Number(course.progress || 0)
                                )
                            )}%"
                        ></div>

                    </div>


                    <div class="course-info">

                        <div class="course-info-item">

                            <i class="fa-solid fa-layer-group"></i>

                            ${Number(course.completedModules || 0)}/${Number(course.modules || 0)}
                            modules

                        </div>


                        <div class="course-info-item">

                            <i class="fa-regular fa-clock"></i>

                            ${escapeHTML(course.duration)}

                        </div>

                    </div>


                    <div class="course-status ${statusClass}">

                        ${getStatusLabel(course.status)}

                    </div>


                    <button
                        type="button"
                        class="course-button"
                        data-course-id="${escapeAttribute(course.id)}"
                    >

                        ${buttonText}

                        <i class="fa-solid fa-arrow-right"></i>

                    </button>


                </div>

            `;


            coursesGrid.appendChild(card);

        });


        attachCourseButtons();

    }


    /* =====================================
       COURSE BUTTONS
    ====================================== */

    function attachCourseButtons() {

        const buttons =
            document.querySelectorAll(
                ".course-button"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const courseId =
                        Number(
                            button.dataset.courseId
                        );


                    const course =
                        courses.find(
                            item =>
                                item.id === courseId
                        );


                    if (course) {

                        openCourseModal(course);

                    }

                }
            );

        });

    }


    /* =====================================
       OPEN COURSE MODAL
    ====================================== */

    function openCourseModal(course) {


        modalTitle.textContent =
            course.title;


        modalDescription.textContent =
            course.description;


        modalCategory.textContent =
            course.category;


        modalInstructor.textContent =
            course.instructor;


        modalModules.textContent =
            course.modules;


        modalDuration.textContent =
            course.duration;


        modalProgress.textContent =
            `${course.progress}%`;


        modalProgressBar.style.width =
            `${Math.min(
                100,
                Math.max(
                    0,
                    Number(course.progress)
                )
            )}%`;


        modalContinue.href =
            course.courseUrl || "#";


        courseModal.hidden =
            false;


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================
       CLOSE MODAL
    ====================================== */

    function closeCourseModal() {

        courseModal.hidden =
            true;

        document.body.style.overflow =
            "";

    }


    modalClose.addEventListener(
        "click",
        closeCourseModal
    );


    modalOverlay.addEventListener(
        "click",
        closeCourseModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                !courseModal.hidden
            ) {

                closeCourseModal();

            }

        }
    );


    /* =====================================
       SEARCH + FILTER
    ====================================== */

    function filterCourses() {


        const searchTerm =
            searchInput.value
                .trim()
                .toLowerCase();


        const selectedStatus =
            statusFilter.value;


        const filtered =
            courses.filter(course => {


                const matchesSearch =

                    course.title
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    course.description
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    course.category
                        .toLowerCase()
                        .includes(searchTerm);


                const matchesStatus =

                    selectedStatus === "all"

                    ||

                    course.status === selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            });


        renderCourses(filtered);

    }


    searchInput.addEventListener(
        "input",
        filterCourses
    );


    statusFilter.addEventListener(
        "change",
        filterCourses
    );


    /* =====================================
       CLEAR SEARCH
    ====================================== */

    clearSearch.addEventListener(
        "click",
        () => {

            searchInput.value =
                "";

            statusFilter.value =
                "all";

            renderCourses(courses);

        }
    );


    /* =====================================
       BACKEND-READY LOADER
       
       Replace the demo section later
       with an API request.
    ====================================== */

    async function loadCourses() {


        refreshButton.classList.add(
            "loading"
        );


        try {


            const data = await api("/api/student/courses");

            courses = data.courses || [];

            updateStatistics();

            renderCourses(courses);

        }

        catch (error) {

            console.error(
                "Unable to load courses:",
                error
            );


            coursesGrid.innerHTML =
                "";


            coursesGrid.style.display =
                "none";


            emptyState.hidden =
                false;


            courseCount.textContent =
                error.message === "Failed to fetch"
                    ? "Cannot connect to the server."
                    : "Unable to load courses.";

            if (/session has expired|log in again/i.test(error.message)) {
                setTimeout(() => { window.location.href = "index.html"; }, 1200);
            }

        }

        finally {

            refreshButton.classList.remove(
                "loading"
            );

        }

    }


    refreshButton.addEventListener(
        "click",
        loadCourses
    );


    /* =====================================
       MOBILE SIDEBAR
    ====================================== */

    function closeSidebar() {

        sidebar.classList.remove(
            "open"
        );

        sidebarOverlay.classList.remove(
            "active"
        );

    }


    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

            sidebarOverlay.classList.toggle(
                "active"
            );

        }
    );


    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );


    /* =====================================
       INITIALIZE
    ====================================== */

    loadCourses();

});


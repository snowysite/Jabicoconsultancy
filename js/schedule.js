
/* =========================================
   JABICO CONSULTANCY
   SCHEDULE JAVASCRIPT
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

    const todayCount =
        document.getElementById("todayCount");

    const upcomingCount =
        document.getElementById("upcomingCount");

    const onlineCount =
        document.getElementById("onlineCount");

    const weekCount =
        document.getElementById("weekCount");

    const weekLabel =
        document.getElementById("weekLabel");

    const todayDate =
        document.getElementById("todayDate");

    const todayClasses =
        document.getElementById("todayClasses");

    const weeklyCalendar =
        document.getElementById("weeklyCalendar");

    const searchInput =
        document.getElementById("searchInput");

    const courseFilter =
        document.getElementById("courseFilter");

    const refreshButton =
        document.getElementById("refreshButton");

    const emptyState =
        document.getElementById("emptyState");

    const clearFilters =
        document.getElementById("clearFilters");


    /* MODAL */

    const classModal =
        document.getElementById("classModal");

    const modalClose =
        document.getElementById("modalClose");

    const modalOverlay =
        document.getElementById("modalOverlay");

    const modalCategory =
        document.getElementById("modalCategory");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalDescription =
        document.getElementById("modalDescription");

    const modalDate =
        document.getElementById("modalDate");

    const modalTime =
        document.getElementById("modalTime");

    const modalInstructor =
        document.getElementById("modalInstructor");

    const modalLocation =
        document.getElementById("modalLocation");

    const joinClassButton =
        document.getElementById("joinClassButton");


    /* SIDEBAR */

    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");


    const previousWeek =
        document.getElementById("previousWeek");

    const nextWeek =
        document.getElementById("nextWeek");

    const todayButton =
        document.getElementById("todayButton");


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
       DEMO SCHEDULE DATA
       
       TEMPORARY ONLY.

       Backend can later return the
       exact same structure.
    /* =====================================
       SCHEDULE

       Loaded live from the backend - see
       loadSchedule() below.
    ====================================== */

    let schedule = [];



    /* =====================================
       CURRENT WEEK
    ====================================== */

    let selectedWeek =
        getStartOfWeek(new Date());


    /* =====================================
       DATE HELPERS
    ====================================== */

    function dateToKey(date) {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    function getStartOfWeek(date) {

        const result =
            new Date(date);

        const day =
            result.getDay();

        const difference =
            day === 0
                ? -6
                : 1 - day;

        result.setDate(
            result.getDate() + difference
        );

        result.setHours(
            0,
            0,
            0,
            0
        );

        return result;

    }


    function formatDate(dateString) {

        const date =
            new Date(
                `${dateString}T00:00:00`
            );

        return date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    function formatShortDate(dateString) {

        const date =
            new Date(
                `${dateString}T00:00:00`
            );

        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric"
            }
        );

    }


    function formatTime(time) {

        const [hours, minutes] =
            time.split(":");

        const date =
            new Date();

        date.setHours(
            Number(hours),
            Number(minutes),
            0,
            0
        );

        return date.toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    }


    function getWeekDates(startDate) {

        const dates = [];

        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const date =
                new Date(startDate);

            date.setDate(
                startDate.getDate() + i
            );

            dates.push(date);

        }

        return dates;

    }


    /* =====================================
       UPDATE WEEK LABEL
    ====================================== */

    function updateWeekLabel() {

        const dates =
            getWeekDates(
                selectedWeek
            );

        const first =
            dates[0];

        const last =
            dates[6];


        const firstText =
            first.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric"
                }
            );


        const lastText =
            last.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }
            );


        weekLabel.textContent =
            `${firstText} — ${lastText}`;

    }


    /* =====================================
       GET FILTERED SCHEDULE
    ====================================== */

    function getFilteredSchedule() {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();

        const course =
            courseFilter.value;


        return schedule.filter(item => {

            const matchesSearch =

                item.title
                    .toLowerCase()
                    .includes(search)

                ||

                item.course
                    .toLowerCase()
                    .includes(search);


            const matchesCourse =

                course === "all"

                ||

                item.course === course;


            return (
                matchesSearch &&
                matchesCourse
            );

        });

    }


    /* =====================================
       POPULATE COURSE FILTER
    ====================================== */

    function populateCourseFilter() {

        const courses =
            [
                ...new Set(
                    schedule.map(
                        item => item.course
                    )
                )
            ];


        courseFilter.innerHTML = `

            <option value="all">
                All Courses
            </option>

        `;


        courses.forEach(course => {

            const option =
                document.createElement("option");

            option.value =
                course;

            option.textContent =
                course;

            courseFilter.appendChild(
                option
            );

        });

    }


    /* =====================================
       UPDATE STATISTICS
    ====================================== */

    function updateStatistics() {

        const today =
            dateToKey(
                new Date()
            );


        const weekDates =
            getWeekDates(
                selectedWeek
            );


        const weekKeys =
            weekDates.map(
                date => dateToKey(date)
            );


        const todayItems =
            schedule.filter(
                item =>
                    item.date === today
            );


        const weekItems =
            schedule.filter(
                item =>
                    weekKeys.includes(
                        item.date
                    )
            );


        const upcoming =
            schedule.filter(
                item =>
                    item.status === "upcoming"
            );


        const online =
            schedule.filter(
                item =>
                    item.type === "online"
            );


        todayCount.textContent =
            todayItems.length;


        upcomingCount.textContent =
            upcoming.length;


        onlineCount.textContent =
            online.length;


        weekCount.textContent =
            weekItems.length;

    }


    /* =====================================
       STATUS LABEL
    ====================================== */

    function getStatusLabel(status) {

        switch (status) {

            case "live":
                return "Live Now";

            case "ended":
                return "Completed";

            default:
                return "Upcoming";

        }

    }


    function getStatusClass(status) {

        switch (status) {

            case "live":
                return "status-live";

            case "ended":
                return "status-ended";

            default:
                return "status-upcoming";

        }

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
       RENDER TODAY
    ====================================== */

    function renderToday() {

        const today =
            dateToKey(
                new Date()
            );


        const filtered =
            getFilteredSchedule()
                .filter(
                    item =>
                        item.date === today
                );


        todayDate.textContent =
            formatDate(today);


        todayClasses.innerHTML =
            "";


        if (!filtered.length) {

            todayClasses.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">

                        <i class="fa-regular fa-calendar-xmark"></i>

                    </div>

                    <h3>
                        No classes today
                    </h3>

                    <p>
                        You have no scheduled classes for today.
                    </p>

                </div>

            `;

            return;

        }


        filtered.forEach(item => {

            todayClasses.appendChild(
                createClassCard(item)
            );

        });

    }


    /* =====================================
       CREATE CLASS CARD
    ====================================== */

    function createClassCard(item) {

        const card =
            document.createElement("article");

        card.className =
            "class-card";


        const locationIcon =
            item.type === "online"
                ? "fa-video"
                : "fa-location-dot";


        const locationText =
            item.type === "online"
                ? "Online Class"
                : item.location;


        card.innerHTML = `

            <div class="class-card-top">

                <div class="class-time">

                    <i class="fa-regular fa-clock"></i>

                    ${formatTime(item.startTime)}
                    -
                    ${formatTime(item.endTime)}

                </div>

                <span class="class-status ${getStatusClass(item.status)}">

                    ${getStatusLabel(item.status)}

                </span>

            </div>


            <span class="class-course">

                ${escapeHTML(item.course)}

            </span>


            <h3>

                ${escapeHTML(item.title)}

            </h3>


            <p class="class-description">

                ${escapeHTML(item.description)}

            </p>


            <div class="class-meta">

                <div class="class-meta-item">

                    <i class="fa-solid fa-user-tie"></i>

                    ${escapeHTML(item.instructor)}

                </div>


                <div class="class-meta-item">

                    <i class="fa-solid ${locationIcon}"></i>

                    ${escapeHTML(locationText)}

                </div>

            </div>


            <div class="class-actions">

                <button
                    type="button"
                    class="details-button"
                    data-id="${escapeAttribute(item.id)}"
                >

                    <i class="fa-solid fa-circle-info"></i>

                    Details

                </button>


                <a
                    href="${escapeAttribute(item.meetingUrl || "#")}"
                    class="join-button"
                    target="_blank"
                    rel="noopener noreferrer"
                >

                    <i class="fa-solid fa-video"></i>

                    ${item.type === "online" ? "Join Class" : "View Details"}

                </a>

            </div>

        `;


        card.querySelector(
            ".details-button"
        ).addEventListener(
            "click",
            () => openClassModal(item)
        );


        return card;

    }


    /* =====================================
       RENDER WEEK
    ====================================== */

    function renderWeek() {

        const dates =
            getWeekDates(
                selectedWeek
            );


        const filtered =
            getFilteredSchedule();


        weeklyCalendar.innerHTML =
            "";


        const today =
            dateToKey(
                new Date()
            );


        dates.forEach(date => {

            const key =
                dateToKey(date);


            const day =
                document.createElement("div");


            day.className =
                "calendar-day";


            if (key === today) {

                day.classList.add(
                    "today"
                );

            }


            const dayName =
                date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                );


            const dayNumber =
                date.getDate();


            const events =
                filtered.filter(
                    item =>
                        item.date === key
                );


            let eventsHTML = "";


            if (!events.length) {

                eventsHTML = `

                    <div class="no-events">

                        No classes

                    </div>

                `;

            }

            else {

                eventsHTML =
                    events.map(
                        item => `

                        <div
                            class="calendar-event"
                            data-id="${escapeAttribute(item.id)}"
                        >

                            <div class="event-time">

                                ${formatTime(item.startTime)}

                            </div>

                            <div class="event-title">

                                ${escapeHTML(item.title)}

                            </div>

                            <div class="event-course">

                                ${escapeHTML(item.course)}

                            </div>

                        </div>

                    `
                    ).join("");

            }


            day.innerHTML = `

                <div class="day-header">

                    <span class="day-name">

                        ${dayName}

                    </span>

                    <span class="day-number">

                        ${dayNumber}

                    </span>

                </div>


                <div class="day-events">

                    ${eventsHTML}

                </div>

            `;


            day.querySelectorAll(
                ".calendar-event"
            ).forEach(event => {

                event.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                event.dataset.id
                            );


                        const item =
                            schedule.find(
                                entry =>
                                    entry.id === id
                            );


                        if (item) {

                            openClassModal(
                                item
                            );

                        }

                    }
                );

            });


            weeklyCalendar.appendChild(
                day
            );

        });

    }


    /* =====================================
       OPEN MODAL
    ====================================== */

    function openClassModal(item) {

        modalCategory.textContent =
            item.course;


        modalTitle.textContent =
            item.title;


        modalDescription.textContent =
            item.description;


        modalDate.textContent =
            formatDate(item.date);


        modalTime.textContent =
            `${formatTime(item.startTime)} - ${formatTime(item.endTime)}`;


        modalInstructor.textContent =
            item.instructor;


        modalLocation.textContent =
            item.location;


        joinClassButton.href =
            item.meetingUrl || "#";


        if (item.type !== "online") {

            joinClassButton.innerHTML = `

                <i class="fa-solid fa-location-dot"></i>

                View Location

            `;

        }

        else {

            joinClassButton.innerHTML = `

                <i class="fa-solid fa-video"></i>

                Join Class

            `;

        }


        classModal.hidden =
            false;


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================
       CLOSE MODAL
    ====================================== */

    function closeModal() {

        classModal.hidden =
            true;

        document.body.style.overflow =
            "";

    }


    modalClose.addEventListener(
        "click",
        closeModal
    );


    modalOverlay.addEventListener(
        "click",
        closeModal
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                !classModal.hidden
            ) {

                closeModal();

            }

        }
    );


    /* =====================================
       RENDER EVERYTHING
    ====================================== */

    function renderAll() {

        updateWeekLabel();

        updateStatistics();

        renderToday();

        renderWeek();

    }


    /* =====================================
       SEARCH / FILTER EVENTS
    ====================================== */

    searchInput.addEventListener(
        "input",
        renderAll
    );


    courseFilter.addEventListener(
        "change",
        renderAll
    );


    clearFilters.addEventListener(
        "click",
        () => {

            searchInput.value =
                "";

            courseFilter.value =
                "all";

            renderAll();

        }
    );


    /* =====================================
       WEEK NAVIGATION
    ====================================== */

    previousWeek.addEventListener(
        "click",
        () => {

            selectedWeek.setDate(
                selectedWeek.getDate() - 7
            );

            renderAll();

        }
    );


    nextWeek.addEventListener(
        "click",
        () => {

            selectedWeek.setDate(
                selectedWeek.getDate() + 7
            );

            renderAll();

        }
    );


    todayButton.addEventListener(
        "click",
        () => {

            selectedWeek =
                getStartOfWeek(
                    new Date()
                );

            renderAll();

        }
    );


    /* =====================================
       BACKEND-READY LOADER
       
       Replace demo data later with:
       
       const response =
           await fetch("/api/student/schedule");

       const data =
           await response.json();

       schedule =
           data.schedule;
    ====================================== */

    async function loadSchedule() {

        refreshButton.classList.add(
            "loading"
        );


        try {

            const data = await api("/api/student/schedule");

            schedule = data.schedule || [];

            populateCourseFilter();

            renderAll();

        }

        catch (error) {

            console.error(
                "Unable to load schedule:",
                error
            );

            todayClasses.innerHTML =
                "";

            weeklyCalendar.innerHTML =
                "";

            emptyState.hidden =
                false;

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
        loadSchedule
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

    loadSchedule();

});

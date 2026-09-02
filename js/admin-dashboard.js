    "use strict";

    /* =========================================================
    JABICO ADMIN DASHBOARD
    STUDENT APPLICATION MANAGEMENT
    ========================================================= */

    /* =========================================================
    STORAGE
    ========================================================= */

    const STUDENTS_KEY = "jabicoStudents";

    const ADMIN_SESSION_KEY =
    "jabicoAdminAuthenticated";

    /* =========================================================
    ELEMENTS
    ========================================================= */

    const totalStudents =
    document.getElementById("totalStudents");

    const pendingStudents =
    document.getElementById("pendingStudents");

    const approvedStudents =
    document.getElementById("approvedStudents");

    const rejectedStudents =
    document.getElementById("rejectedStudents");

    const sidebarPendingCount =
    document.getElementById("sidebarPendingCount");

    const notificationDot =
    document.getElementById("notificationDot");

    const applicationsTableBody =
    document.getElementById("applicationsTableBody");

    const emptyApplications =
    document.getElementById("emptyApplications");

    const recentActivity =
    document.getElementById("recentActivity");

    /* =========================================================
    MODAL ELEMENTS
    ========================================================= */

    const studentModal =
    document.getElementById("studentModal");

    const closeStudentModal =
    document.getElementById("closeStudentModal");

    const modalAvatar =
    document.getElementById("modalAvatar");

    const modalStudentName =
    document.getElementById("modalStudentName");

    const modalStudentId =
    document.getElementById("modalStudentId");

    const modalStudentEmail =
    document.getElementById("modalStudentEmail");

    const modalStudentDate =
    document.getElementById("modalStudentDate");

    const modalStudentStatus =
    document.getElementById("modalStudentStatus");

    const modalApprove =
    document.getElementById("modalApprove");

    const modalReject =
    document.getElementById("modalReject");

    let selectedStudentId = null;

    /* =========================================================
    LOGOUT ELEMENTS
    ========================================================= */

    const logoutButton =
    document.getElementById("logoutButton");

    const logoutModal =
    document.getElementById("logoutModal");

    const cancelLogout =
    document.getElementById("cancelLogout");

    const confirmLogout =
    document.getElementById("confirmLogout");

    /* =========================================================
    MOBILE MENU
    ========================================================= */

    const mobileMenu =
    document.getElementById("mobileMenu");

    const sidebar =
    document.getElementById("sidebar");

    const sidebarOverlay =
    document.getElementById("sidebarOverlay");

    /* =========================================================
    GET STUDENTS
    ========================================================= */

    function getStudents() {

    try {

        const storedStudents =
            localStorage.getItem(STUDENTS_KEY);

        if (!storedStudents) {
            return [];
        }

        const students =
            JSON.parse(storedStudents);

        return Array.isArray(students)
            ? students
            : [];

    } catch (error) {

        console.error(
            "Unable to read Jabico students.",
            error
        );

        return [];
    }
}
    /* =========================================================
    SAVE STUDENTS
    ========================================================= */

    function saveStudents(students) {

        
    try {

        localStorage.setItem(
            STUDENTS_KEY,
            JSON.stringify(students)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save students.",
            error
        );

        return false;

    }
    

    }

    /* =========================================================
    ADMIN AUTHENTICATION
    ========================================================= */

    function checkAdminAuthentication() {

    const authenticated =
        sessionStorage.getItem(ADMIN_SESSION_KEY);

    if (authenticated !== "true") {

        window.location.href =
            "admin-login.html";

        return false;
    }

    return true;
}

    /* =========================================================
    FORMAT DATE
    ========================================================= */

    function formatDate(dateValue) {

    
    if (!dateValue) {
        return "—";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "—";
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

    /* =========================================================
    FORMAT TIME
    ========================================================= */

    function formatTimeAgo(dateValue) {


    if (!dateValue) {
        return "";
    }

    const date =
        new Date(dateValue);

    const now =
        new Date();

    const difference =
        Math.floor(
            (now - date) / 1000
        );

    if (difference < 60) {
        return "Just now";
    }

    const minutes =
        Math.floor(
            difference / 60
        );

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours =
        Math.floor(
            minutes / 60
        );

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days =
        Math.floor(
            hours / 24
        );

    if (days < 7) {
        return `${days}d ago`;
    }

    return formatDate(dateValue);


    }

    /* =========================================================
    INITIALS
    ========================================================= */

    function getInitials(student) {


    const first =
        student.firstName
            ? student.firstName.charAt(0)
            : "";

    const last =
        student.lastName
            ? student.lastName.charAt(0)
            : "";

    return (
        first + last
    ).toUpperCase();
    

    }

    /* =========================================================
    STATUS CLASS
    ========================================================= */

    function getStatusClass(status) {

    
    switch (
        String(status).toLowerCase()
    ) {

        case "approved":
            return "status-approved";

        case "rejected":
            return "status-rejected";

        case "suspended":
            return "status-suspended";

        default:
            return "status-pending";
    }
    

    }

    /* =========================================================
    STATUS LABEL
    ========================================================= */

    function getStatusLabel(status) {

    
    if (!status) {
        return "PENDING";
    }

    return String(status)
        .toUpperCase();
    

    }

    /* =========================================================
    UPDATE STATISTICS
    ========================================================= */

    function updateStatistics(students) {

    
    const total =
        students.length;

    const pending =
        students.filter(
            student =>
                student.status === "pending"
        ).length;

    const approved =
        students.filter(
            student =>
                student.status === "approved"
        ).length;

    const rejected =
        students.filter(
            student =>
                student.status === "rejected"
        ).length;


    totalStudents.textContent =
        total;

    pendingStudents.textContent =
        pending;

    approvedStudents.textContent =
        approved;

    rejectedStudents.textContent =
        rejected;


    sidebarPendingCount.textContent =
        pending;


    if (pending > 0) {

        notificationDot.style.display =
            "block";

    } else {

        notificationDot.style.display =
            "none";

    }


    }

    /* =========================================================
    RENDER APPLICATIONS
    ========================================================= */

    function renderApplications(students) {

    applicationsTableBody.innerHTML = "";


    const pending =
        students
            .filter(
                student =>
                    student.status === "pending"
            )
            .sort(
                (a, b) =>
                    new Date(b.registeredAt) -
                    new Date(a.registeredAt)
            );


    if (pending.length === 0) {

        emptyApplications.hidden =
            false;

        return;

    }


    emptyApplications.hidden =
        true;


    pending.forEach(
        student => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="student-cell">

                        <div class="student-avatar">

                            ${getInitials(student)}

                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(
                                    student.fullName ||
                                    `${student.firstName} ${student.lastName}`
                                )}
                            </strong>

                            <span>
                                Student Applicant
                            </span>

                        </div>

                    </div>

                </td>


                <td class="email-cell">

                    ${escapeHTML(student.email || "—")}

                </td>


                <td>

                    <span class="student-id">

                        ${escapeHTML(student.id || "—")}

                    </span>

                </td>


                <td>

                    ${formatDate(student.registeredAt)}

                </td>


                <td>

                    <span class="status-badge ${getStatusClass(student.status)}">

                        ${getStatusLabel(student.status)}

                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            type="button"
                            class="table-action view"
                            data-action="view"
                            data-id="${escapeAttribute(student.id)}"
                        >
                            View
                        </button>

                        <button
                            type="button"
                            class="table-action approve"
                            data-action="approve"
                            data-id="${escapeAttribute(student.id)}"
                        >
                            Accept
                        </button>

                        <button
                            type="button"
                            class="table-action reject"
                            data-action="reject"
                            data-id="${escapeAttribute(student.id)}"
                        >
                            Reject
                        </button>

                    </div>

                </td>

            `;


            applicationsTableBody.appendChild(
                row
            );

        }
    );


    }

    /* =========================================================
    RENDER RECENT ACTIVITY
    ========================================================= */

    function renderRecentActivity(students) {


    recentActivity.innerHTML = "";


    const recent =
        [...students]
            .sort(
                (a, b) =>
                    new Date(b.registeredAt) -
                    new Date(a.registeredAt)
            )
            .slice(0, 5);


    if (recent.length === 0) {

        recentActivity.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">

                    <i class="fa-solid fa-users"></i>

                </div>

                <h3>
                    No registrations yet
                </h3>

                <p>
                    New student registrations will appear here.
                </p>

            </div>

        `;

        return;
    }


    recent.forEach(
        student => {

            const item =
                document.createElement("div");

            item.className =
                "activity-item";


            let icon =
                "fa-user-plus";

            if (
                student.status === "approved"
            ) {

                icon =
                    "fa-user-check";

            } else if (
                student.status === "rejected"
            ) {

                icon =
                    "fa-user-xmark";

            }


            item.innerHTML = `

                <div class="activity-icon">

                    <i class="fa-solid ${icon}"></i>

                </div>


                <div class="activity-content">

                    <strong>

                        ${escapeHTML(
                            student.fullName ||
                            `${student.firstName} ${student.lastName}`
                        )}

                    </strong>

                    <span>

                        Account registered •
                        ${getStatusLabel(student.status)}

                    </span>

                </div>


                <span class="activity-time">

                    ${formatTimeAgo(student.registeredAt)}

                </span>

            `;


            recentActivity.appendChild(
                item
            );

        }
    );


    }

    /* =========================================================
    ESCAPE HTML
    ========================================================= */

    function escapeHTML(value) {


    const element =
        document.createElement("div");

    element.textContent =
        String(value ?? "");

    return element.innerHTML;


    }

    /* =========================================================
    ESCAPE ATTRIBUTE
    ========================================================= */

    function escapeAttribute(value) {


    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");


    }

    /* =========================================================
    FIND STUDENT
    ========================================================= */

    function findStudent(studentId) {


    const students =
        getStudents();

    return students.find(
        student =>
            student.id === studentId
    );


    }

    /* =========================================================
    OPEN STUDENT MODAL
    ========================================================= */

    function openStudentModal(studentId) {


    const student =
        findStudent(studentId);

    if (!student) {

        alert(
            "Student application could not be found."
        );

        return;

    }


    selectedStudentId =
        student.id;


    modalAvatar.textContent =
        getInitials(student);


    modalStudentName.textContent =
        student.fullName ||
        `${student.firstName} ${student.lastName}`;


    modalStudentId.textContent =
        student.id || "—";


    modalStudentEmail.textContent =
        student.email || "—";


    modalStudentDate.textContent =
        formatDate(student.registeredAt);


    modalStudentStatus.textContent =
        getStatusLabel(student.status);


    if (
        student.status === "pending"
    ) {

        modalApprove.style.display =
            "inline-flex";

        modalReject.style.display =
            "inline-flex";

    } else {

        modalApprove.style.display =
            "none";

        modalReject.style.display =
            "none";

    }


    studentModal.hidden =
        false;

    document.body.style.overflow =
        "hidden";


    }

    /* =========================================================
    CLOSE STUDENT MODAL
    ========================================================= */

    function closeModal() {


    studentModal.hidden =
        true;

    selectedStudentId =
        null;

    document.body.style.overflow =
        "";


    }

    /* =========================================================
    APPROVE STUDENT
    ========================================================= */

    function approveStudent(studentId) {


    const students =
        getStudents();


    const studentIndex =
        students.findIndex(
            student =>
                student.id === studentId
        );


    if (studentIndex === -1) {

        alert(
            "Student application not found."
        );

        return;

    }


    const student =
        students[studentIndex];


    if (
        student.status !== "pending"
    ) {

        alert(
            "This application has already been processed."
        );

        return;

    }


    const confirmed =
        window.confirm(
            `Approve ${student.fullName || "this student"}?`
        );


    if (!confirmed) {
        return;
    }


    students[studentIndex].status =
        "approved";

    students[studentIndex].approvedAt =
        new Date().toISOString();


    const saved =
        saveStudents(students);


    if (!saved) {

        alert(
            "Unable to approve the student. Please try again."
        );

        return;

    }


    closeModal();

    refreshDashboard();


    alert(
        `${student.fullName || "Student"} has been approved successfully.`
    );


    }

    /* =========================================================
    REJECT STUDENT
    ========================================================= */

    function rejectStudent(studentId) {


    const students =
        getStudents();


    const studentIndex =
        students.findIndex(
            student =>
                student.id === studentId
        );


    if (studentIndex === -1) {

        alert(
            "Student application not found."
        );

        return;

    }


    const student =
        students[studentIndex];


    if (
        student.status !== "pending"
    ) {

        alert(
            "This application has already been processed."
        );

        return;

    }


    const confirmed =
        window.confirm(
            `Reject ${student.fullName || "this application"}?`
        );


    if (!confirmed) {
        return;
    }


    students[studentIndex].status =
        "rejected";


    const saved =
        saveStudents(students);


    if (!saved) {

        alert(
            "Unable to reject the application. Please try again."
        );

        return;

    }


    closeModal();

    refreshDashboard();


    alert(
        `${student.fullName || "Student application"} has been rejected.`
    );


    }

    /* =========================================================
    TABLE ACTIONS
    ========================================================= */

    applicationsTableBody.addEventListener(
    "click",
    function(event) {


        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;

        const studentId =
            button.dataset.id;


        if (!studentId) {
            return;
        }


        if (action === "view") {

            openStudentModal(
                studentId
            );

        }


        if (action === "approve") {

            approveStudent(
                studentId
            );

        }


        if (action === "reject") {

            rejectStudent(
                studentId
            );

        }

    }


    );

    /* =========================================================
    MODAL BUTTONS
    ========================================================= */

    closeStudentModal.addEventListener(
    "click",
    closeModal
    );

    modalApprove.addEventListener(
    "click",
    function() {


        if (selectedStudentId) {

            approveStudent(
                selectedStudentId
            );

        }

    }

    );

    modalReject.addEventListener(
    "click",
    function() {


        if (selectedStudentId) {

            rejectStudent(
                selectedStudentId
            );

        }

    }


    );

    /* =========================================================
    CLOSE MODAL BY CLICKING OUTSIDE
    ========================================================= */

    studentModal.addEventListener(
    "click",
    function(event) {


        if (
            event.target === studentModal
        ) {

            closeModal();

        }

    }


    );

    /* =========================================================
    REFRESH DASHBOARD
    ========================================================= */

    function refreshDashboard() {


    const students =
        getStudents();


    updateStatistics(
        students
    );


    renderApplications(
        students
    );


    renderRecentActivity(
        students
    );


    }

    /* =========================================================
    LOGOUT
    ========================================================= */

    logoutButton.addEventListener(
    "click",
    function() {


        logoutModal.hidden =
            false;

        document.body.style.overflow =
            "hidden";

    }


    );

    cancelLogout.addEventListener(
    "click",
    function() {


        logoutModal.hidden =
            true;

        document.body.style.overflow =
            "";

    }


    );

    confirmLogout.addEventListener(
    "click",
    function() {


        sessionStorage.removeItem(
            ADMIN_SESSION_KEY
        );

        sessionStorage.removeItem(
            "jabicoAdminEmail"
        );

        window.location.href =
            "admin-login.html";

    }


    );

    logoutModal.addEventListener(
    "click",
    function(event) {


        if (
            event.target === logoutModal
        ) {

            logoutModal.hidden =
                true;

            document.body.style.overflow =
                "";

        }

    }


    );

    /* =========================================================
    MOBILE SIDEBAR
    ========================================================= */

    mobileMenu.addEventListener(
    "click",
    function() {


        sidebar.classList.add(
            "open"
        );

        sidebarOverlay.classList.add(
            "show"
        );

    }


    );

    sidebarOverlay.addEventListener(
    "click",
    function() {


        sidebar.classList.remove(
            "open"
        );

        sidebarOverlay.classList.remove(
            "show"
        );

    }


    );

    /* =========================================================
    CLOSE MOBILE SIDEBAR AFTER NAVIGATION
    ========================================================= */

    document
    .querySelectorAll(".nav-link")
    .forEach(
    link => {


            link.addEventListener(
                "click",
                function() {

                    sidebar.classList.remove(
                        "open"
                    );

                    sidebarOverlay.classList.remove(
                        "show"
                    );

                }
            );

        }
    );


    /* =========================================================
    VIEW ALL APPLICATIONS
    ========================================================= */

    const viewAllApplications =
    document.getElementById(
    "viewAllApplications"
    );

    if (viewAllApplications) {


    viewAllApplications.addEventListener(
        "click",
        function() {

            window.location.href =
                "applications.html";

        }
    );


    }

    /* =========================================================
    PROFILE BUTTON
    ========================================================= */

    const profileButton =
    document.getElementById(
    "profileButton"
    );

    if (profileButton) {


    profileButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "settings.html";

        }
    );


    }

    /* =========================================================
    NOTIFICATION BUTTON
    ========================================================= */

    const notificationButton =
    document.getElementById(
    "notificationButton"
    );

    if (notificationButton) {


    notificationButton.addEventListener(
        "click",
        function() {

            const students =
                getStudents();

            const pending =
                students.filter(
                    student =>
                        student.status === "pending"
                ).length;


            if (pending > 0) {

                alert(
                    `You have ${pending} pending student application${pending === 1 ? "" : "s"}.`
                );

            } else {

                alert(
                    "You have no pending student applications."
                );

            }

        }
    );


    }

    /* =========================================================
    STORAGE CHANGE
    Updates dashboard if another page changes students.
    ========================================================= */

    window.addEventListener(
    "storage",
    function(event) {


        if (
            event.key === STUDENTS_KEY
        ) {

            refreshDashboard();

        }

    }


    );

    /* =========================================================
    INITIALIZE
    ========================================================= */

    if (
    checkAdminAuthentication()
    ) {


    refreshDashboard();


    }


/* =========================================
   JABICO CONSULTANCY
   LEARNING MATERIALS JAVASCRIPT
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

    const documentsGrid =
        document.getElementById("documentsGrid");

    const emptyState =
        document.getElementById("emptyState");

    const searchInput =
        document.getElementById("searchInput");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const documentCount =
        document.getElementById("documentCount");

    const refreshButton =
        document.getElementById("refreshButton");

    const clearSearch =
        document.getElementById("clearSearch");

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
       CURRENT YEAR
    ====================================== */

    document.getElementById("currentYear")
        .textContent = new Date().getFullYear();


    /* =====================================
       DOCUMENTS

       Loaded live from the backend - see
       loadDocuments() below.
    ====================================== */

    let documents = [];



    /* =====================================
       FORMAT DATE
    ====================================== */

    function formatDate(dateString) {

        if (!dateString) {
            return "Unknown date";
        }

        const date =
            new Date(dateString);

        return date.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );
    }


    /* =====================================
       DOCUMENT ICON
    ====================================== */

    function getDocumentIcon(fileType) {

        if (!fileType) {
            return "fa-file";
        }

        const type =
            fileType.toLowerCase();

        if (type.includes("google")) {
            return "fa-file-lines";
        }

        if (type.includes("pdf")) {
            return "fa-file-pdf";
        }

        if (
            type.includes("word") ||
            type.includes("doc")
        ) {
            return "fa-file-word";
        }

        if (
            type.includes("excel") ||
            type.includes("sheet")
        ) {
            return "fa-file-excel";
        }

        return "fa-file";
    }


    /* =====================================
       RENDER DOCUMENTS
    ====================================== */

    function renderDocuments(list) {

        documentsGrid.innerHTML = "";


        if (!list.length) {

            documentsGrid.style.display = "none";

            emptyState.hidden = false;

            documentCount.textContent =
                "No materials found";

            return;
        }


        documentsGrid.style.display = "grid";

        emptyState.hidden = true;


        documentCount.textContent =
            `${list.length} material${list.length === 1 ? "" : "s"} available`;


        list.forEach(document => {

            const card =
                document.createElement("article");

            card.className = "document-card";


            card.innerHTML = `

                <div class="document-top">

                    <div class="document-icon">

                        <i class="fa-solid ${getDocumentIcon(document.fileType)}"></i>

                    </div>

                    <span class="document-type">
                        ${escapeHTML(document.fileType || "Document")}
                    </span>

                </div>


                <h3>
                    ${escapeHTML(document.title)}
                </h3>


                <p class="document-description">
                    ${escapeHTML(document.description || "No description available.")}
                </p>


                <div class="document-meta">

                    <div class="meta-item">

                        <i class="fa-solid fa-user-shield"></i>

                        <span>
                            Uploaded by ${escapeHTML(document.uploadedBy || "Administrator")}
                        </span>

                    </div>


                    <div class="meta-item">

                        <i class="fa-regular fa-calendar"></i>

                        <span>
                            ${formatDate(document.uploadedAt)}
                        </span>

                    </div>

                </div>


                <div class="document-actions">

                    <a
                        href="${escapeAttribute(document.documentUrl || "#")}"
                        class="open-document"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        <i class="fa-solid fa-arrow-up-right-from-square"></i>

                        Open Document

                    </a>


                    <a
                        href="${escapeAttribute(document.downloadUrl || "#")}"
                        class="download-document"
                        title="Download"
                        ${document.downloadUrl && document.downloadUrl !== "#" ? "download" : ""}
                    >

                        <i class="fa-solid fa-download"></i>

                    </a>

                </div>

            `;


            documentsGrid.appendChild(card);

        });

    }


    /* =====================================
       SEARCH + FILTER
    ====================================== */

    function filterDocuments() {

        const searchTerm =
            searchInput.value
                .trim()
                .toLowerCase();

        const category =
            categoryFilter.value;


        const filtered =
            documents.filter(document => {

                const matchesSearch =

                    document.title
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    (document.description || "")
                        .toLowerCase()
                        .includes(searchTerm);


                const matchesCategory =

                    category === "all"

                    ||

                    document.category === category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            });


        renderDocuments(filtered);
    }


    searchInput.addEventListener(
        "input",
        filterDocuments
    );


    categoryFilter.addEventListener(
        "change",
        filterDocuments
    );


    /* =====================================
       CLEAR SEARCH
    ====================================== */

    clearSearch.addEventListener(
        "click",
        () => {

            searchInput.value = "";

            categoryFilter.value = "all";

            renderDocuments(documents);

        }
    );


    /* =====================================
       REFRESH
       
       Backend-ready function.
    ====================================== */

    async function loadDocuments() {

        refreshButton.classList.add("loading");

        try {

            const data = await api("/api/documents");

            documents = data.documents || [];

            renderDocuments(documents);

        }

        catch (error) {

            console.error(
                "Unable to load documents:",
                error
            );

            documentsGrid.innerHTML = "";

            documentsGrid.style.display = "none";

            emptyState.hidden = false;

            documentCount.textContent =
                error.message === "Failed to fetch"
                    ? "Cannot connect to the server."
                    : "Unable to load materials.";

            if (/session has expired|log in again/i.test(error.message)) {
                setTimeout(() => { window.location.href = "index.html"; }, 1200);
            }

        }

        finally {

            refreshButton.classList.remove("loading");

        }

    }


    refreshButton.addEventListener(
        "click",
        loadDocuments
    );


    /* =====================================
       SECURITY HELPERS
       
       Prevent backend data from injecting
       unwanted HTML into the page.
    ====================================== */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            String(value ?? "");

        return div.innerHTML;
    }


    function escapeAttribute(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }


    /* =====================================
       MOBILE SIDEBAR
    ====================================== */

    function closeSidebar() {

        sidebar.classList.remove("open");

        sidebarOverlay.classList.remove("active");

    }


    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle("open");

            sidebarOverlay.classList.toggle("active");

        }
    );


    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );


    /* =====================================
       INITIAL LOAD
    ====================================== */

    loadDocuments();

});


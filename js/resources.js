/* =========================================================
   JABICO CONSULTANCY — RESOURCES JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar =
        document.getElementById("sidebar");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const notificationBtn =
        document.getElementById("notificationBtn");

    const notificationDropdown =
        document.getElementById("notificationDropdown");

    const themeToggle =
        document.getElementById("themeToggle");

    const themeIcon =
        themeToggle
            ? themeToggle.querySelector("i")
            : null;

    const searchInput =
        document.getElementById("resourceSearch");

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const resourceGrid =
        document.getElementById("resourceGrid");

    const noResults =
        document.getElementById("noResults");


    /* =====================================================
       STUDENT AUTH + API HELPERS
    ===================================================== */

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

    async function apiBlob(path) {

        const token = getStudentToken();

        const response = await fetch(`${API_BASE_URL}${path}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Unable to load file.");
        }

        return response.blob();

    }


    /* =====================================================
       RESOURCE STATE
    ===================================================== */

    let allResources = [];


    /* =====================================================
       SIDEBAR
    ===================================================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("show");
        }

        if (mobileMenuBtn) {

            mobileMenuBtn.innerHTML =
                '<i class="fas fa-xmark"></i>';

            mobileMenuBtn.setAttribute(
                "aria-label",
                "Close navigation"
            );
        }

        document.body.classList.add(
            "sidebar-open"
        );
    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("show");
        }

        if (mobileMenuBtn) {

            mobileMenuBtn.innerHTML =
                '<i class="fas fa-bars"></i>';

            mobileMenuBtn.setAttribute(
                "aria-label",
                "Open navigation"
            );
        }

        document.body.classList.remove(
            "sidebar-open"
        );
    }


    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                if (
                    sidebar &&
                    sidebar.classList.contains("open")
                ) {

                    closeSidebar();

                } else {

                    openSidebar();

                }

            }
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    function closeNotifications() {

        if (!notificationDropdown) return;

        notificationDropdown.classList.remove(
            "show"
        );
    }


    function openNotifications() {

        if (!notificationDropdown) return;

        notificationDropdown.classList.add(
            "show"
        );
    }


    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                if (
                    notificationDropdown &&
                    notificationDropdown.classList.contains(
                        "show"
                    )
                ) {

                    closeNotifications();

                } else {

                    openNotifications();

                }

            }
        );
    }


    if (notificationDropdown) {

        notificationDropdown.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

            }
        );
    }


    /* =====================================================
       THEME
    ===================================================== */

    const savedTheme =
        localStorage.getItem(
            "jabico-theme"
        );


    function updateThemeIcon(isDark) {

        if (!themeIcon) return;

        themeIcon.className =
            isDark
                ? "fas fa-sun"
                : "fas fa-moon";
    }


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        updateThemeIcon(true);

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

        updateThemeIcon(false);

    }


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark-mode"
                );

                const isDark =
                    document.body.classList.contains(
                        "dark-mode"
                    );

                localStorage.setItem(
                    "jabico-theme",
                    isDark
                        ? "dark"
                        : "light"
                );

                updateThemeIcon(isDark);

            }
        );
    }


    /* =====================================================
       LOAD RESOURCES FROM BACKEND
    ===================================================== */

    function classifyFileType(resource) {
        const fileType = (resource.fileType || "").toLowerCase();
        if (fileType.includes("pdf")) return "pdf";
        if (fileType.startsWith("video/")) return "video";
        return "document";
    }

    function formatFileSize(bytes) {
        if (!bytes) return "";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const TYPE_ICON = {
        pdf: { icon: "fa-file-pdf", color: "pdf", badge: "PDF" },
        video: { icon: "fa-file-video", color: "purple", badge: "VIDEO" },
        document: { icon: "fa-file-lines", color: "blue", badge: "FILE" }
    };

    function renderResources() {

        if (!resourceGrid) return;

        if (allResources.length === 0) {
            resourceGrid.innerHTML = "";
            if (noResults) noResults.classList.add("show");
            return;
        }

        resourceGrid.innerHTML = allResources.map(resource => {

            const type = classifyFileType(resource);
            const style = TYPE_ICON[type];
            const sizeLabel = formatFileSize(resource.fileSize);
            const uploadedLabel = resource.createdAt
                ? new Date(resource.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "";

            return `
                <article
                    class="resource-card"
                    data-type="${type}"
                    data-title="${escapeHTML(resource.title)}"
                    data-id="${resource.id}">

                    <div class="resource-card-top">
                        <div class="resource-type ${style.color}">
                            <i class="fas ${style.icon}"></i>
                        </div>
                        <span class="resource-badge">${style.badge}</span>
                    </div>

                    <h3>${escapeHTML(resource.title)}</h3>

                    <p>${escapeHTML(resource.description || "")}</p>

                    <div class="resource-meta">
                        ${sizeLabel ? `<span><i class="fas fa-file"></i> ${sizeLabel}</span>` : ""}
                        ${uploadedLabel ? `<span><i class="fas fa-clock"></i> ${uploadedLabel}</span>` : ""}
                    </div>

                    <div class="resource-footer">
                        <span>${escapeHTML(resource.category || "")}</span>
                        <button
                            type="button"
                            class="resource-btn"
                            data-download="${resource.id}"
                            ${resource.hasFile ? "" : "disabled"}>
                            <i class="fas fa-download"></i>
                            Download
                        </button>
                    </div>

                </article>
            `;

        }).join("");

    }

    async function loadResources() {

        try {

            const data = await api("/api/resources");

            allResources = data.resources || [];

            renderResources();

            filterResources();

        } catch (error) {

            console.error("Unable to load resources:", error);

            if (resourceGrid) resourceGrid.innerHTML = "";

            if (noResults) {
                noResults.classList.add("show");
                const heading = noResults.querySelector("h3");
                const message = noResults.querySelector("p");
                if (heading) heading.textContent = "Unable to load resources";
                if (message) {
                    message.textContent =
                        error.message === "Failed to fetch"
                            ? "Cannot connect to the server."
                            : error.message;
                }
            }

            if (/session has expired|log in again/i.test(error.message)) {
                setTimeout(() => { window.location.href = "index.html"; }, 1200);
            }

        }

    }


    /* =====================================================
       DOWNLOAD (event delegation, since cards render dynamically)
    ===================================================== */

    if (resourceGrid) {

        resourceGrid.addEventListener("click", async event => {

            const button = event.target.closest("[data-download]");
            if (!button) return;

            const id = button.dataset.download;
            const resource = allResources.find(r => r.id === id);
            if (!resource) return;

            const originalLabel = button.innerHTML;
            button.disabled = true;
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading...`;

            try {

                const blob = await apiBlob(`/api/resources/${id}/download`);

                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = resource.fileName || resource.title;
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                link.remove();

                setTimeout(() => URL.revokeObjectURL(url), 60000);

            } catch (error) {

                console.error("Download failed:", error);
                alert(error.message || "Unable to download this file.");

            } finally {

                button.disabled = false;
                button.innerHTML = originalLabel;

            }

        });

    }


    /* =====================================================
       RESOURCE FILTER
    ===================================================== */

    let currentFilter = "all";


    function filterResources() {

        const searchTerm =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";

        let visibleCount = 0;

        const resourceCards =
            resourceGrid
                ? resourceGrid.querySelectorAll(".resource-card")
                : [];


        resourceCards.forEach((card) => {

            const type =
                card.dataset.type || "";

            const title =
                card.dataset.title || "";

            const cardText =
                card.textContent
                    .toLowerCase();


            const matchesFilter =
                currentFilter === "all" ||
                type === currentFilter;


            const matchesSearch =
                !searchTerm ||
                title
                    .toLowerCase()
                    .includes(searchTerm) ||
                cardText.includes(searchTerm);


            if (
                matchesFilter &&
                matchesSearch
            ) {

                card.style.display = "";

                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });


        if (noResults) {

            if (visibleCount === 0) {

                noResults.classList.add(
                    "show"
                );

            } else {

                noResults.classList.remove(
                    "show"
                );

            }

        }

    }


    /* =====================================================
       FILTER BUTTONS
    ===================================================== */

    filterButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    (btn) => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter ||
                    "all";


                filterResources();

            }
        );

    });


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterResources
        );

    }


    /* =====================================================
       GLOBAL CLICK
    ===================================================== */

    document.addEventListener(
        "click",
        () => {

            closeNotifications();

        }
    );


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeSidebar();

                closeNotifications();

            }

        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 900) {

                closeSidebar();

            }

        }
    );


    /* =====================================================
       SIDEBAR ICON HOVER
    ===================================================== */

    const menuItems =
        document.querySelectorAll(
            ".menu li"
        );


    menuItems.forEach((item) => {

        const icon =
            item.querySelector("i");

        if (!icon) return;


        item.addEventListener(
            "mouseenter",
            () => {

                icon.style.transform =
                    "scale(1.15)";

            }
        );


        item.addEventListener(
            "mouseleave",
            () => {

                icon.style.transform =
                    "scale(1)";

            }
        );

    });


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    loadResources();

});
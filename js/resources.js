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

    const resourceCards =
        document.querySelectorAll(".resource-card");

    const noResults =
        document.getElementById("noResults");


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
       RESOURCE BUTTON FEEDBACK
    ===================================================== */

    const resourceButtons =
        document.querySelectorAll(
            ".resource-btn"
        );


    resourceButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                button.classList.add(
                    "clicked"
                );

                setTimeout(() => {

                    button.classList.remove(
                        "clicked"
                    );

                }, 300);

            }
        );

    });


    /* =====================================================
       INITIAL FILTER
    ===================================================== */

    filterResources();

});
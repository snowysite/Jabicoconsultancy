/* =========================================================
   JABICO CONSULTANCY — STUDENT DASHBOARD
   Premium Dashboard JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const body = document.body;

    const sidebar = document.getElementById("sidebar");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const notificationBtn = document.getElementById("notificationBtn");
    const notificationDropdown =
        document.getElementById("notificationDropdown");

    const themeToggle = document.getElementById("themeToggle");

    const themeIcon = themeToggle
        ? themeToggle.querySelector("i")
        : null;

    const menuItems =
        document.querySelectorAll(".menu li");

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

            mobileMenuBtn.setAttribute(
                "aria-label",
                "Close navigation"
            );

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "true"
            );

            mobileMenuBtn.classList.add("active");

            mobileMenuBtn.innerHTML =
                '<i class="fas fa-xmark"></i>';
        }

        body.classList.add("sidebar-open");
    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("show");
        }

        if (mobileMenuBtn) {

            mobileMenuBtn.setAttribute(
                "aria-label",
                "Open navigation"
            );

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenuBtn.classList.remove("active");

            mobileMenuBtn.innerHTML =
                '<i class="fas fa-bars"></i>';
        }

        body.classList.remove("sidebar-open");
    }


    function toggleSidebar() {

        if (!sidebar) return;

        if (sidebar.classList.contains("open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }


    /* =====================================================
       MOBILE MENU BUTTON
    ===================================================== */

    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener("click", (event) => {

            event.stopPropagation();

            toggleSidebar();

        });

    }


    /* =====================================================
       SIDEBAR OVERLAY
    ===================================================== */

    if (sidebarOverlay) {

        sidebarOverlay.addEventListener("click", () => {

            closeSidebar();

        });

    }


    /* =====================================================
       SIDEBAR NAVIGATION
    ===================================================== */

    menuItems.forEach((item) => {

        const link = item.querySelector("a");

        if (!link) return;


        link.addEventListener("click", () => {

            menuItems.forEach((menuItem) => {

                menuItem.classList.remove("active");

            });

            item.classList.add("active");


            if (window.innerWidth <= 900) {

                closeSidebar();

            }

        });

    });


    /* =====================================================
       SIDEBAR ICON HOVER
    ===================================================== */

    menuItems.forEach((item) => {

        const icon = item.querySelector("i");

        if (!icon) return;


        item.addEventListener("mouseenter", () => {

            if (window.innerWidth > 900) {

                icon.style.transform = "scale(1.12)";

            }

        });


        item.addEventListener("mouseleave", () => {

            icon.style.transform = "scale(1)";

        });

    });


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    function openNotifications() {

        if (!notificationDropdown) return;

        notificationDropdown.classList.add("show");

        if (notificationBtn) {

            notificationBtn.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    function closeNotifications() {

        if (!notificationDropdown) return;

        notificationDropdown.classList.remove("show");

        if (notificationBtn) {

            notificationBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    function toggleNotifications() {

        if (!notificationDropdown) return;

        if (
            notificationDropdown.classList.contains("show")
        ) {

            closeNotifications();

        } else {

            openNotifications();

        }

    }


    if (notificationBtn) {

        notificationBtn.addEventListener("click", (event) => {

            event.stopPropagation();

            toggleNotifications();

        });

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
       THEME SYSTEM
    ===================================================== */

    function applyTheme(theme) {

        const isDark = theme === "dark";

        body.classList.toggle(
            "dark-mode",
            isDark
        );


        if (themeIcon) {

            themeIcon.className = isDark
                ? "fas fa-sun"
                : "fas fa-moon";

        }


        if (themeToggle) {

            themeToggle.setAttribute(
                "aria-label",
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );

            themeToggle.setAttribute(
                "aria-pressed",
                isDark.toString()
            );

        }


        localStorage.setItem(
            "jabico-theme",
            isDark ? "dark" : "light"
        );


        /* Update charts if available */

        if (typeof updateChartsTheme === "function") {

            updateChartsTheme(isDark);

        }

    }


    const savedTheme =
        localStorage.getItem("jabico-theme");


    if (savedTheme) {

        applyTheme(savedTheme);

    } else {

        const prefersDark =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        applyTheme(
            prefersDark ? "dark" : "light"
        );

    }


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            const isDark =
                body.classList.contains("dark-mode");

            applyTheme(
                isDark ? "light" : "dark"
            );

        });

    }


    /* =====================================================
       SEARCH
    ===================================================== */

    const searchInput =
        document.querySelector(".search-box input");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const searchTerm =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                const modules =
                    document.querySelectorAll(".module");


                modules.forEach((module) => {

                    const text =
                        module.textContent
                            .toLowerCase();


                    if (
                        searchTerm === "" ||
                        text.includes(searchTerm)
                    ) {

                        module.style.display = "";

                    } else {

                        module.style.display = "none";

                    }

                });

            }
        );

    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") return;

        closeSidebar();

        closeNotifications();

    });


    /* =====================================================
       CLICK OUTSIDE
    ===================================================== */

    document.addEventListener("click", (event) => {

        if (
            notificationDropdown &&
            notificationBtn &&
            !notificationDropdown.contains(event.target) &&
            !notificationBtn.contains(event.target)
        ) {

            closeNotifications();

        }

    });


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {

            closeSidebar();

        }

    });


    /* =====================================================
       ACTIVE LINK BASED ON CURRENT PAGE
    ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    if (currentPage) {

        menuItems.forEach((item) => {

            const link = item.querySelector("a");

            if (!link) return;


            const href =
                link.getAttribute("href");


            if (!href) return;


            const linkPage =
                href
                    .split("/")
                    .pop()
                    .split("?")[0]
                    .toLowerCase();


            if (
                linkPage &&
                linkPage === currentPage
            ) {

                menuItems.forEach((menuItem) => {

                    menuItem.classList.remove("active");

                });

                item.classList.add("active");

            }

        });

    }


    /* =====================================================
       CARD INTERACTION
    ===================================================== */

    const cards =
        document.querySelectorAll(
            ".stat-card, .card, .panel"
        );


    cards.forEach((card) => {

        card.addEventListener(
            "mouseenter",
            () => {

                card.classList.add("is-hovered");

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.classList.remove("is-hovered");

            }
        );

    });


    /* =====================================================
       PAGE LOAD
    ===================================================== */

    requestAnimationFrame(() => {

        body.classList.add("page-loaded");

    });


    /* =====================================================
       REDUCED MOTION CHECK
    ===================================================== */

    const reducedMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reducedMotion) {

        body.classList.add("reduce-motion");

    }

});
/* =========================================================
   JABICO CONSULTANCY — CLASSES PAGE
   Navigation + Theme + Notifications + Search
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
        document.getElementById("classSearch");

    const classCards =
        document.querySelectorAll(".class-card");

    const noResults =
        document.getElementById("noResults");

    const classesSection =
        document.getElementById("classesSection");

    const scheduleSection =
        document.getElementById("scheduleSection");

    const viewButtons =
        document.querySelectorAll(".view-btn");


    /* =====================================================
       SIDEBAR OPEN
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


    /* =====================================================
       SIDEBAR CLOSE
    ===================================================== */

    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (sidebarOverlay) {

            sidebarOverlay.classList.remove(
                "show"
            );

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


    /* =====================================================
       MOBILE MENU
    ===================================================== */

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


    /* =====================================================
       OVERLAY
    ===================================================== */

    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* =====================================================
       SIDEBAR NAVIGATION
    ===================================================== */

    const menuItems =
        document.querySelectorAll(".menu li");

    menuItems.forEach((item) => {

        const link =
            item.querySelector("a");

        if (!link) return;

        link.addEventListener(
            "click",
            () => {

                menuItems.forEach(
                    (menuItem) => {

                        menuItem.classList.remove(
                            "active"
                        );

                    }
                );

                item.classList.add("active");

                if (
                    window.innerWidth <= 900
                ) {

                    closeSidebar();

                }

            }
        );

    });


    /* =====================================================
       SIDEBAR ICON HOVER
    ===================================================== */

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
       NOTIFICATIONS
    ===================================================== */

    function openNotifications() {

        if (!notificationDropdown) return;

        notificationDropdown.classList.add(
            "show"
        );

    }


    function closeNotifications() {

        if (!notificationDropdown) return;

        notificationDropdown.classList.remove(
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


    document.addEventListener(
        "click",
        () => {

            closeNotifications();

        }
    );


    /* =====================================================
       THEME
    ===================================================== */

    const savedTheme =
        localStorage.getItem(
            "jabico-theme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        if (themeIcon) {

            themeIcon.className =
                "fas fa-sun";

        }

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

        if (themeIcon) {

            themeIcon.className =
                "fas fa-moon";

        }

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


                if (themeIcon) {

                    themeIcon.className =
                        isDark
                            ? "fas fa-sun"
                            : "fas fa-moon";

                }

            }
        );

    }


    /* =====================================================
       CLASS SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const search =
                    searchInput.value
                        .toLowerCase()
                        .trim();

                let visibleCount = 0;


                classCards.forEach(
                    (card) => {

                        const className =
                            card.dataset.class
                            || "";

                        const cardText =
                            card.textContent
                                .toLowerCase();


                        const match =
                            className
                                .includes(search)
                            ||
                            cardText
                                .includes(search);


                        if (match) {

                            card.style.display =
                                "";

                            visibleCount++;

                        } else {

                            card.style.display =
                                "none";

                        }

                    }
                );


                if (
                    noResults &&
                    visibleCount === 0
                ) {

                    noResults.classList.add(
                        "show"
                    );

                } else if (noResults) {

                    noResults.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    /* =====================================================
       VIEW SWITCHING
    ===================================================== */

    viewButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    viewButtons.forEach(
                        (btn) => {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const view =
                        button.dataset.view;


                    if (view === "schedule") {

                        if (classesSection) {

                            classesSection.style.display =
                                "none";

                        }

                        if (scheduleSection) {

                            scheduleSection.style.display =
                                "block";

                            scheduleSection.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        }

                    } else {

                        if (scheduleSection) {

                            scheduleSection.style.display =
                                "none";

                        }

                        if (classesSection) {

                            classesSection.style.display =
                                "block";

                        }

                    }

                }
            );

        }
    );


    /* =====================================================
       DEFAULT VIEW
    ===================================================== */

    if (scheduleSection) {

        scheduleSection.style.display =
            "none";

    }


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

            if (
                window.innerWidth > 900
            ) {

                closeSidebar();

            }

        }
    );


    /* =====================================================
       PAGE LOAD
    ===================================================== */

    setTimeout(
        () => {

            document.body.classList.add(
                "page-loaded"
            );

        },
        100
    );


});
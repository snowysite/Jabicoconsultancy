/* =========================================================
   JABICO CONSULTANCY — ANNOUNCEMENT JAVASCRIPT
   Premium Student Announcement Page
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar = document.getElementById("sidebar");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const notificationBtn = document.getElementById("notificationBtn");
    const notificationDropdown =
        document.getElementById("notificationDropdown");

    const themeToggle = document.getElementById("themeToggle");

    const searchInput = document.getElementById("announcementSearch");

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const announcementCards =
        document.querySelectorAll(".announcement-card");

    const modal =
        document.getElementById("announcementModal");

    const modalClose =
        document.getElementById("announcementModalClose");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalCategory =
        document.getElementById("modalCategory");

    const modalDate =
        document.getElementById("modalDate");

    const modalContent =
        document.getElementById("modalContent");


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

            mobileMenuBtn.classList.add("active");

            mobileMenuBtn.setAttribute(
                "aria-label",
                "Close navigation"
            );

            mobileMenuBtn.innerHTML =
                '<i class="fas fa-xmark"></i>';
        }

        document.body.classList.add("sidebar-open");
    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("show");
        }

        if (mobileMenuBtn) {

            mobileMenuBtn.classList.remove("active");

            mobileMenuBtn.setAttribute(
                "aria-label",
                "Open navigation"
            );

            mobileMenuBtn.innerHTML =
                '<i class="fas fa-bars"></i>';
        }

        document.body.classList.remove("sidebar-open");
    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener("click", (event) => {

            event.stopPropagation();

            if (
                sidebar &&
                sidebar.classList.contains("open")
            ) {

                closeSidebar();

            } else {

                openSidebar();

            }

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

    const menuItems =
        document.querySelectorAll(".menu li");

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

            icon.style.transform = "scale(1.15)";

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

    }


    function closeNotifications() {

        if (!notificationDropdown) return;

        notificationDropdown.classList.remove("show");

    }


    if (notificationBtn) {

        notificationBtn.addEventListener("click", (event) => {

            event.stopPropagation();

            if (
                notificationDropdown &&
                notificationDropdown.classList.contains("show")
            ) {

                closeNotifications();

            } else {

                openNotifications();

            }

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
       THEME TOGGLE
    ===================================================== */

    const themeIcon = themeToggle
        ? themeToggle.querySelector("i")
        : null;

    const savedTheme =
        localStorage.getItem("jabico-theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        if (themeIcon) {

            themeIcon.className =
                "fas fa-sun";

        }

    } else {

        document.body.classList.remove("dark-mode");

        if (themeIcon) {

            themeIcon.className =
                "fas fa-moon";

        }

    }


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            const isDark =
                document.body.classList.contains(
                    "dark-mode"
                );


            localStorage.setItem(
                "jabico-theme",
                isDark ? "dark" : "light"
            );


            if (themeIcon) {

                themeIcon.className = isDark
                    ? "fas fa-sun"
                    : "fas fa-moon";

            }

        });

    }


    /* =====================================================
       ANNOUNCEMENT SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const searchTerm =
                    searchInput.value
                        .toLowerCase()
                        .trim();

                announcementCards.forEach((card) => {

                    const text =
                        card.textContent.toLowerCase();

                    if (
                        text.includes(searchTerm)
                    ) {

                        card.style.display = "";

                        card.classList.add(
                            "search-match"
                        );

                    } else {

                        card.style.display = "none";

                        card.classList.remove(
                            "search-match"
                        );

                    }

                });

                updateEmptyState();

            }
        );

    }


    /* =====================================================
       FILTER SYSTEM
    ===================================================== */

    let activeFilter = "all";


    filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

            filterButtons.forEach((btn) => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            activeFilter =
                button.dataset.filter || "all";

            filterAnnouncements();

        });

    });


    function filterAnnouncements() {

        const searchTerm = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

        announcementCards.forEach((card) => {

            const category =
                (
                    card.dataset.category || "all"
                ).toLowerCase();

            const text =
                card.textContent.toLowerCase();


            const matchesFilter =
                activeFilter === "all" ||
                category === activeFilter;


            const matchesSearch =
                !searchTerm ||
                text.includes(searchTerm);


            if (
                matchesFilter &&
                matchesSearch
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

        updateEmptyState();

    }


    /* =====================================================
       EMPTY SEARCH STATE
    ===================================================== */

    function updateEmptyState() {

        let visibleCards = 0;

        announcementCards.forEach((card) => {

            if (
                card.style.display !== "none"
            ) {

                visibleCards++;

            }

        });


        let emptyState =
            document.getElementById(
                "announcementEmpty"
            );


        if (visibleCards === 0) {

            if (!emptyState) {

                emptyState =
                    document.createElement("div");

                emptyState.id =
                    "announcementEmpty";

                emptyState.className =
                    "announcement-empty";

                emptyState.innerHTML = `
                    <div class="empty-icon">
                        <i class="fas fa-bullhorn"></i>
                    </div>

                    <h3>No announcements found</h3>

                    <p>
                        Try another search term or
                        choose a different category.
                    </p>

                    <button
                        type="button"
                        class="reset-filter-btn"
                        id="resetAnnouncementFilter"
                    >
                        <i class="fas fa-rotate-left"></i>
                        Reset Filters
                    </button>
                `;


                const container =
                    document.querySelector(
                        ".announcement-list"
                    ) ||
                    document.querySelector(
                        ".announcements-grid"
                    ) ||
                    document.querySelector(
                        ".announcement-container"
                    );


                if (container) {

                    container.appendChild(
                        emptyState
                    );

                }


                const resetButton =
                    document.getElementById(
                        "resetAnnouncementFilter"
                    );


                if (resetButton) {

                    resetButton.addEventListener(
                        "click",
                        resetFilters
                    );

                }

            }

            emptyState.style.display = "flex";

        } else {

            if (emptyState) {

                emptyState.style.display = "none";

            }

        }

    }


    /* =====================================================
       RESET FILTERS
    ===================================================== */

    function resetFilters() {

        activeFilter = "all";

        if (searchInput) {

            searchInput.value = "";

        }

        filterButtons.forEach((button) => {

            button.classList.remove("active");

            if (
                button.dataset.filter === "all"
            ) {

                button.classList.add("active");

            }

        });

        announcementCards.forEach((card) => {

            card.style.display = "";

        });

        updateEmptyState();

    }


    /* =====================================================
       ANNOUNCEMENT MODAL
    ===================================================== */

    function openAnnouncement(card) {

        if (!modal || !card) return;


        const title =
            card.dataset.title ||
            card.querySelector(
                ".announcement-title, h3, h2"
            )?.textContent ||
            "Announcement";


        const category =
            card.dataset.categoryLabel ||
            card.dataset.category ||
            "Announcement";


        const date =
            card.dataset.date ||
            card.querySelector(
                ".announcement-date, time, small"
            )?.textContent ||
            "";


        const content =
            card.dataset.content ||
            card.querySelector(
                ".announcement-full-content, .announcement-description, p"
            )?.textContent ||
            "No additional information is available.";


        if (modalTitle) {

            modalTitle.textContent =
                title.trim();

        }


        if (modalCategory) {

            modalCategory.textContent =
                category.trim();

        }


        if (modalDate) {

            modalDate.textContent =
                date.trim();

        }


        if (modalContent) {

            modalContent.textContent =
                content.trim();

        }


        modal.classList.add("show");

        document.body.classList.add(
            "modal-open"
        );

    }


    function closeAnnouncement() {

        if (!modal) return;

        modal.classList.remove("show");

        document.body.classList.remove(
            "modal-open"
        );

    }


    /* =====================================================
       ANNOUNCEMENT CARD CLICK
    ===================================================== */

    announcementCards.forEach((card) => {

        const viewButton =
            card.querySelector(
                ".view-announcement, .announcement-link, .read-more"
            );


        if (viewButton) {

            viewButton.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    event.stopPropagation();

                    openAnnouncement(card);

                }
            );

        } else {

            card.addEventListener(
                "click",
                () => {

                    openAnnouncement(card);

                }
            );

        }

    });


    /* =====================================================
       MODAL CLOSE
    ===================================================== */

    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeAnnouncement
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === modal
                ) {

                    closeAnnouncement();

                }

            }
        );

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

                closeAnnouncement();

            }

        }
    );


    /* =====================================================
       MARK ANNOUNCEMENT AS READ
    ===================================================== */

    const readButtons =
        document.querySelectorAll(
            ".mark-read, [data-action='read']"
        );


    readButtons.forEach((button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                const card =
                    button.closest(
                        ".announcement-card"
                    );


                if (!card) return;


                card.classList.add(
                    "announcement-read"
                );


                card.classList.remove(
                    "unread"
                );


                button.innerHTML =
                    '<i class="fas fa-check"></i> Read';


                button.disabled = true;


                updateNotificationCount();

            }
        );

    });


    /* =====================================================
       NOTIFICATION COUNT
    ===================================================== */

    function updateNotificationCount() {

        const unreadAnnouncements =
            document.querySelectorAll(
                ".announcement-card.unread"
            ).length;


        const notificationDot =
            document.querySelector(
                ".notification-dot"
            );


        if (notificationDot) {

            notificationDot.style.display =
                unreadAnnouncements > 0
                    ? "block"
                    : "none";

        }

    }


    /* =====================================================
       SORT / NEWEST FIRST
    ===================================================== */

    const sortSelect =
        document.getElementById(
            "announcementSort"
        );


    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            () => {

                const list =
                    document.querySelector(
                        ".announcement-list"
                    ) ||
                    document.querySelector(
                        ".announcements-grid"
                    );


                if (!list) return;


                const cards =
                    Array.from(
                        list.querySelectorAll(
                            ".announcement-card"
                        )
                    );


                const sortValue =
                    sortSelect.value;


                cards.sort((a, b) => {

                    const dateA =
                        new Date(
                            a.dataset.dateRaw ||
                            a.dataset.date ||
                            0
                        );


                    const dateB =
                        new Date(
                            b.dataset.dateRaw ||
                            b.dataset.date ||
                            0
                        );


                    if (
                        sortValue === "oldest"
                    ) {

                        return dateA - dateB;

                    }


                    return dateB - dateA;

                });


                cards.forEach((card) => {

                    list.appendChild(card);

                });

            }
        );

    }


    /* =====================================================
       MARK ALL AS READ
    ===================================================== */

    const markAllRead =
        document.getElementById(
            "markAllRead"
        );


    if (markAllRead) {

        markAllRead.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                const unread =
                    document.querySelectorAll(
                        ".announcement-card.unread"
                    );


                unread.forEach((card) => {

                    card.classList.remove(
                        "unread"
                    );

                    card.classList.add(
                        "announcement-read"
                    );

                    const button =
                        card.querySelector(
                            ".mark-read, [data-action='read']"
                        );


                    if (button) {

                        button.innerHTML =
                            '<i class="fas fa-check"></i> Read';

                        button.disabled = true;

                    }

                });


                updateNotificationCount();

            }
        );

    }


    /* =====================================================
       PAGE ANIMATION
    ===================================================== */

    const animatedCards =
        document.querySelectorAll(
            ".announcement-card"
        );


    animatedCards.forEach(
        (card, index) => {

            card.style.opacity = "0";

            card.style.transform =
                "translateY(15px)";


            setTimeout(() => {

                card.style.transition =
                    "opacity 0.45s ease, transform 0.45s ease";

                card.style.opacity = "1";

                card.style.transform =
                    "translateY(0)";

            }, 80 + index * 60);

        }
    );


    /* =====================================================
       WINDOW RESIZE
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
       INITIALIZE
    ===================================================== */

    updateNotificationCount();

    filterAnnouncements();


    setTimeout(() => {

        document.body.classList.add(
            "page-loaded"
        );

    }, 100);

});
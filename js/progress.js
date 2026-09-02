/* =========================================================
   JABICO PROJECTS PAGE
   Projects Page Interactions & Animations
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const projectGrid = document.querySelector(".project-grid");
    const projectCards = Array.from(
        document.querySelectorAll(".project-card")
    );

    const filterButtons = Array.from(
        document.querySelectorAll(".filter-btn")
    );

    const sortSelect = document.querySelector(".sort-group select");

    const projectCount = document.querySelector(".project-count");

    const searchInput =
        document.querySelector(".project-search") ||
        document.querySelector("#projectSearch") ||
        document.querySelector("[data-project-search]");

    const viewButtons = document.querySelectorAll(
        ".view-project-btn"
    );

    const menuButtons = document.querySelectorAll(
        ".project-menu"
    );

    const progressBars = document.querySelectorAll(
        ".progress-bar span"
    );

    /* =====================================================
       PROJECT DATA
    ===================================================== */

    const projects = projectCards.map((card, index) => {
        const titleElement = card.querySelector("h3");

        const statusElement =
            card.querySelector(".project-status");

        const scoreElement =
            card.querySelector(".project-score strong");

        const title = titleElement
            ? titleElement.textContent.trim()
            : `Project ${index + 1}`;

        let status = "active";

        if (statusElement) {
            const classList = Array.from(
                statusElement.classList
            );

            if (classList.includes("completed")) {
                status = "completed";
            } else if (classList.includes("upcoming")) {
                status = "upcoming";
            } else {
                status = "active";
            }
        }

        let score = 0;

        if (scoreElement) {
            const scoreText =
                scoreElement.textContent.replace(
                    /[^0-9.]/g,
                    ""
                );

            score = parseFloat(scoreText) || 0;
        }

        return {
            element: card,
            title,
            status,
            score,
            index
        };
    });

    let currentFilter = "all";
    let currentSearch = "";

    /* =====================================================
       HELPER FUNCTIONS
    ===================================================== */

    function normalizeText(text) {
        return text
            .toLowerCase()
            .trim();
    }

    function showCard(card) {
        card.style.display = "";

        requestAnimationFrame(() => {
            card.classList.remove("project-card-hidden");

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        });
    }

    function hideCard(card) {
        card.classList.add("project-card-hidden");

        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";

        setTimeout(() => {
            if (card.classList.contains("project-card-hidden")) {
                card.style.display = "none";
            }
        }, 220);
    }

    function updateProjectCount(visibleCount) {
        if (!projectCount) {
            return;
        }

        projectCount.textContent =
            `${visibleCount} project${visibleCount === 1 ? "" : "s"}`;
    }

    /* =====================================================
       FILTER PROJECTS
    ===================================================== */

    function filterProjects() {
        const searchTerm = normalizeText(currentSearch);

        let visibleProjects = [];

        projects.forEach((project) => {
            const matchesFilter =
                currentFilter === "all" ||
                project.status === currentFilter;

            const matchesSearch =
                !searchTerm ||
                normalizeText(project.title).includes(
                    searchTerm
                ) ||
                normalizeText(
                    project.element.textContent
                ).includes(searchTerm);

            const shouldShow =
                matchesFilter && matchesSearch;

            if (shouldShow) {
                visibleProjects.push(project);
                showCard(project.element);
            } else {
                hideCard(project.element);
            }
        });

        updateProjectCount(visibleProjects.length);

        updateEmptyState(visibleProjects.length);
    }

    /* =====================================================
       FILTER BUTTONS
    ===================================================== */

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter =
                button.dataset.filter ||
                normalizeText(button.textContent);

            if (
                currentFilter === "all" ||
                currentFilter === "projects"
            ) {
                currentFilter = "all";
            }

            filterProjects();
        });
    });

    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            currentSearch = event.target.value;

            filterProjects();
        });

        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                searchInput.value = "";
                currentSearch = "";

                filterProjects();
                searchInput.blur();
            }
        });
    }

    /* =====================================================
       SORTING
    ===================================================== */

    if (sortSelect && projectGrid) {
        sortSelect.addEventListener("change", () => {
            const sortValue =
                normalizeText(sortSelect.value);

            const sortedProjects = [...projects];

            if (
                sortValue.includes("name") ||
                sortValue.includes("alphabet")
            ) {
                sortedProjects.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );
            }

            else if (
                sortValue.includes("score") ||
                sortValue.includes("progress") ||
                sortValue.includes("highest")
            ) {
                sortedProjects.sort(
                    (a, b) => b.score - a.score
                );
            }

            else if (sortValue.includes("lowest")) {
                sortedProjects.sort(
                    (a, b) => a.score - b.score
                );
            }

            else if (
                sortValue.includes("newest") ||
                sortValue.includes("recent")
            ) {
                sortedProjects.sort(
                    (a, b) => b.index - a.index
                );
            }

            else {
                sortedProjects.sort(
                    (a, b) => a.index - b.index
                );
            }

            sortedProjects.forEach((project, index) => {
                const card = project.element;

                card.style.opacity = "0";
                card.style.transform =
                    "translateY(10px)";

                projectGrid.appendChild(card);

                setTimeout(() => {
                    card.style.opacity = "";
                    card.style.transform = "";
                }, index * 50);
            });
        });
    }

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    function updateEmptyState(visibleCount) {
        if (!projectGrid) {
            return;
        }

        let emptyState =
            projectGrid.querySelector(".project-empty");

        if (visibleCount === 0) {
            if (!emptyState) {
                emptyState =
                    document.createElement("div");

                emptyState.className =
                    "project-empty";

                emptyState.innerHTML = `
                    <div class="empty-icon">
                        <i class="fa-solid fa-folder-open"></i>
                    </div>

                    <h3>No projects found</h3>

                    <p>
                        Try changing your search or filter
                        to find another project.
                    </p>
                `;

                projectGrid.appendChild(emptyState);
            }

            requestAnimationFrame(() => {
                emptyState.style.opacity = "1";
                emptyState.style.transform =
                    "translateY(0)";
            });
        } else if (emptyState) {
            emptyState.remove();
        }
    }

    /* =====================================================
       VIEW PROJECT BUTTONS
    ===================================================== */

    viewButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            const card =
                button.closest(".project-card");

            if (!card) {
                return;
            }

            const titleElement =
                card.querySelector("h3");

            const title = titleElement
                ? titleElement.textContent.trim()
                : "Project";

            /*
             * If the button already has a real href,
             * allow normal navigation.
             */

            const href = button.getAttribute("href");

            if (
                href &&
                href !== "#" &&
                href.trim() !== ""
            ) {
                window.location.href = href;
                return;
            }

            /*
             * Otherwise create a lightweight
             * project interaction.
             */

            card.classList.add("project-opening");

            setTimeout(() => {
                card.classList.remove(
                    "project-opening"
                );

                console.log(
                    `Opening project: ${title}`
                );
            }, 450);
        });
    });

    /* =====================================================
       PROJECT MENU
    ===================================================== */

    menuButtons.forEach((button) => {
        button.setAttribute(
            "aria-haspopup",
            "true"
        );

        button.addEventListener("click", (event) => {
            event.stopPropagation();

            const currentMenu =
                button.parentElement.querySelector(
                    ".project-dropdown"
                );

            closeAllMenus(currentMenu);

            if (currentMenu) {
                currentMenu.classList.toggle(
                    "show"
                );

                return;
            }

            const menu =
                createProjectMenu(button);

            button.parentElement.appendChild(menu);

            requestAnimationFrame(() => {
                menu.classList.add("show");
            });
        });
    });

    function createProjectMenu(button) {
        const menu =
            document.createElement("div");

        menu.className = "project-dropdown";

        menu.innerHTML = `
            <button type="button" data-action="view">
                <i class="fa-regular fa-eye"></i>
                View project
            </button>

            <button type="button" data-action="bookmark">
                <i class="fa-regular fa-bookmark"></i>
                Bookmark
            </button>

            <button type="button" data-action="share">
                <i class="fa-solid fa-share-nodes"></i>
                Share
            </button>
        `;

        menu.addEventListener("click", (event) => {
            const actionButton =
                event.target.closest("button");

            if (!actionButton) {
                return;
            }

            const card =
                button.closest(".project-card");

            const titleElement =
                card?.querySelector("h3");

            const title = titleElement
                ? titleElement.textContent.trim()
                : "Project";

            const action =
                actionButton.dataset.action;

            handleProjectAction(
                action,
                title,
                card
            );

            menu.classList.remove("show");
        });

        return menu;
    }

    function handleProjectAction(
        action,
        title,
        card
    ) {
        if (action === "view") {
            card?.classList.add(
                "project-opening"
            );

            setTimeout(() => {
                card?.classList.remove(
                    "project-opening"
                );
            }, 400);
        }

        if (action === "bookmark") {
            card?.classList.toggle(
                "bookmarked"
            );

            showToast(
                card?.classList.contains(
                    "bookmarked"
                )
                    ? `${title} bookmarked`
                    : `${title} removed from bookmarks`
            );
        }

        if (action === "share") {
            shareProject(title);
        }
    }

    /* =====================================================
       CLOSE MENUS
    ===================================================== */

    function closeAllMenus(except = null) {
        document
            .querySelectorAll(".project-dropdown.show")
            .forEach((menu) => {
                if (menu !== except) {
                    menu.classList.remove(
                        "show"
                    );
                }
            });
    }

    document.addEventListener("click", () => {
        closeAllMenus();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeAllMenus();
        }
    });

    /* =====================================================
       SHARE PROJECT
    ===================================================== */

    async function shareProject(title) {
        const shareData = {
            title: title,
            text: `Check out this project: ${title}`,
            url: window.location.href
        };

        if (
            navigator.share &&
            typeof navigator.share === "function"
        ) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.warn(
                        "Sharing failed:",
                        error
                    );
                }
            }

            return;
        }

        try {
            await navigator.clipboard.writeText(
                window.location.href
            );

            showToast(
                "Project link copied"
            );
        } catch (error) {
            showToast(
                "Unable to copy project link"
            );
        }
    }

    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message) {
        let toast =
            document.querySelector(
                ".project-toast"
            );

        if (!toast) {
            toast =
                document.createElement("div");

            toast.className =
                "project-toast";

            document.body.appendChild(toast);
        }

        toast.textContent = message;

        toast.classList.remove("show");

        requestAnimationFrame(() => {
            toast.classList.add("show");
        });

        clearTimeout(
            toast.hideTimeout
        );

        toast.hideTimeout =
            setTimeout(() => {
                toast.classList.remove(
                    "show"
                );
            }, 2600);
    }

    /* =====================================================
       PROGRESS BAR ANIMATION
    ===================================================== */

    function animateProgressBars() {
        progressBars.forEach((bar) => {
            const parent =
                bar.closest(".project-progress");

            if (!parent) {
                return;
            }

            const percentageElement =
                parent.querySelector(
                    ".progress-heading strong"
                );

            let percentage = 0;

            if (percentageElement) {
                const text =
                    percentageElement.textContent;

                percentage =
                    parseFloat(
                        text.replace(
                            /[^0-9.]/g,
                            ""
                        )
                    ) || 0;
            }

            percentage =
                Math.min(
                    100,
                    Math.max(
                        0,
                        percentage
                    )
                );

            bar.style.width = "0%";

            setTimeout(() => {
                bar.style.width =
                    `${percentage}%`;
            }, 350);
        });
    }

    /* =====================================================
       REVEAL ANIMATION
    ===================================================== */

    function revealCards() {
        projectCards.forEach(
            (card, index) => {
                card.style.opacity = "0";
                card.style.transform =
                    "translateY(18px)";

                card.style.transition =
                    `opacity 500ms ease ${index * 70}ms,
                     transform 500ms ease ${index * 70}ms`;

                requestAnimationFrame(() => {
                    card.style.opacity = "1";
                    card.style.transform =
                        "translateY(0)";
                });
            }
        );
    }

    /* =====================================================
       CARD HOVER EFFECT
    ===================================================== */

    projectCards.forEach((card) => {
        card.addEventListener(
            "mouseenter",
            () => {
                if (
                    window.matchMedia(
                        "(hover: hover)"
                    ).matches
                ) {
                    card.style.transform =
                        "translateY(-4px)";
                }
            }
        );

        card.addEventListener(
            "mouseleave",
            () => {
                if (
                    !card.classList.contains(
                        "project-opening"
                    )
                ) {
                    card.style.transform =
                        "translateY(0)";
                }
            }
        );
    });

    /* =====================================================
       OPENING ANIMATION
    ===================================================== */

    projectCards.forEach((card) => {
        card.addEventListener(
            "click",
            (event) => {
                if (
                    event.target.closest(
                        "button"
                    ) ||
                    event.target.closest("a")
                ) {
                    return;
                }

                card.classList.toggle(
                    "project-selected"
                );
            }
        );
    });

    /* =====================================================
       INITIALIZE
    ===================================================== */

    revealCards();

    setTimeout(() => {
        animateProgressBars();
    }, 250);

    updateProjectCount(
        projects.length
    );

    /* =====================================================
       ACCESSIBILITY
    ===================================================== */

    projectCards.forEach((card) => {
        card.setAttribute(
            "tabindex",
            "0"
        );

        card.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    if (
                        event.target !== card
                    ) {
                        return;
                    }

                    event.preventDefault();

                    card.classList.toggle(
                        "project-selected"
                    );
                }
            }
        );
    });
});

/* =========================================================
   JABICO CONSULTANCY — MODULES PAGE JAVASCRIPT

   Features:
   - Module filtering
   - Module search
   - Module count
   - Active tabs
   - Smooth animations
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const searchInput =
        document.getElementById("moduleSearch");

    const moduleGrid =
        document.getElementById("modulesGrid");

    const moduleCards =
        document.querySelectorAll(".module-card");

    const moduleTabs =
        document.querySelectorAll(".module-tab");

    const moduleCount =
        document.getElementById("moduleCount");

    const emptyState =
        document.getElementById("emptyModuleState");


    /* =====================================================
       STATE
    ===================================================== */

    let activeFilter = "all";

    let searchTerm = "";


    /* =====================================================
       UPDATE MODULES
    ===================================================== */

    function updateModules() {

        let visibleModules = 0;


        moduleCards.forEach((card) => {

            const status =
                card.dataset.status || "";

            const searchData =
                card.dataset.search || "";

            const title =
                card
                    .querySelector("h3")
                    ?.textContent
                    .toLowerCase() || "";


            const description =
                card
                    .querySelector("p")
                    ?.textContent
                    .toLowerCase() || "";


            const matchesFilter =
                activeFilter === "all" ||
                status === activeFilter;


            const matchesSearch =
                searchTerm === "" ||
                searchData
                    .toLowerCase()
                    .includes(searchTerm) ||
                title
                    .includes(searchTerm) ||
                description
                    .includes(searchTerm);


            if (
                matchesFilter &&
                matchesSearch
            ) {

                card.classList.remove("hidden");

                visibleModules++;


                /* Re-trigger animation */

                card.style.animation = "none";

                requestAnimationFrame(() => {

                    card.style.animation =
                        "moduleFade 0.35s ease both";

                });

            } else {

                card.classList.add("hidden");

            }

        });


        /* =================================================
           UPDATE COUNT
        ================================================== */

        if (moduleCount) {

            moduleCount.textContent =
                `${visibleModules} ${
                    visibleModules === 1
                        ? "Module"
                        : "Modules"
                }`;

        }


        /* =================================================
           EMPTY STATE
        ================================================== */

        if (emptyState) {

            if (visibleModules === 0) {

                emptyState.classList.add("show");

            } else {

                emptyState.classList.remove("show");

            }

        }

    }


    /* =====================================================
       FILTER TABS
    ===================================================== */

    moduleTabs.forEach((tab) => {

        tab.addEventListener("click", () => {

            moduleTabs.forEach((item) => {

                item.classList.remove("active");

            });


            tab.classList.add("active");


            activeFilter =
                tab.dataset.filter || "all";


            updateModules();

        });

    });


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                searchTerm =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                updateModules();

            }
        );

    }


    /* =====================================================
       PREVENT LOCKED MODULE NAVIGATION
    ===================================================== */

    const disabledLinks =
        document.querySelectorAll(
            ".module-action.disabled"
        );


    disabledLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            event.preventDefault();

        });

    });


    /* =====================================================
       INITIAL COUNT
    ===================================================== */

    updateModules();


    /* =====================================================
       STAGGER CARD ANIMATIONS
    ===================================================== */

    moduleCards.forEach((card, index) => {

        card.style.animationDelay =
            `${index * 0.06}s`;

    });


    /* =====================================================
       KEYBOARD SEARCH SHORTCUT

       Press "/" to focus search.
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "/" &&
                document.activeElement.tagName !== "INPUT" &&
                document.activeElement.tagName !== "TEXTAREA"
            ) {

                event.preventDefault();

                if (searchInput) {

                    searchInput.focus();

                }

            }

        }
    );


    /* =====================================================
       CLEAR SEARCH WITH ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                searchInput &&
                document.activeElement === searchInput
            ) {

                searchInput.value = "";

                searchTerm = "";

                searchInput.blur();

                updateModules();

            }

        }
    );


    /* =====================================================
       RESPONSIVE CLEANUP
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth <= 650) {

                moduleTabs.forEach((tab) => {

                    tab.style.whiteSpace =
                        "nowrap";

                });

            }

        }
    );

});


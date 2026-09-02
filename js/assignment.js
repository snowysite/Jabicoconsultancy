/* ===========================================================
   JABICO CONSULTANCY
   ASSIGNMENT PAGE
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       ELEMENTS
    ========================================== */

    const searchInput = document.querySelector("#assignmentSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const assignments = document.querySelectorAll(".assignment-card");

    const uploadInput = document.querySelector("#assignmentUpload");
    const uploadText = document.querySelector("#uploadFileName");

    const modal = document.querySelector("#submitModal");
    const modalOpenButtons = document.querySelectorAll(".submit-btn");
    const modalClose = document.querySelector("#closeModal");
    const modalOverlay = document.querySelector(".modal-overlay");

    const notificationBtn = document.querySelector("#notificationBtn");
    const notificationDropdown =
        document.querySelector("#notificationDropdown");

    const themeToggle = document.querySelector("#themeToggle");

    const sidebar = document.querySelector("#sidebar");
    const menuButton = document.querySelector("#mobileMenuBtn");
    const overlay = document.querySelector("#sidebarOverlay");



    /* ==========================================
       MOBILE SIDEBAR
    ========================================== */

    function openSidebar() {

        sidebar.classList.add("open");
        overlay.classList.add("show");

    }

    function closeSidebar() {

        sidebar.classList.remove("open");
        overlay.classList.remove("show");

    }

    if(menuButton){

        menuButton.addEventListener("click",()=>{

            sidebar.classList.contains("open")
                ? closeSidebar()
                : openSidebar();

        });

    }

    if(overlay){

        overlay.addEventListener("click",closeSidebar);

    }



    /* ==========================================
       NOTIFICATION
    ========================================== */

    function closeNotification(){

        notificationDropdown.classList.remove("show");

    }

    function openNotification(){

        notificationDropdown.classList.add("show");

    }

    if(notificationBtn){

        notificationBtn.addEventListener("click",(e)=>{

            e.stopPropagation();

            notificationDropdown.classList.contains("show")
                ? closeNotification()
                : openNotification();

        });

    }

    document.addEventListener("click",closeNotification);



    /* ==========================================
       DARK MODE
    ========================================== */

    if(themeToggle){

        const icon = themeToggle.querySelector("i");

        const saved =
            localStorage.getItem("jabico-theme");

        if(saved==="dark"){

            document.body.classList.add("dark-mode");

            if(icon)
                icon.className="fas fa-sun";

        }

        themeToggle.addEventListener("click",()=>{

            document.body.classList.toggle("dark-mode");

            const dark =
                document.body.classList.contains("dark-mode");

            localStorage.setItem(
                "jabico-theme",
                dark?"dark":"light"
            );

            if(icon){

                icon.className=
                    dark
                    ?"fas fa-sun"
                    :"fas fa-moon";

            }

        });

    }



    /* ==========================================
       SEARCH
    ========================================== */

    if(searchInput){

        searchInput.addEventListener("keyup",()=>{

            const value =
                searchInput.value.toLowerCase();

            assignments.forEach(card=>{

                const text =
                    card.innerText.toLowerCase();

                card.style.display =
                    text.includes(value)
                    ? "flex"
                    : "none";

            });

        });

    }



    /* ==========================================
       FILTERS
    ========================================== */

    filterButtons.forEach(button=>{

        button.addEventListener("click",()=>{

            filterButtons.forEach(btn=>
                btn.classList.remove("active"));

            button.classList.add("active");

            const filter =
                button.dataset.filter;

            assignments.forEach(card=>{

                if(filter==="all"){

                    card.style.display="flex";

                    return;

                }

                card.style.display=
                    card.dataset.status===filter
                    ? "flex"
                    : "none";

            });

            updateStats();

        });

    });



    /* ==========================================
       FILE UPLOAD
    ========================================== */

    if(uploadInput){

        uploadInput.addEventListener("change",()=>{

            if(uploadInput.files.length){

                uploadText.textContent =
                    uploadInput.files[0].name;

            }

            else{

                uploadText.textContent =
                    "Choose Assignment";

            }

        });

    }



    /* ==========================================
       SUBMIT MODAL
    ========================================== */

    modalOpenButtons.forEach(btn=>{

        btn.addEventListener("click",()=>{

            modal.classList.add("show");

        });

    });

    if(modalClose){

        modalClose.addEventListener("click",()=>{

            modal.classList.remove("show");

        });

    }

    if(modalOverlay){

        modalOverlay.addEventListener("click",()=>{

            modal.classList.remove("show");

        });

    }



    /* ==========================================
       COUNTDOWN
    ========================================== */

    const countdowns =
        document.querySelectorAll(".countdown");

    countdowns.forEach(item=>{

        const deadline =
            new Date(item.dataset.deadline);

        function update(){

            const now =
                new Date();

            const diff =
                deadline-now;

            if(diff<=0){

                item.innerHTML=
                    "Overdue";

                item.classList.add("danger");

                return;

            }

            const days =
                Math.floor(diff/86400000);

            const hrs =
                Math.floor(diff%86400000/3600000);

            item.innerHTML=
                `${days}d ${hrs}h left`;

        }

        update();

        setInterval(update,60000);

    });



    /* ==========================================
       STATS
    ========================================== */

    function updateStats(){

        const cards =
            [...document.querySelectorAll(".assignment-card")];

        const visible =
            cards.filter(card=>
                card.style.display!=="none");

        document.querySelector("#totalAssignments")
            .innerHTML=visible.length;

        document.querySelector("#pendingAssignments")
            .innerHTML=
            visible.filter(x=>
                x.dataset.status==="pending").length;

        document.querySelector("#submittedAssignments")
            .innerHTML=
            visible.filter(x=>
                x.dataset.status==="submitted").length;

        document.querySelector("#gradedAssignments")
            .innerHTML=
            visible.filter(x=>
                x.dataset.status==="graded").length;

    }

    updateStats();



    /* ==========================================
       PROGRESS BAR
    ========================================== */

    const progress =
        document.querySelectorAll(".progress-fill");

    progress.forEach(bar=>{

        const width =
            bar.dataset.progress;

        bar.style.width="0";

        setTimeout(()=>{

            bar.style.width=
                width+"%";

        },300);

    });



    /* ==========================================
       CARD HOVER
    ========================================== */

    assignments.forEach(card=>{

        card.addEventListener("mouseenter",()=>{

            card.style.transform=
                "translateY(-6px)";

        });

        card.addEventListener("mouseleave",()=>{

            card.style.transform=
                "translateY(0)";

        });

    });



    /* ==========================================
       FADE IN
    ========================================== */

    const observer =
        new IntersectionObserver(entries=>{

            entries.forEach(entry=>{

                if(entry.isIntersecting){

                    entry.target.classList.add("show");

                }

            });

        });

    document.querySelectorAll(".animate").forEach(el=>{

        observer.observe(el);

    });



    /* ==========================================
       AUTO REFRESH CLOCK
    ========================================== */

    const clock =
        document.querySelector("#currentTime");

    if(clock){

        function updateClock(){

            const now = new Date();

            clock.innerHTML =
                now.toLocaleTimeString([],{

                    hour:"2-digit",
                    minute:"2-digit"

                });

        }

        updateClock();

        setInterval(updateClock,1000);

    }



    /* ==========================================
       SUCCESS SUBMIT
    ========================================== */

    const submitForm =
        document.querySelector("#submitAssignment");

    if(submitForm){

        submitForm.addEventListener("submit",(e)=>{

            e.preventDefault();

            modal.classList.remove("show");

            alert(
                "Assignment submitted successfully!"
            );

        });

    }



    /* ==========================================
       WINDOW RESIZE
    ========================================== */

    window.addEventListener("resize",()=>{

        if(window.innerWidth>900){

            closeSidebar();

        }

    });

});
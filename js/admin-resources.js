
"use strict";

/* =========================================================
   JABICO CONSULTANCY
   ADMIN RESOURCES & INFORMATION JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       AUTHENTICATION
    ===================================================== */

    const authenticated =
        localStorage.getItem(
            "jabicoAdminAuthenticated"
        );

    if (authenticated !== "true") {

        window.location.href =
            "admin-login.html";

        return;
    }


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const themeToggle =
        document.getElementById("themeToggle");

    const notificationButton =
        document.getElementById("notificationButton");

    const notificationDropdown =
        document.getElementById("notificationDropdown");

    const profileButton =
        document.getElementById("profileButton");

    const profileDropdown =
        document.getElementById("profileDropdown");

    const contentModal =
        document.getElementById("contentModal");

    const modalClose =
        document.getElementById("modalClose");

    const cancelModal =
        document.getElementById("cancelModal");

    const contentForm =
        document.getElementById("contentForm");

    const contentId =
        document.getElementById("contentId");

    const contentType =
        document.getElementById("contentType");

    const contentTitle =
        document.getElementById("contentTitle");

    const contentCategory =
        document.getElementById("contentCategory");

    const contentDescription =
        document.getElementById("contentDescription");

    const contentFile =
        document.getElementById("contentFile");

    const selectedFileName =
        document.getElementById("selectedFileName");

    const contentAudience =
        document.getElementById("contentAudience");

    const contentStatus =
        document.getElementById("contentStatus");

    const fileField =
        document.getElementById("fileField");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalEyebrow =
        document.getElementById("modalEyebrow");

    const resourceList =
        document.getElementById("resourceList");

    const announcementList =
        document.getElementById("announcementList");

    const resourceSearch =
        document.getElementById("resourceSearch");

    const resourceCount =
        document.getElementById("resourceCount");

    const announcementCount =
        document.getElementById("announcementCount");

    const publishedCount =
        document.getElementById("publishedCount");

    const draftCount =
        document.getElementById("draftCount");


    /* =====================================================
       STATE
    ===================================================== */

    let resources =
        loadStorage(
            "jabico_admin_resources",
            getDemoResources()
        );

    let announcements =
        loadStorage(
            "jabico_admin_announcements",
            getDemoAnnouncements()
        );


    /* =====================================================
       STORAGE
    ===================================================== */

    function loadStorage(key, fallback) {

        try {

            const stored =
                localStorage.getItem(key);

            if (!stored) {

                localStorage.setItem(
                    key,
                    JSON.stringify(fallback)
                );

                return fallback;
            }

            const parsed =
                JSON.parse(stored);

            return Array.isArray(parsed)
                ? parsed
                : fallback;

        } catch (error) {

            console.warn(
                "Storage could not be loaded.",
                error
            );

            return fallback;
        }
    }


    function saveStorage(key, value) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

        } catch (error) {

            console.error(
                "Unable to save data.",
                error
            );

            showToast(
                "Unable to save changes.",
                "error"
            );
        }
    }


    /* =====================================================
       DEMO DATA
    ===================================================== */

    function getDemoResources() {

        return [

            {
                id: "resource-001",
                title: "Digital Marketing Strategy",
                category: "Course Material",
                description:
                    "Learning material for the Digital Marketing Strategy course.",
                fileName:
                    "digital-marketing-strategy.pdf",
                fileType:
                    "pdf",
                audience:
                    "all",
                status:
                    "published",
                date:
                    "2026-09-01T09:00:00"
            },

            {
                id: "resource-002",
                title: "Student Orientation Guide",
                category: "General",
                description:
                    "Important information for students joining the Jabico learning platform.",
                fileName:
                    "student-orientation-guide.pdf",
                fileType:
                    "pdf",
                audience:
                    "current-cohort",
                status:
                    "published",
                date:
                    "2026-08-30T12:00:00"
            }

        ];
    }


    function getDemoAnnouncements() {

        return [

            {
                id: "announcement-001",
                title:
                    "Welcome to the New Jabico Learning Portal",
                category:
                    "Notice",
                description:
                    "Welcome students to the new Jabico learning environment. Please check your resources and upcoming classes regularly.",
                audience:
                    "all",
                status:
                    "published",
                date:
                    "2026-09-01T08:30:00"
            },

            {
                id: "announcement-002",
                title:
                    "September Classes Begin Soon",
                category:
                    "Class Update",
                description:
                    "Students are reminded to check the class schedule before the beginning of the new learning sessions.",
                audience:
                    "current-cohort",
                status:
                    "published",
                date:
                    "2026-08-31T14:00:00"
            }

        ];
    }


    /* =====================================================
       SIDEBAR
    ===================================================== */

    mobileMenuBtn?.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "sidebar-open"
            );

            sidebarOverlay.classList.toggle(
                "active"
            );
        }
    );


    sidebarOverlay?.addEventListener(
        "click",
        closeSidebar
    );


    function closeSidebar() {

        sidebar.classList.remove(
            "sidebar-open"
        );

        sidebarOverlay.classList.remove(
            "active"
        );
    }


    /* =====================================================
       THEME
    ===================================================== */

    const savedTheme =
        localStorage.getItem(
            "jabico_admin_theme"
        );

    if (savedTheme === "dark") {

        document.documentElement.classList.add(
            "dark"
        );

        document.body.classList.add(
            "dark"
        );

        updateThemeIcon(true);

    }


    themeToggle?.addEventListener(
        "click",
        () => {

            const dark =
                document.documentElement.classList.toggle(
                    "dark"
                );

            document.body.classList.toggle(
                "dark",
                dark
            );

            localStorage.setItem(
                "jabico_admin_theme",
                dark
                    ? "dark"
                    : "light"
            );

            updateThemeIcon(dark);
        }
    );


    function updateThemeIcon(dark) {

        const icon =
            themeToggle?.querySelector("i");

        if (!icon) return;

        icon.classList.toggle(
            "fa-moon",
            !dark
        );

        icon.classList.toggle(
            "fa-sun",
            dark
        );
    }


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    notificationButton?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            notificationDropdown.classList.toggle(
                "show"
            );

            profileDropdown?.classList.remove(
                "show"
            );
        }
    );


    /* =====================================================
       PROFILE
    ===================================================== */

    profileButton?.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            profileDropdown.classList.toggle(
                "show"
            );

            notificationDropdown?.classList.remove(
                "show"
            );
        }
    );


    document.addEventListener(
        "click",
        (event) => {

            if (
                notificationDropdown &&
                !notificationDropdown.contains(
                    event.target
                ) &&
                !notificationButton?.contains(
                    event.target
                )
            ) {

                notificationDropdown.classList.remove(
                    "show"
                );
            }


            if (
                profileDropdown &&
                !profileDropdown.contains(
                    event.target
                ) &&
                !profileButton?.contains(
                    event.target
                )
            ) {

                profileDropdown.classList.remove(
                    "show"
                );
            }

        }
    );


    /* =====================================================
       OPEN RESOURCE MODAL
    ===================================================== */

    document.getElementById(
        "uploadButton"
    )?.addEventListener(
        "click",
        () => {

            openModal(
                "resource"
            );

        }
    );


    /* =====================================================
       OPEN ANNOUNCEMENT MODAL
    ===================================================== */

    document.getElementById(
        "newAnnouncementButton"
    )?.addEventListener(
        "click",
        () => {

            openModal(
                "announcement"
            );

        }
    );


    document.getElementById(
        "announcementHeaderButton"
    )?.addEventListener(
        "click",
        () => {

            openModal(
                "announcement"
            );

        }
    );


    /* =====================================================
       OPEN MODAL
    ===================================================== */

    function openModal(
        type,
        item = null
    ) {

        contentModal.classList.add(
            "show"
        );

        document.body.classList.add(
            "overflow-hidden"
        );

        contentType.value =
            type;

        contentId.value =
            item?.id || "";

        contentTitle.value =
            item?.title || "";

        contentCategory.value =
            item?.category || "General";

        contentDescription.value =
            item?.description || "";

        contentAudience.value =
            item?.audience || "all";

        contentStatus.value =
            item?.status || "published";

        selectedFileName.textContent = "";

        selectedFileName.classList.add(
            "hidden"
        );

        if (type === "resource") {

            modalEyebrow.textContent =
                "Learning Material";

            modalTitle.textContent =
                item
                    ? "Edit Resource"
                    : "Upload Resource";

            fileField.classList.remove(
                "hidden"
            );

        } else {

            modalEyebrow.textContent =
                "Student Communication";

            modalTitle.textContent =
                item
                    ? "Edit Announcement"
                    : "Create Announcement";

            fileField.classList.add(
                "hidden"
            );
        }


        setTimeout(
            () => {

                contentTitle.focus();

            },
            100
        );
    }


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeModal() {

        contentModal.classList.remove(
            "show"
        );

        document.body.classList.remove(
            "overflow-hidden"
        );

        contentForm.reset();

        contentId.value = "";

        selectedFileName.classList.add(
            "hidden"
        );

    }


    modalClose?.addEventListener(
        "click",
        closeModal
    );

    cancelModal?.addEventListener(
        "click",
        closeModal
    );


    contentModal?.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                contentModal
            ) {

                closeModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                contentModal.classList.contains(
                    "show"
                )
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       FILE SELECTION
    ===================================================== */

    contentFile?.addEventListener(
        "change",
        () => {

            const file =
                contentFile.files[0];

            if (!file) {

                selectedFileName.classList.add(
                    "hidden"
                );

                return;
            }

            selectedFileName.textContent =
                `Selected: ${file.name}`;

            selectedFileName.classList.remove(
                "hidden"
            );
        }
    );


    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    contentForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const type =
                contentType.value;

            const id =
                contentId.value;

            const title =
                contentTitle.value.trim();

            const category =
                contentCategory.value;

            const description =
                contentDescription.value.trim();

            const audience =
                contentAudience.value;

            const status =
                contentStatus.value;

            if (!title || !description) {

                showToast(
                    "Please complete the required fields.",
                    "warning"
                );

                return;
            }


            if (type === "resource") {

                saveResource(
                    id,
                    title,
                    category,
                    description,
                    audience,
                    status
                );

            } else {

                saveAnnouncement(
                    id,
                    title,
                    category,
                    description,
                    audience,
                    status
                );

            }

            closeModal();

        }
    );


    /* =====================================================
       SAVE RESOURCE
    ===================================================== */

    function saveResource(
        id,
        title,
        category,
        description,
        audience,
        status
    ) {

        const selectedFile =
            contentFile?.files[0];


        if (id) {

            const index =
                resources.findIndex(
                    item =>
                        item.id === id
                );

            if (index === -1) return;


            const existing =
                resources[index];

            resources[index] = {

                ...existing,

                title,

                category,

                description,

                audience,

                status,

                date:
                    existing.date

            };


            if (selectedFile) {

                resources[index].fileName =
                    selectedFile.name;

                resources[index].fileType =
                    getFileType(
                        selectedFile.name
                    );
            }


            showToast(
                "Resource updated successfully.",
                "success"
            );

        } else {

            const resource = {

                id:
                    generateId(
                        "resource"
                    ),

                title,

                category,

                description,

                fileName:
                    selectedFile
                        ? selectedFile.name
                        : "Pending upload",

                fileType:
                    selectedFile
                        ? getFileType(
                            selectedFile.name
                        )
                        : "file",

                audience,

                status,

                date:
                    new Date().toISOString()
            };


            resources.unshift(
                resource
            );


            showToast(
                status === "published"
                    ? "Resource published successfully."
                    : "Resource saved as draft.",
                "success"
            );
        }


        saveStorage(
            "jabico_admin_resources",
            resources
        );

        renderEverything();
    }


    /* =====================================================
       SAVE ANNOUNCEMENT
    ===================================================== */

    function saveAnnouncement(
        id,
        title,
        category,
        description,
        audience,
        status
    ) {

        if (id) {

            const index =
                announcements.findIndex(
                    item =>
                        item.id === id
                );

            if (index === -1) return;


            announcements[index] = {

                ...announcements[index],

                title,

                category,

                description,

                audience,

                status
            };


            showToast(
                "Announcement updated successfully.",
                "success"
            );

        } else {

            const announcement = {

                id:
                    generateId(
                        "announcement"
                    ),

                title,

                category,

                description,

                audience,

                status,

                date:
                    new Date().toISOString()
            };


            announcements.unshift(
                announcement
            );


            showToast(
                status === "published"
                    ? "Announcement published successfully."
                    : "Announcement saved as draft.",
                "success"
            );
        }


        saveStorage(
            "jabico_admin_announcements",
            announcements
        );

        renderEverything();
    }


    /* =====================================================
       RENDER EVERYTHING
    ===================================================== */

    function renderEverything() {

        renderResources();

        renderAnnouncements();

        updateStatistics();
    }


    /* =====================================================
       RESOURCE SEARCH
    ===================================================== */

    resourceSearch?.addEventListener(
        "input",
        () => {

            renderResources(
                resourceSearch.value
                    .trim()
                    .toLowerCase()
            );

        }
    );


    /* =====================================================
       RENDER RESOURCES
    ===================================================== */

    function renderResources(
        query = ""
    ) {

        const filtered =
            resources.filter(
                resource => {

                    const searchable =
                        (
                            resource.title +
                            " " +
                            resource.category +
                            " " +
                            resource.description +
                            " " +
                            resource.fileName
                        ).toLowerCase();

                    return searchable.includes(
                        query
                    );
                }
            );


        if (!filtered.length) {

            resourceList.innerHTML =
                emptyState(
                    "fa-folder-open",
                    "No resources found",
                    "Upload your first learning material."
                );

            return;
        }


        resourceList.innerHTML =
            filtered
                .map(
                    resource =>
                        resourceTemplate(
                            resource
                        )
                )
                .join("");
    }


    /* =====================================================
       RESOURCE TEMPLATE
    ===================================================== */

    function resourceTemplate(
        resource
    ) {

        const icon =
            getFileIcon(
                resource.fileType
            );

        const audience =
            getAudienceLabel(
                resource.audience
            );

        const status =
            getStatusBadge(
                resource.status
            );


        return `

            <div
                class="
                    resource-item
                    flex
                    gap-4
                    p-5
                "
            >

                <div
                    class="
                        file-icon
                        ${icon.background}
                        ${icon.color}
                    "
                >

                    <i class="fa-solid ${icon.icon}"></i>

                </div>


                <div class="min-w-0 flex-1">

                    <div
                        class="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                            sm:items-start
                            sm:justify-between
                        "
                    >

                        <div class="min-w-0">

                            <h3
                                class="
                                    truncate
                                    text-sm
                                    font-bold
                                    text-slate-800
                                    dark:text-white
                                "
                            >
                                ${escapeHTML(
                                    resource.title
                                )}
                            </h3>

                            <p
                                class="
                                    mt-1
                                    text-xs
                                    text-slate-400
                                "
                            >
                                ${escapeHTML(
                                    resource.fileName
                                )}
                            </p>

                        </div>


                        ${status}

                    </div>


                    <p
                        class="
                            mt-2
                            line-clamp-2
                            text-xs
                            leading-5
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        ${escapeHTML(
                            resource.description
                        )}
                    </p>


                    <div
                        class="
                            mt-3
                            flex
                            flex-wrap
                            items-center
                            gap-3
                        "
                    >

                        <span
                            class="
                                rounded-lg
                                bg-slate-100
                                px-2
                                py-1
                                text-[10px]
                                font-bold
                                text-slate-500
                                dark:bg-slate-800
                                dark:text-slate-400
                            "
                        >
                            ${escapeHTML(
                                resource.category
                            )}
                        </span>


                        <span
                            class="
                                text-[10px]
                                font-semibold
                                text-slate-400
                            "
                        >
                            <i class="fa-solid fa-users mr-1"></i>
                            ${escapeHTML(
                                audience
                            )}
                        </span>


                        <span
                            class="
                                text-[10px]
                                font-semibold
                                text-slate-400
                            "
                        >
                            ${formatDate(
                                resource.date
                            )}
                        </span>

                    </div>


                    <div
                        class="
                            mt-3
                            flex
                            flex-wrap
                            gap-2
                        "
                    >

                        <button
                            type="button"
                            class="
                                rounded-lg
                                bg-brand-50
                                px-3
                                py-1.5
                                text-[10px]
                                font-bold
                                text-brand-600
                                hover:bg-brand-100
                                dark:bg-brand-500/10
                                dark:text-brand-400
                            "
                            data-edit-resource="${resource.id}"
                        >
                            <i class="fa-solid fa-pen mr-1"></i>
                            Edit
                        </button>


                        <button
                            type="button"
                            class="
                                rounded-lg
                                bg-slate-100
                                px-3
                                py-1.5
                                text-[10px]
                                font-bold
                                text-slate-500
                                hover:bg-slate-200
                                dark:bg-slate-800
                                dark:text-slate-400
                            "
                            data-resource-preview="${resource.id}"
                        >
                            <i class="fa-solid fa-eye mr-1"></i>
                            Preview
                        </button>


                        <button
                            type="button"
                            class="
                                rounded-lg
                                bg-red-50
                                px-3
                                py-1.5
                                text-[10px]
                                font-bold
                                text-red-500
                                hover:bg-red-100
                                dark:bg-red-500/10
                            "
                            data-delete-resource="${resource.id}"
                        >
                            <i class="fa-solid fa-trash mr-1"></i>
                            Delete
                        </button>

                    </div>

                </div>

            </div>

        `;
    }


    /* =====================================================
       RENDER ANNOUNCEMENTS
    ===================================================== */

    function renderAnnouncements() {

        if (!announcements.length) {

            announcementList.innerHTML =
                emptyState(
                    "fa-bullhorn",
                    "No announcements",
                    "Create an announcement for students."
                );

            return;
        }


        announcementList.innerHTML =
            announcements
                .map(
                    announcement =>
                        announcementTemplate(
                            announcement
                        )
                )
                .join("");
    }


    /* =====================================================
       ANNOUNCEMENT TEMPLATE
    ===================================================== */

    function announcementTemplate(
        announcement
    ) {

        const status =
            getStatusBadge(
                announcement.status
            );

        return `

            <div
                class="
                    announcement-item
                    p-5
                "
            >

                <div
                    class="
                        flex
                        items-start
                        gap-3
                    "
                >

                    <div
                        class="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-purple-50
                            text-purple-600
                            dark:bg-purple-500/10
                            dark:text-purple-400
                        "
                    >

                        <i class="fa-solid fa-bullhorn"></i>

                    </div>


                    <div class="min-w-0 flex-1">

                        <div
                            class="
                                flex
                                items-start
                                justify-between
                                gap-2
                            "
                        >

                            <h3
                                class="
                                    text-sm
                                    font-bold
                                    text-slate-800
                                    dark:text-white
                                "
                            >
                                ${escapeHTML(
                                    announcement.title
                                )}
                            </h3>

                            ${status}

                        </div>


                        <p
                            class="
                                mt-2
                                text-xs
                                leading-5
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            ${escapeHTML(
                                announcement.description
                            )}
                        </p>


                        <div
                            class="
                                mt-3
                                flex
                                flex-wrap
                                gap-2
                                text-[10px]
                                font-semibold
                                text-slate-400
                            "
                        >

                            <span>
                                ${escapeHTML(
                                    announcement.category
                                )}
                            </span>

                            <span>•</span>

                            <span>
                                ${getAudienceLabel(
                                    announcement.audience
                                )}
                            </span>

                            <span>•</span>

                            <span>
                                ${formatDate(
                                    announcement.date
                                )}
                            </span>

                        </div>


                        <div
                            class="
                                mt-3
                                flex
                                gap-2
                            "
                        >

                            <button
                                type="button"
                                class="
                                    rounded-lg
                                    bg-purple-50
                                    px-3
                                    py-1.5
                                    text-[10px]
                                    font-bold
                                    text-purple-600
                                    hover:bg-purple-100
                                    dark:bg-purple-500/10
                                    dark:text-purple-400
                                "
                                data-edit-announcement="${announcement.id}"
                            >
                                <i class="fa-solid fa-pen mr-1"></i>
                                Edit
                            </button>


                            <button
                                type="button"
                                class="
                                    rounded-lg
                                    bg-red-50
                                    px-3
                                    py-1.5
                                    text-[10px]
                                    font-bold
                                    text-red-500
                                    hover:bg-red-100
                                    dark:bg-red-500/10
                                "
                                data-delete-announcement="${announcement.id}"
                            >
                                <i class="fa-solid fa-trash mr-1"></i>
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        `;
    }


    /* =====================================================
       EVENT DELEGATION
    ===================================================== */

    document.addEventListener(
        "click",
        (event) => {

            const editResource =
                event.target.closest(
                    "[data-edit-resource]"
                );

            if (editResource) {

                const id =
                    editResource.dataset.editResource;

                const resource =
                    resources.find(
                        item =>
                            item.id === id
                    );

                if (resource) {

                    openModal(
                        "resource",
                        resource
                    );
                }

                return;
            }


            const deleteResource =
                event.target.closest(
                    "[data-delete-resource]"
                );

            if (deleteResource) {

                deleteResourceItem(
                    deleteResource.dataset.deleteResource
                );

                return;
            }


            const previewResource =
                event.target.closest(
                    "[data-resource-preview]"
                );

            if (previewResource) {

                previewResourceItem(
                    previewResource.dataset.resourcePreview
                );

                return;
            }


            const editAnnouncement =
                event.target.closest(
                    "[data-edit-announcement]"
                );

            if (editAnnouncement) {

                const id =
                    editAnnouncement.dataset
                        .editAnnouncement;

                const announcement =
                    announcements.find(
                        item =>
                            item.id === id
                    );

                if (announcement) {

                    openModal(
                        "announcement",
                        announcement
                    );
                }

                return;
            }


            const deleteAnnouncement =
                event.target.closest(
                    "[data-delete-announcement]"
                );

            if (deleteAnnouncement) {

                deleteAnnouncementItem(
                    deleteAnnouncement.dataset
                        .deleteAnnouncement
                );
            }

        }
    );


    /* =====================================================
       DELETE RESOURCE
    ===================================================== */

    function deleteResourceItem(id) {

        const resource =
            resources.find(
                item =>
                    item.id === id
            );

        if (!resource) return;


        const confirmed =
            window.confirm(
                `Delete "${resource.title}"?`
            );

        if (!confirmed) return;


        resources =
            resources.filter(
                item =>
                    item.id !== id
            );


        saveStorage(
            "jabico_admin_resources",
            resources
        );

        renderEverything();

        showToast(
            "Resource deleted.",
            "success"
        );
    }


    /* =====================================================
       DELETE ANNOUNCEMENT
    ===================================================== */

    function deleteAnnouncementItem(id) {

        const announcement =
            announcements.find(
                item =>
                    item.id === id
            );

        if (!announcement) return;


        const confirmed =
            window.confirm(
                `Delete "${announcement.title}"?`
            );

        if (!confirmed) return;


        announcements =
            announcements.filter(
                item =>
                    item.id !== id
            );


        saveStorage(
            "jabico_admin_announcements",
            announcements
        );

        renderEverything();

        showToast(
            "Announcement deleted.",
            "success"
        );
    }


    /* =====================================================
       RESOURCE PREVIEW
    ===================================================== */

    function previewResourceItem(id) {

        const resource =
            resources.find(
                item =>
                    item.id === id
            );

        if (!resource) return;


        showToast(
            `Preview selected: ${resource.fileName}`,
            "info"
        );

        /*
         * BACKEND INTEGRATION POINT
         *
         * Later replace this with:
         *
         * window.open(resource.fileUrl, "_blank");
         *
         * The backend should return the real
         * uploaded file URL.
         */
    }


    /* =====================================================
       STATISTICS
    ===================================================== */

    function updateStatistics() {

        const publishedResources =
            resources.filter(
                item =>
                    item.status === "published"
            );

        const publishedAnnouncements =
            announcements.filter(
                item =>
                    item.status === "published"
            );

        const drafts =
            [
                ...resources,
                ...announcements
            ].filter(
                item =>
                    item.status === "draft"
            );


        resourceCount.textContent =
            resources.length;

        announcementCount.textContent =
            announcements.length;

        publishedCount.textContent =
            publishedResources.length +
            publishedAnnouncements.length;

        draftCount.textContent =
            drafts.length;
    }


    /* =====================================================
       FILE TYPE
    ===================================================== */

    function getFileType(
        filename
    ) {

        const extension =
            filename
                .split(".")
                .pop()
                .toLowerCase();

        return extension;
    }


    /* =====================================================
       FILE ICON
    ===================================================== */

    function getFileIcon(
        type
    ) {

        switch (type) {

            case "pdf":

                return {
                    icon:
                        "fa-file-pdf",
                    background:
                        "bg-red-50 dark:bg-red-500/10",
                    color:
                        "text-red-600 dark:text-red-400"
                };


            case "doc":
            case "docx":

                return {
                    icon:
                        "fa-file-word",
                    background:
                        "bg-blue-50 dark:bg-blue-500/10",
                    color:
                        "text-blue-600 dark:text-blue-400"
                };


            case "ppt":
            case "pptx":

                return {
                    icon:
                        "fa-file-powerpoint",
                    background:
                        "bg-orange-50 dark:bg-orange-500/10",
                    color:
                        "text-orange-600 dark:text-orange-400"
                };


            case "jpg":
            case "jpeg":
            case "png":
            case "webp":

                return {
                    icon:
                        "fa-file-image",
                    background:
                        "bg-purple-50 dark:bg-purple-500/10",
                    color:
                        "text-purple-600 dark:text-purple-400"
                };


            default:

                return {
                    icon:
                        "fa-file",
                    background:
                        "bg-slate-100 dark:bg-slate-800",
                    color:
                        "text-slate-500 dark:text-slate-400"
                };
        }
    }


    /* =====================================================
       STATUS BADGE
    ===================================================== */

    function getStatusBadge(
        status
    ) {

        if (status === "published") {

            return `
                <span
                    class="
                        shrink-0
                        rounded-lg
                        bg-emerald-50
                        px-2
                        py-1
                        text-[9px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-emerald-600
                        dark:bg-emerald-500/10
                        dark:text-emerald-400
                    "
                >
                    Published
                </span>
            `;
        }


        return `
            <span
                class="
                    shrink-0
                    rounded-lg
                    bg-orange-50
                    px-2
                    py-1
                    text-[9px]
                    font-extrabold
                    uppercase
                    tracking-wider
                    text-orange-600
                    dark:bg-orange-500/10
                    dark:text-orange-400
                "
            >
                Draft
            </span>
        `;
    }


    /* =====================================================
       AUDIENCE LABEL
    ===================================================== */

    function getAudienceLabel(
        audience
    ) {

        const labels = {

            all:
                "All Students",

            "digital-marketing":
                "Digital Marketing",

            "current-cohort":
                "Current Cohort",

            "specific-class":
                "Specific Class"
        };

        return labels[audience]
            || "All Students";
    }


    /* =====================================================
       DATE FORMAT
    ===================================================== */

    function formatDate(
        date
    ) {

        try {

            return new Date(
                date
            ).toLocaleDateString(
                [],
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        } catch {

            return "Recently";
        }
    }


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    function emptyState(
        icon,
        title,
        description
    ) {

        return `

            <div class="empty-state">

                <div class="empty-state-icon">

                    <i class="fa-solid ${icon}"></i>

                </div>

                <h3
                    class="
                        mt-4
                        text-sm
                        font-bold
                        text-slate-700
                        dark:text-white
                    "
                >
                    ${title}
                </h3>

                <p
                    class="
                        mx-auto
                        mt-1
                        max-w-xs
                        text-xs
                        leading-5
                        text-slate-400
                    "
                >
                    ${description}
                </p>

            </div>

        `;
    }


    /* =====================================================
       ID GENERATOR
    ===================================================== */

    function generateId(
        prefix
    ) {

        return (
            prefix +
            "-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2, 8)
        );
    }


    /* =====================================================
       HTML ESCAPING
    ===================================================== */

    function escapeHTML(
        value
    ) {

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            String(value);

        return div.innerHTML;
    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(
        message,
        type = "info",
        duration = 3500
    ) {

        const container =
            document.getElementById(
                "toastContainer"
            );

        if (!container) return;


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            `admin-toast toast-${type}`;


        const icons = {

            success:
                "fa-circle-check",

            error:
                "fa-circle-xmark",

            warning:
                "fa-triangle-exclamation",

            info:
                "fa-circle-info"
        };


        toast.innerHTML = `

            <div class="toast-icon">

                <i
                    class="
                        fa-solid
                        ${icons[type] || icons.info}
                    "
                ></i>

            </div>


            <div class="toast-message">

                ${escapeHTML(message)}

            </div>


            <button
                type="button"
                class="toast-close"
                aria-label="Close"
            >

                <i class="fa-solid fa-xmark"></i>

            </button>

        `;


        container.appendChild(
            toast
        );


        requestAnimationFrame(
            () => {

                toast.classList.add(
                    "show"
                );

            }
        );


        const close =
            () => {

                toast.classList.remove(
                    "show"
                );

                setTimeout(
                    () => {

                        toast.remove();

                    },
                    250
                );
            };


        toast.querySelector(
            ".toast-close"
        )?.addEventListener(
            "click",
            close
        );


        setTimeout(
            close,
            duration
        );
    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    function logout() {

        const confirmed =
            window.confirm(
                "Are you sure you want to logout?"
            );

        if (!confirmed) return;


        localStorage.removeItem(
            "jabicoAdminAuthenticated"
        );

        sessionStorage.removeItem(
            "jabico_admin_session"
        );


        window.location.href =
            "login.html";
    }


    document.getElementById(
        "logoutButton"
    )?.addEventListener(
        "click",
        logout
    );


    document.getElementById(
        "dropdownLogout"
    )?.addEventListener(
        "click",
        logout
    );


    /* =====================================================
       INITIAL RENDER
    ===================================================== */

    renderEverything();


    /* =====================================================
       BACKEND API HOOKS
    ===================================================== */

    window.JabicoResources = {

        getResources() {

            return resources;
        },

        getAnnouncements() {

            return announcements;
        },

        refresh() {

            renderEverything();
        },

        async uploadResource(
            formData
        ) {

            /*
             * BACKEND INTEGRATION POINT
             *
             * Example:
             *
             * const response =
             *     await fetch(
             *         "/api/admin/resources",
             *         {
             *             method: "POST",
             *             body: formData
             *         }
             *     );
             *
             * return response.json();
             */

            console.info(
                "Resource upload API hook ready."
            );
        },

        async publishAnnouncement(
            data
        ) {

            /*
             * BACKEND INTEGRATION POINT
             *
             * Example:
             *
             * await fetch(
             *     "/api/admin/announcements",
             *     {
             *         method: "POST",
             *         headers: {
             *             "Content-Type":
             *                 "application/json"
             *         },
             *         body:
             *             JSON.stringify(data)
             *     }
             * );
             */

            console.info(
                "Announcement API hook ready."
            );
        }

    };


    console.log(
        "Jabico Admin Resources initialized."
    );

});
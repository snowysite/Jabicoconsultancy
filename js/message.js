document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =====================================================
       ELEMENTS
    ====================================================== */

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

    const messageSearch =
        document.getElementById("messageSearch");

    const conversationList =
        document.getElementById("conversationList");

    const conversations =
        document.querySelectorAll(".conversation");

    const conversationEmpty =
        document.getElementById("conversationEmpty");

    const filterButtons =
        document.querySelectorAll(".conversation-filter-btn");

    const chatPanel =
        document.querySelector(".chat-panel");

    const conversationPanel =
        document.querySelector(".conversation-panel");

    const chatMessages =
        document.getElementById("chatMessages");

    const chatName =
        document.getElementById("chatName");

    const chatAvatar =
        document.getElementById("chatAvatar");

    const chatStatus =
        document.getElementById("chatStatus");

    const chatOnlineDot =
        document.getElementById("chatOnlineDot");

    const messageInput =
        document.getElementById("messageInput");

    const sendMessageBtn =
        document.getElementById("sendMessageBtn");

    const attachmentBtn =
        document.getElementById("attachmentBtn");

    const attachmentInput =
        document.getElementById("attachmentInput");

    const attachmentPreview =
        document.getElementById("attachmentPreview");

    const emojiBtn =
        document.getElementById("emojiBtn");

    const typingIndicator =
        document.getElementById("typingIndicator");

    const chatSearchBtn =
        document.getElementById("chatSearchBtn");

    const chatSearchBar =
        document.getElementById("chatSearchBar");

    const chatSearchInput =
        document.getElementById("chatSearchInput");

    const closeChatSearch =
        document.getElementById("closeChatSearch");

    const newMessageBtn =
        document.getElementById("newMessageBtn");

    const composeBtn =
        document.getElementById("composeBtn");

    const messageModal =
        document.getElementById("messageModal");

    const closeMessageModal =
        document.getElementById("closeMessageModal");

    const cancelMessageBtn =
        document.getElementById("cancelMessageBtn");

    const newMessageForm =
        document.getElementById("newMessageForm");

    const recipient =
        document.getElementById("recipient");

    const newMessageText =
        document.getElementById("newMessageText");

    const messageToast =
        document.getElementById("messageToast");

    const globalSearch =
        document.getElementById("globalSearch");

    const themeToggle =
        document.getElementById("themeToggle");


    /* =====================================================
       CONVERSATION DATA
    ====================================================== */

    const conversationData = {

        sarah: {
            name: "Sarah Williams",
            avatar: "https://i.pravatar.cc/100?img=47",
            status: "Online",
            online: true
        },

        michael: {
            name: "Michael Adams",
            avatar: "https://i.pravatar.cc/100?img=11",
            status: "Last seen yesterday",
            online: false
        },

        mentor: {
            name: "David Johnson",
            avatar: "https://i.pravatar.cc/100?img=68",
            status: "Online",
            online: true
        },

        cohort: {
            name: "Cohort Group",
            avatar: "",
            status: "8 members",
            online: false
        }

    };


    /* =====================================================
       SIDEBAR
    ====================================================== */

    function openSidebar() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.add("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }

        document.body.style.overflow = "hidden";
    }


    function closeSidebar() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.remove("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }

        document.body.style.overflow = "";
    }


    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener(
            "click",
            function () {

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
    ====================================================== */

    if (notificationBtn && notificationDropdown) {

        notificationBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                notificationDropdown.classList.toggle("show");

            }
        );

    }


    document.addEventListener(
        "click",
        function (event) {

            if (
                notificationDropdown &&
                notificationDropdown.classList.contains("show") &&
                !notificationDropdown.contains(event.target) &&
                !notificationBtn.contains(event.target)
            ) {

                notificationDropdown.classList.remove("show");

            }

        }
    );


    /* =====================================================
       UPDATE CHAT HEADER
    ====================================================== */

    function updateChatHeader(id) {

        const data =
            conversationData[id];

        if (!data) {
            return;
        }

        if (chatName) {
            chatName.textContent = data.name;
        }

        if (chatAvatar && data.avatar) {
            chatAvatar.src = data.avatar;
            chatAvatar.alt = data.name;
        }

        if (chatStatus) {
            chatStatus.textContent = data.status;

            chatStatus.style.color =
                data.online
                    ? "var(--messages-green)"
                    : "var(--messages-text-muted)";
        }

        if (chatOnlineDot) {

            chatOnlineDot.style.display =
                data.online
                    ? "block"
                    : "none";

        }

    }


    /* =====================================================
       SELECT CONVERSATION
    ====================================================== */

    function selectConversation(conversation) {

        conversations.forEach(function (item) {
            item.classList.remove("active");
        });

        conversation.classList.add("active");

        conversation.classList.remove("unread");

        const unread =
            conversation.querySelector(".unread-count");

        if (unread) {
            unread.remove();
        }

        const id =
            conversation.dataset.id;

        updateChatHeader(id);

        if (window.innerWidth <= 768) {

            if (conversationPanel) {
                conversationPanel.classList.add(
                    "mobile-hidden"
                );
            }

            if (chatPanel) {
                chatPanel.classList.add(
                    "mobile-open"
                );
            }

        }

        scrollChatToBottom();

    }


    conversations.forEach(function (conversation) {

        conversation.addEventListener(
            "click",
            function () {

                selectConversation(conversation);

            }
        );

    });


    /* =====================================================
       CONVERSATION SEARCH
    ====================================================== */

    function filterConversations() {

        const searchTerm =
            messageSearch
                ? messageSearch.value
                    .trim()
                    .toLowerCase()
                : "";

        let visibleCount = 0;

        conversations.forEach(function (conversation) {

            const text =
                conversation.textContent
                    .toLowerCase();

            const matches =
                text.includes(searchTerm);

            if (matches) {

                conversation.classList.remove(
                    "hidden"
                );

                visibleCount++;

            } else {

                conversation.classList.add(
                    "hidden"
                );

            }

        });

        if (conversationEmpty) {

            conversationEmpty.classList.toggle(
                "show",
                visibleCount === 0
            );

        }

    }


    if (messageSearch) {

        messageSearch.addEventListener(
            "input",
            filterConversations
        );

    }


    /* =====================================================
       CONVERSATION FILTERS
    ====================================================== */

    filterButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(function (item) {
                    item.classList.remove("active");
                });

                button.classList.add("active");

                const filter =
                    button.dataset.filter;

                let visibleCount = 0;

                conversations.forEach(function (conversation) {

                    let show = true;

                    if (filter === "unread") {

                        show =
                            conversation.classList.contains(
                                "unread"
                            );

                    }

                    if (filter === "important") {

                        show =
                            conversation.classList.contains(
                                "important"
                            );

                    }

                    if (show) {

                        conversation.classList.remove(
                            "hidden"
                        );

                        visibleCount++;

                    } else {

                        conversation.classList.add(
                            "hidden"
                        );

                    }

                });

                if (conversationEmpty) {

                    conversationEmpty.classList.toggle(
                        "show",
                        visibleCount === 0
                    );

                }

            }
        );

    });


    /* =====================================================
       CHAT SEARCH
    ====================================================== */

    if (chatSearchBtn && chatSearchBar) {

        chatSearchBtn.addEventListener(
            "click",
            function () {

                chatSearchBar.classList.add("show");

                if (chatSearchInput) {
                    chatSearchInput.focus();
                }

            }
        );

    }


    if (closeChatSearch && chatSearchBar) {

        closeChatSearch.addEventListener(
            "click",
            function () {

                chatSearchBar.classList.remove("show");

                if (chatSearchInput) {
                    chatSearchInput.value = "";

                    highlightMessages("");
                }

            }
        );

    }


    function highlightMessages(searchTerm) {

        const messageBubbles =
            document.querySelectorAll(
                ".message-bubble"
            );

        const term =
            searchTerm.trim().toLowerCase();

        messageBubbles.forEach(function (bubble) {

            const originalText =
                bubble.dataset.originalText ||
                bubble.textContent;

            bubble.dataset.originalText =
                originalText;

            if (!term) {

                bubble.textContent =
                    originalText;

                return;

            }

            const lower =
                originalText.toLowerCase();

            const index =
                lower.indexOf(term);

            if (index === -1) {

                bubble.textContent =
                    originalText;

                return;

            }

            const before =
                originalText.slice(0, index);

            const match =
                originalText.slice(
                    index,
                    index + term.length
                );

            const after =
                originalText.slice(
                    index + term.length
                );

            bubble.innerHTML =
                before +
                "<mark>" +
                match +
                "</mark>" +
                after;

        });

    }


    if (chatSearchInput) {

        chatSearchInput.addEventListener(
            "input",
            function () {

                highlightMessages(
                    chatSearchInput.value
                );

            }
        );

    }


    /* =====================================================
       SCROLL CHAT
    ====================================================== */

    function scrollChatToBottom() {

        if (!chatMessages) {
            return;
        }

        requestAnimationFrame(function () {

            chatMessages.scrollTop =
                chatMessages.scrollHeight;

        });

    }


    scrollChatToBottom();


    /* =====================================================
       TEXTAREA AUTO RESIZE
    ====================================================== */

    if (messageInput) {

        messageInput.addEventListener(
            "input",
            function () {

                messageInput.style.height =
                    "auto";

                messageInput.style.height =
                    Math.min(
                        messageInput.scrollHeight,
                        100
                    ) + "px";

            }
        );

    }


    /* =====================================================
       SEND MESSAGE
    ====================================================== */

    function sendMessage() {

        if (!messageInput || !chatMessages) {
            return;
        }

        const text =
            messageInput.value.trim();

        if (!text) {
            return;
        }

        const message =
            document.createElement("div");

        message.className =
            "message sent";

        const safeText =
            text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

        message.innerHTML = `
            <div class="message-body">
                <div class="message-bubble">
                    ${safeText}
                </div>

                <time>
                    Just now
                    <i class="fas fa-check-double"></i>
                </time>
            </div>
        `;

        if (typingIndicator) {
            chatMessages.insertBefore(
                message,
                typingIndicator
            );
        } else {
            chatMessages.appendChild(message);
        }

        messageInput.value = "";

        messageInput.style.height =
            "auto";

        scrollChatToBottom();

        showToast(
            "Message Sent",
            "Your message has been sent successfully."
        );

        simulateReply();

    }


    if (sendMessageBtn) {

        sendMessageBtn.addEventListener(
            "click",
            sendMessage
        );

    }


    if (messageInput) {

        messageInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();

                }

            }
        );

    }


    /* =====================================================
       SIMULATE REPLY
    ====================================================== */

    let replyTimeout = null;

    function simulateReply() {

        if (!typingIndicator || !chatMessages) {
            return;
        }

        if (replyTimeout) {
            clearTimeout(replyTimeout);
        }

        typingIndicator.classList.add("show");

        scrollChatToBottom();

        replyTimeout =
            setTimeout(function () {

                typingIndicator.classList.remove(
                    "show"
                );

                const reply =
                    document.createElement("div");

                reply.className =
                    "message received";

                reply.innerHTML = `
                    <div class="message-avatar">
                        <img
                            src="${chatAvatar.src}"
                            alt="${chatName.textContent}"
                        >
                    </div>

                    <div class="message-body">

                        <div class="message-bubble">
                            Sounds good! 👍 Let me know when
                            you're ready and we can review it together.
                        </div>

                        <time>
                            Just now
                        </time>

                    </div>
                `;

                chatMessages.insertBefore(
                    reply,
                    typingIndicator
                );

                scrollChatToBottom();

            }, 1800);

    }


    /* =====================================================
       ATTACHMENT
    ====================================================== */

    if (attachmentBtn && attachmentInput) {

        attachmentBtn.addEventListener(
            "click",
            function () {

                attachmentInput.click();

            }
        );

    }


    if (attachmentInput) {

        attachmentInput.addEventListener(
            "change",
            function () {

                const file =
                    attachmentInput.files[0];

                if (!file || !attachmentPreview) {
                    return;
                }

                attachmentPreview.classList.add(
                    "show"
                );

                attachmentPreview.innerHTML = `
                    <div class="attachment-item">

                        <i class="fas fa-file"></i>

                        <span>
                            ${file.name}
                        </span>

                        <button
                            type="button"
                            class="remove-attachment"
                            id="removeAttachment"
                            aria-label="Remove attachment"
                        >
                            <i class="fas fa-xmark"></i>
                        </button>

                    </div>
                `;

                const removeAttachment =
                    document.getElementById(
                        "removeAttachment"
                    );

                if (removeAttachment) {

                    removeAttachment.addEventListener(
                        "click",
                        function () {

                            attachmentInput.value = "";

                            attachmentPreview.classList.remove(
                                "show"
                            );

                            attachmentPreview.innerHTML =
                                "";

                        }
                    );

                }

            }
        );

    }


    /* =====================================================
       EMOJI
    ====================================================== */

    if (emojiBtn && messageInput) {

        emojiBtn.addEventListener(
            "click",
            function () {

                const emoji = "😊";

                messageInput.value +=
                    emoji;

                messageInput.focus();

            }
        );

    }


    /* =====================================================
       NEW MESSAGE MODAL
    ====================================================== */

    function openMessageModal() {

        if (!messageModal) {
            return;
        }

        messageModal.classList.add("show");

        document.body.style.overflow =
            "hidden";

        if (recipient) {
            recipient.focus();
        }

    }


    function closeMessageModalHandler() {

        if (!messageModal) {
            return;
        }

        messageModal.classList.remove("show");

        document.body.style.overflow =
            "";

        if (newMessageForm) {
            newMessageForm.reset();
        }

    }


    if (newMessageBtn) {

        newMessageBtn.addEventListener(
            "click",
            openMessageModal
        );

    }


    if (composeBtn) {

        composeBtn.addEventListener(
            "click",
            openMessageModal
        );

    }


    if (closeMessageModal) {

        closeMessageModal.addEventListener(
            "click",
            closeMessageModalHandler
        );

    }


    if (cancelMessageBtn) {

        cancelMessageBtn.addEventListener(
            "click",
            closeMessageModalHandler
        );

    }


    if (messageModal) {

        messageModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    messageModal
                ) {

                    closeMessageModalHandler();

                }

            }
        );

    }


    /* =====================================================
       NEW MESSAGE FORM
    ====================================================== */

    if (newMessageForm) {

        newMessageForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                if (
                    !recipient ||
                    !newMessageText
                ) {
                    return;
                }

                const recipientId =
                    recipient.value;

                const text =
                    newMessageText.value.trim();

                if (!recipientId || !text) {
                    return;
                }

                const selectedConversation =
                    Array.from(
                        conversations
                    ).find(function (conversation) {

                        return (
                            conversation.dataset.id ===
                            recipientId
                        );

                    });

                closeMessageModalHandler();

                if (selectedConversation) {

                    selectConversation(
                        selectedConversation
                    );

                    setTimeout(function () {

                        if (messageInput) {

                            messageInput.value =
                                text;

                            sendMessage();

                        }

                    }, 250);

                } else {

                    showToast(
                        "Message Sent",
                        "Your message has been sent successfully."
                    );

                }

            }
        );

    }


    /* =====================================================
       TOAST
    ====================================================== */

    let toastTimeout = null;

    function showToast(title, text) {

        if (!messageToast) {
            return;
        }

        const strong =
            messageToast.querySelector(
                "strong"
            );

        const paragraph =
            messageToast.querySelector(
                "p"
            );

        if (strong) {
            strong.textContent = title;
        }

        if (paragraph) {
            paragraph.textContent = text;
        }

        messageToast.classList.add("show");

        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        toastTimeout =
            setTimeout(function () {

                messageToast.classList.remove(
                    "show"
                );

            }, 3000);

    }


    /* =====================================================
       GLOBAL SEARCH
    ====================================================== */

    if (globalSearch) {

        globalSearch.addEventListener(
            "input",
            function () {

                const term =
                    globalSearch.value
                        .trim()
                        .toLowerCase();

                if (messageSearch) {
                    messageSearch.value =
                        term;
                }

                filterConversations();

            }
        );

    }


    /* =====================================================
       MOBILE CHAT BACK BUTTON
    ====================================================== */

    function addMobileBackButton() {

        if (!chatPanel) {
            return;
        }

        const chatHeader =
            chatPanel.querySelector(
                ".chat-header"
            );

        if (!chatHeader) {
            return;
        }

        if (
            chatHeader.querySelector(
                ".chat-back-btn"
            )
        ) {
            return;
        }

        const backButton =
            document.createElement("button");

        backButton.type =
            "button";

        backButton.className =
            "chat-icon-btn chat-back-btn";

        backButton.setAttribute(
            "aria-label",
            "Back to conversations"
        );

        backButton.innerHTML =
            '<i class="fas fa-arrow-left"></i>';

        backButton.addEventListener(
            "click",
            function () {

                chatPanel.classList.remove(
                    "mobile-open"
                );

                if (conversationPanel) {
                    conversationPanel.classList.remove(
                        "mobile-hidden"
                    );
                }

            }
        );

        chatHeader
            .querySelector(".chat-user")
            .before(backButton);

    }


    addMobileBackButton();


    document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const dashboard = document.querySelector(".dashboard");

    if (!sidebar || !dashboard) {
        return;
    }

    setTimeout(() => {
        sidebar.classList.add("sidebar-hide");
        dashboard.classList.add("sidebar-hidden");
    }, 1200);
});
    /* =====================================================
       RESIZE
    ====================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 768) {

                if (conversationPanel) {
                    conversationPanel.classList.remove(
                        "mobile-hidden"
                    );
                }

                if (chatPanel) {
                    chatPanel.classList.remove(
                        "mobile-open"
                    );
                }

            }

        }
    );


    /* =====================================================
       THEME TOGGLE
    ====================================================== */

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "dark-mode"
                );

                const icon =
                    themeToggle.querySelector("i");

                if (!icon) {
                    return;
                }

                if (
                    document.body.classList.contains(
                        "dark-mode"
                    )
                ) {

                    icon.classList.remove(
                        "fa-moon"
                    );

                    icon.classList.add(
                        "fa-sun"
                    );

                } else {

                    icon.classList.remove(
                        "fa-sun"
                    );

                    icon.classList.add(
                        "fa-moon"
                    );

                }

            }
        );

    }


    /* =====================================================
       ESCAPE KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }

            if (
                messageModal &&
                messageModal.classList.contains("show")
            ) {

                closeMessageModalHandler();

            }

            if (
                notificationDropdown &&
                notificationDropdown.classList.contains("show")
            ) {

                notificationDropdown.classList.remove(
                    "show"
                );

            }

            if (
                chatSearchBar &&
                chatSearchBar.classList.contains("show")
            ) {

                chatSearchBar.classList.remove(
                    "show"
                );

            }

        }
    );


    /* =====================================================
       INITIAL STATE
    ====================================================== */

    const firstConversation =
        document.querySelector(
            ".conversation.active"
        );

    if (firstConversation) {
        updateChatHeader(
            firstConversation.dataset.id
        );
    }

    scrollChatToBottom();

});
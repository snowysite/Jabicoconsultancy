/* =========================================================
   JABICO CONSULTANCY
   ADMIN PORTAL - BACKEND LOGIN
========================================================= */

"use strict";

const ADMIN_TOKEN_KEY = "jabicoAdminToken";

function setLoading(button, content, loading) {
    if (!button || !content) return;
    button.disabled = loading;
    content.innerHTML = loading
        ? '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...'
        : '<span>Sign In</span><i class="fa-solid fa-arrow-right"></i>';
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("adminLoginForm");
    if (!form) return;

    const emailInput = document.getElementById("adminEmail");
    const passwordInput = document.getElementById("adminPassword");
    const rememberMe = document.getElementById("rememberMe");
    const passwordToggle = document.getElementById("passwordToggle");
    const loginButton = document.getElementById("adminLoginButton");
    const buttonContent = document.getElementById("buttonContent");
    const loginMessage = document.getElementById("loginMessage");
    const messageText = document.getElementById("messageText");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const forgotPassword = document.getElementById("forgotPassword");
    const forgotModal = document.getElementById("forgotModal");
    const modalClose = document.getElementById("modalClose");
    const modalOkay = document.getElementById("modalOkay");
    const currentYear = document.getElementById("currentYear");

    if (currentYear) currentYear.textContent = new Date().getFullYear();

    const rememberedEmail = localStorage.getItem("jabicoAdminRememberedEmail");
    if (rememberedEmail && emailInput && rememberMe) {
        emailInput.value = rememberedEmail;
        rememberMe.checked = true;
    }

    function showMessage(message, type) {
        if (!loginMessage || !messageText) return;
        messageText.textContent = message;
        loginMessage.className = `login-message ${type}`;
        loginMessage.hidden = false;
    }

    function hideMessage() {
        if (loginMessage) loginMessage.hidden = true;
    }

    function clearErrors() {
        if (emailError) emailError.textContent = "";
        if (passwordError) passwordError.textContent = "";
        emailInput?.closest(".input-wrapper")?.classList.remove("has-error");
        passwordInput?.closest(".input-wrapper")?.classList.remove("has-error");
    }

    function validateForm() {
        clearErrors();
        let valid = true;
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email) {
            emailError.textContent = "Please enter your email address.";
            emailInput.closest(".input-wrapper")?.classList.add("has-error");
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError.textContent = "Please enter a valid email address.";
            emailInput.closest(".input-wrapper")?.classList.add("has-error");
            valid = false;
        }

        if (!password) {
            passwordError.textContent = "Please enter your password.";
            passwordInput.closest(".input-wrapper")?.classList.add("has-error");
            valid = false;
        }
        return valid;
    }

    function handleRememberMe(email) {
        if (!rememberMe) return;
        if (rememberMe.checked) localStorage.setItem("jabicoAdminRememberedEmail", email);
        else localStorage.removeItem("jabicoAdminRememberedEmail");
    }

    passwordToggle?.addEventListener("click", () => {
        const show = passwordInput.type === "password";
        passwordInput.type = show ? "text" : "password";
        passwordToggle.innerHTML = show
            ? '<i class="fa-solid fa-eye-slash"></i>'
            : '<i class="fa-solid fa-eye"></i>';
        passwordToggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideMessage();
        if (!validateForm()) return;

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        setLoading(loginButton, buttonContent, true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.success || !data.token) {
                throw new Error(data.message || "Unable to sign in.");
            }

            handleRememberMe(email);
            sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
            sessionStorage.setItem("jabicoAdminAuthenticated", "true");
            sessionStorage.setItem("jabicoAdminEmail", data.admin?.email || email);
            sessionStorage.setItem("jabicoAdminName", data.admin?.name || "Administrator");

            // Warm the local dashboard cache from the real backend so the
            // existing dashboard immediately shows the same application data.
            try {
                const applicationsResponse = await fetch(`${API_BASE_URL}/api/admin/applications?status=all&sort=latest`, {
                    headers: { Authorization: `Bearer ${data.token}` }
                });
                const applicationsData = await applicationsResponse.json().catch(() => ({}));
                if (applicationsResponse.ok && applicationsData.success && Array.isArray(applicationsData.applications)) {
                    localStorage.setItem("jabicoStudents", JSON.stringify(applicationsData.applications));
                }
            } catch (cacheError) {
                console.warn("Could not warm the dashboard application cache:", cacheError);
            }

            showMessage("Login successful. Opening admin dashboard...", "success");
            setTimeout(() => { window.location.href = "admin-dashboard.html"; }, 500);
        } catch (error) {
            console.error("Admin login error:", error);
            setLoading(loginButton, buttonContent, false);
            showMessage(
                error.message === "Failed to fetch"
                    ? "Cannot connect to the Jabico server. Make sure the backend is running on port 4000."
                    : error.message,
                "error"
            );
            passwordInput.value = "";
            passwordInput.focus();
        }
    });

    emailInput?.addEventListener("input", () => {
        emailError.textContent = "";
        emailInput.closest(".input-wrapper")?.classList.remove("has-error");
        hideMessage();
    });

    passwordInput?.addEventListener("input", () => {
        passwordError.textContent = "";
        passwordInput.closest(".input-wrapper")?.classList.remove("has-error");
        hideMessage();
    });

    function openForgotModal() {
        if (!forgotModal) return;
        forgotModal.classList.add("show");
        forgotModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeForgotModal() {
        if (!forgotModal) return;
        forgotModal.classList.remove("show");
        forgotModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    forgotPassword?.addEventListener("click", openForgotModal);
    modalClose?.addEventListener("click", closeForgotModal);
    modalOkay?.addEventListener("click", closeForgotModal);
    forgotModal?.addEventListener("click", event => {
        if (event.target === forgotModal) closeForgotModal();
    });
});

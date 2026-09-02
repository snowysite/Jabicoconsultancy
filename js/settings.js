/* =========================================================
   JABICO COHORT PORTAL
   SETTINGS JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   DOM HELPERS
========================================================= */

const getElement = (id) => {
    return document.getElementById(id);
};


/* =========================================================
   ELEMENTS
========================================================= */

const settingsNavItems =
    document.querySelectorAll(".settings-nav-item");

const settingsSections =
    document.querySelectorAll(".settings-section");

const saveSettingsBtn =
    getElement("saveSettingsBtn");

const resetSettingsBtn =
    getElement("resetSettingsBtn");

const accountForm =
    getElement("accountForm");

const changePasswordBtn =
    getElement("changePasswordBtn");

const passwordModal =
    getElement("passwordModal");

const closePasswordModal =
    getElement("closePasswordModal");

const cancelPasswordBtn =
    getElement("cancelPasswordBtn");

const passwordForm =
    getElement("passwordForm");

const closeToast =
    getElement("closeToast");

const successToast =
    getElement("successToast");

const toastTitle =
    getElement("toastTitle");

const toastMessage =
    getElement("toastMessage");

const logoutBtn =
    getElement("logoutBtn");

const compactMode =
    getElement("compactMode");

const themeOptions =
    document.querySelectorAll(
        'input[name="theme"]'
    );

const passwordToggles =
    document.querySelectorAll(
        ".password-toggle"
    );

const newPassword =
    getElement("newPassword");

const strengthBar =
    getElement("strengthBar");

const strengthText =
    getElement("strengthText");


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const defaultSettings = {
    displayName: "Alex Johnson",
    username: "alexjohnson",
    accountEmail: "alex.johnson@example.com",

    emailNotifications: true,
    projectNotifications: true,
    classNotifications: true,
    announcementNotifications: true,

    theme: "light",
    compactMode: false,

    publicProfile: true,
    showProgress: true,
    showEmail: false
};


/* =========================================================
   LOAD SETTINGS
========================================================= */

function loadSettings() {

    let savedSettings = null;

    try {
        const stored =
            localStorage.getItem(
                "jabicoSettings"
            );

        if (stored) {
            savedSettings =
                JSON.parse(stored);
        }
    } catch (error) {
        console.warn(
            "Unable to load settings.",
            error
        );
    }

    const settings = {
        ...defaultSettings,
        ...(savedSettings || {})
    };

    applySettings(settings);
}


/* =========================================================
   APPLY SETTINGS
========================================================= */

function applySettings(settings) {

    const displayName =
        getElement("displayName");

    const username =
        getElement("username");

    const accountEmail =
        getElement("accountEmail");

    if (displayName) {
        displayName.value =
            settings.displayName;
    }

    if (username) {
        username.value =
            settings.username;
    }

    if (accountEmail) {
        accountEmail.value =
            settings.accountEmail;
    }


    setCheckbox(
        "emailNotifications",
        settings.emailNotifications
    );

    setCheckbox(
        "projectNotifications",
        settings.projectNotifications
    );

    setCheckbox(
        "classNotifications",
        settings.classNotifications
    );

    setCheckbox(
        "announcementNotifications",
        settings.announcementNotifications
    );

    setCheckbox(
        "compactMode",
        settings.compactMode
    );

    setCheckbox(
        "publicProfile",
        settings.publicProfile
    );

    setCheckbox(
        "showProgress",
        settings.showProgress
    );

    setCheckbox(
        "showEmail",
        settings.showEmail
    );


    setTheme(settings.theme);
}


/* =========================================================
   CHECKBOX HELPER
========================================================= */

function setCheckbox(id, value) {

    const checkbox =
        getElement(id);

    if (checkbox) {
        checkbox.checked =
            Boolean(value);
    }
}


/* =========================================================
   COLLECT SETTINGS
========================================================= */

function collectSettings() {

    return {
        displayName:
            getValue("displayName"),

        username:
            getValue("username"),

        accountEmail:
            getValue("accountEmail"),

        emailNotifications:
            getChecked(
                "emailNotifications"
            ),

        projectNotifications:
            getChecked(
                "projectNotifications"
            ),

        classNotifications:
            getChecked(
                "classNotifications"
            ),

        announcementNotifications:
            getChecked(
                "announcementNotifications"
            ),

        theme:
            getSelectedTheme(),

        compactMode:
            getChecked(
                "compactMode"
            ),

        publicProfile:
            getChecked(
                "publicProfile"
            ),

        showProgress:
            getChecked(
                "showProgress"
            ),

        showEmail:
            getChecked(
                "showEmail"
            )
    };
}


/* =========================================================
   VALUE HELPERS
========================================================= */

function getValue(id) {

    const element =
        getElement(id);

    return element
        ? element.value.trim()
        : "";
}


function getChecked(id) {

    const element =
        getElement(id);

    return element
        ? element.checked
        : false;
}


/* =========================================================
   THEME
========================================================= */

function getSelectedTheme() {

    const selected =
        document.querySelector(
            'input[name="theme"]:checked'
        );

    return selected
        ? selected.value
        : "light";
}


function setTheme(theme) {

    document.body.classList.remove(
        "dark-mode"
    );

    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

    } else if (theme === "system") {

        const prefersDark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

        if (prefersDark) {
            document.body.classList.add(
                "dark-mode"
            );
        }
    }


    themeOptions.forEach(
        (radio) => {

            const option =
                radio.closest(
                    ".theme-option"
                );

            if (!option) {
                return;
            }

            option.classList.toggle(
                "active",
                radio.value === theme
            );
        }
    );


    if (compactMode) {
        document.body.classList.toggle(
            "compact-mode",
            compactMode.checked
        );
    }
}


/* =========================================================
   NAVIGATION
========================================================= */

settingsNavItems.forEach(
    (item) => {

        item.addEventListener(
            "click",
            () => {

                const sectionName =
                    item.dataset.section;

                if (!sectionName) {
                    return;
                }


                settingsNavItems.forEach(
                    (navItem) => {

                        navItem.classList.remove(
                            "active"
                        );

                    }
                );


                settingsSections.forEach(
                    (section) => {

                        section.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );


                const targetSection =
                    document.querySelector(
                        `[data-content="${sectionName}"]`
                    );

                if (targetSection) {

                    targetSection.classList.add(
                        "active"
                    );

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
            }
        );
    }
);


/* =========================================================
   SAVE SETTINGS
========================================================= */

if (saveSettingsBtn) {

    saveSettingsBtn.addEventListener(
        "click",
        () => {

            if (!validateAccountForm()) {
                return;
            }

            const settings =
                collectSettings();

            try {

                localStorage.setItem(
                    "jabicoSettings",
                    JSON.stringify(settings)
                );

                showToast(
                    "Settings Saved",
                    "Your settings have been updated successfully."
                );

            } catch (error) {

                console.warn(
                    "Unable to save settings.",
                    error
                );

                showToast(
                    "Save Failed",
                    "Your browser could not save the settings."
                );
            }
        }
    );
}


/* =========================================================
   ACCOUNT VALIDATION
========================================================= */

function validateAccountForm() {

    clearAccountErrors();

    let valid = true;

    const displayName =
        getElement("displayName");

    const username =
        getElement("username");

    const email =
        getElement("accountEmail");


    if (
        !displayName ||
        displayName.value.trim().length < 2
    ) {

        showFieldError(
            "displayName",
            "Please enter your display name."
        );

        valid = false;
    }


    if (
        !username ||
        username.value.trim().length < 3
    ) {

        showFieldError(
            "username",
            "Username must contain at least 3 characters."
        );

        valid = false;
    }


    if (
        !email ||
        !isValidEmail(
            email.value.trim()
        )
    ) {

        showFieldError(
            "accountEmail",
            "Please enter a valid email address."
        );

        valid = false;
    }


    return valid;
}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );
}


/* =========================================================
   SHOW FIELD ERROR
========================================================= */

function showFieldError(
    fieldName,
    message
) {

    const field =
        getElement(fieldName);

    const error =
        getElement(
            `${fieldName}Error`
        );

    if (field) {

        field.classList.add(
            "input-error"
        );
    }

    if (error) {

        error.textContent =
            message;
    }
}


/* =========================================================
   CLEAR ACCOUNT ERRORS
========================================================= */

function clearAccountErrors() {

    [
        "displayName",
        "username",
        "accountEmail"
    ].forEach(
        (id) => {

            const field =
                getElement(id);

            const error =
                getElement(
                    `${id}Error`
                );

            if (field) {

                field.classList.remove(
                    "input-error"
                );
            }

            if (error) {

                error.textContent =
                    "";
            }
        }
    );
}


/* =========================================================
   LIVE ACCOUNT VALIDATION
========================================================= */

[
    "displayName",
    "username",
    "accountEmail"
].forEach(
    (id) => {

        const field =
            getElement(id);

        if (!field) {
            return;
        }

        field.addEventListener(
            "input",
            () => {

                field.classList.remove(
                    "input-error"
                );

                const error =
                    getElement(
                        `${id}Error`
                    );

                if (error) {
                    error.textContent =
                        "";
                }
            }
        );
    }
);


/* =========================================================
   ACCOUNT FORM SUBMIT
========================================================= */

if (accountForm) {

    accountForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            if (saveSettingsBtn) {
                saveSettingsBtn.click();
            }
        }
    );
}


/* =========================================================
   RESET SETTINGS
========================================================= */

if (resetSettingsBtn) {

    resetSettingsBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Reset all settings to their default values?"
                );

            if (!confirmed) {
                return;
            }


            try {

                localStorage.removeItem(
                    "jabicoSettings"
                );

            } catch (error) {

                console.warn(
                    "Unable to clear saved settings.",
                    error
                );
            }


            applySettings(
                defaultSettings
            );


            showToast(
                "Settings Reset",
                "Your settings have been restored to their defaults."
            );
        }
    );
}


/* =========================================================
   THEME CHANGE
========================================================= */

themeOptions.forEach(
    (radio) => {

        radio.addEventListener(
            "change",
            () => {

                if (radio.checked) {
                    setTheme(
                        radio.value
                    );
                }
            }
        );
    }
);


/* =========================================================
   COMPACT MODE
========================================================= */

if (compactMode) {

    compactMode.addEventListener(
        "change",
        () => {

            document.body.classList.toggle(
                "compact-mode",
                compactMode.checked
            );
        }
    );
}


/* =========================================================
   PASSWORD MODAL
========================================================= */

function openPasswordModal() {

    if (!passwordModal) {
        return;
    }

    passwordModal.classList.add(
        "show"
    );

    passwordModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    setTimeout(
        () => {

            const current =
                getElement(
                    "currentPassword"
                );

            if (current) {
                current.focus();
            }

        },
        200
    );
}


function closePasswordModalWindow() {

    if (!passwordModal) {
        return;
    }

    passwordModal.classList.remove(
        "show"
    );

    passwordModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    if (passwordForm) {
        passwordForm.reset();
    }

    clearPasswordErrors();
    resetPasswordStrength();
}


if (changePasswordBtn) {

    changePasswordBtn.addEventListener(
        "click",
        openPasswordModal
    );
}


if (closePasswordModal) {

    closePasswordModal.addEventListener(
        "click",
        closePasswordModalWindow
    );
}


if (cancelPasswordBtn) {

    cancelPasswordBtn.addEventListener(
        "click",
        closePasswordModalWindow
    );
}


if (passwordModal) {

    passwordModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                passwordModal
            ) {

                closePasswordModalWindow();
            }
        }
    );
}


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            passwordModal &&
            passwordModal.classList.contains(
                "show"
            )
        ) {

            closePasswordModalWindow();
        }
    }
);


/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

passwordToggles.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.dataset.target;

                const input =
                    getElement(targetId);

                if (!input) {
                    return;
                }


                const icon =
                    button.querySelector("i");


                if (
                    input.type ===
                    "password"
                ) {

                    input.type =
                        "text";

                    if (icon) {

                        icon.classList.remove(
                            "fa-eye"
                        );

                        icon.classList.add(
                            "fa-eye-slash"
                        );
                    }

                } else {

                    input.type =
                        "password";

                    if (icon) {

                        icon.classList.remove(
                            "fa-eye-slash"
                        );

                        icon.classList.add(
                            "fa-eye"
                        );
                    }
                }
            }
        );
    }
);


/* =========================================================
   PASSWORD STRENGTH
========================================================= */

if (newPassword) {

    newPassword.addEventListener(
        "input",
        () => {

            updatePasswordStrength(
                newPassword.value
            );
        }
    );
}


function updatePasswordStrength(password) {

    if (!strengthBar || !strengthText) {
        return;
    }


    if (!password) {

        resetPasswordStrength();
        return;
    }


    let score = 0;


    if (password.length >= 8) {
        score++;
    }

    if (/[a-z]/.test(password)) {
        score++;
    }

    if (/[A-Z]/.test(password)) {
        score++;
    }

    if (/[0-9]/.test(password)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }


    const percentages = [
        20,
        40,
        60,
        80,
        100
    ];

    const labels = [
        "Very Weak",
        "Weak",
        "Fair",
        "Strong",
        "Very Strong"
    ];


    const index =
        Math.max(
            0,
            Math.min(
                score - 1,
                4
            )
        );


    strengthBar.style.width =
        `${percentages[index]}%`;

    strengthText.textContent =
        labels[index];
}


function resetPasswordStrength() {

    if (strengthBar) {
        strengthBar.style.width =
            "0%";
    }

    if (strengthText) {
        strengthText.textContent =
            "—";
    }
}


/* =========================================================
   PASSWORD VALIDATION
========================================================= */

if (passwordForm) {

    passwordForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            clearPasswordErrors();


            const currentPassword =
                getElement(
                    "currentPassword"
                );

            const newPasswordField =
                getElement(
                    "newPassword"
                );

            const confirmPassword =
                getElement(
                    "confirmPassword"
                );


            let valid = true;


            if (
                !currentPassword ||
                currentPassword.value.trim() === ""
            ) {

                showPasswordError(
                    "currentPassword",
                    "Please enter your current password."
                );

                valid = false;
            }


            if (
                !newPasswordField ||
                newPasswordField.value.length < 8
            ) {

                showPasswordError(
                    "newPassword",
                    "Password must contain at least 8 characters."
                );

                valid = false;
            }


            if (
                newPasswordField &&
                confirmPassword &&
                newPasswordField.value !==
                    confirmPassword.value
            ) {

                showPasswordError(
                    "confirmPassword",
                    "Passwords do not match."
                );

                valid = false;
            }


            if (!valid) {
                return;
            }


            closePasswordModalWindow();


            showToast(
                "Password Updated",
                "Your password has been changed successfully."
            );
        }
    );
}


/* =========================================================
   SHOW PASSWORD ERROR
========================================================= */

function showPasswordError(
    fieldName,
    message
) {

    const field =
        getElement(fieldName);

    const error =
        getElement(
            `${fieldName}Error`
        );


    if (field) {

        field.classList.add(
            "input-error"
        );
    }


    if (error) {

        error.textContent =
            message;
    }
}


/* =========================================================
   CLEAR PASSWORD ERRORS
========================================================= */

function clearPasswordErrors() {

    [
        "currentPassword",
        "newPassword",
        "confirmPassword"
    ].forEach(
        (id) => {

            const field =
                getElement(id);

            const error =
                getElement(
                    `${id}Error`
                );


            if (field) {

                field.classList.remove(
                    "input-error"
                );
            }


            if (error) {

                error.textContent =
                    "";
            }
        }
    );
}


/* =========================================================
   PASSWORD LIVE ERROR CLEARING
========================================================= */

[
    "currentPassword",
    "newPassword",
    "confirmPassword"
].forEach(
    (id) => {

        const field =
            getElement(id);

        if (!field) {
            return;
        }

        field.addEventListener(
            "input",
            () => {

                field.classList.remove(
                    "input-error"
                );

                const error =
                    getElement(
                        `${id}Error`
                    );

                if (error) {
                    error.textContent =
                        "";
                }
            }
        );
    }
);


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(
    title,
    message
) {

    if (
        !successToast ||
        !toastTitle ||
        !toastMessage
    ) {
        return;
    }


    toastTitle.textContent =
        title;

    toastMessage.textContent =
        message;


    successToast.classList.add(
        "show"
    );


    if (toastTimer) {
        clearTimeout(
            toastTimer
        );
    }


    toastTimer =
        setTimeout(
            () => {

                hideToast();

            },
            4000
        );
}


function hideToast() {

    if (!successToast) {
        return;
    }

    successToast.classList.remove(
        "show"
    );
}


if (closeToast) {

    closeToast.addEventListener(
        "click",
        hideToast
    );
}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to sign out?"
                );

            if (!confirmed) {
                return;
            }


            showToast(
                "Signed Out",
                "You have been signed out successfully."
            );


            /*
             * Connect your real authentication
             * redirect here later.
             *
             * Example:
             *
             * window.location.href =
             *     "login.html";
             */
        }
    );
}


/* =========================================================
   SYSTEM THEME LISTENER
========================================================= */

const systemTheme =
    window.matchMedia(
        "(prefers-color-scheme: dark)"
    );


systemTheme.addEventListener(
    "change",
    () => {

        const selectedTheme =
            getSelectedTheme();

        if (selectedTheme === "system") {

            setTheme(
                "system"
            );
        }
    }
);


/* =========================================================
   INITIALIZE
========================================================= */

loadSettings();
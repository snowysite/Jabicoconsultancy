/* =========================================================
   JABICO COHORT PORTAL
   PROFILE PAGE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       ELEMENTS
       ===================================================== */

    const profileForm = document.getElementById("profileForm");

    const editTopBtn = document.getElementById("editTopBtn");
    const cancelTopBtn = document.getElementById("cancelTopBtn");

    const cancelBtn = document.getElementById("cancelBtn");
    const saveBtn = document.getElementById("saveBtn");

    const formActions = document.getElementById("formActions");

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const locationField = document.getElementById("location");
    const cohort = document.getElementById("cohort");
    const role = document.getElementById("role");
    const bio = document.getElementById("bio");

    const profileName = document.getElementById("profileName");
    const profileRole = document.getElementById("profileRole");

    const bioCount = document.getElementById("bioCount");

    const profileImage = document.getElementById("profileImage");
    const avatarEditBtn = document.getElementById("avatarEditBtn");
    const avatarInput = document.getElementById("avatarInput");

    const successToast = document.getElementById("successToast");
    const closeToast = document.getElementById("closeToast");

    const changePasswordBtn =
        document.getElementById("changePasswordBtn");

    const passwordModal =
        document.getElementById("passwordModal");

    const closePasswordModal =
        document.getElementById("closePasswordModal");

    const cancelPasswordBtn =
        document.getElementById("cancelPasswordBtn");

    const passwordForm =
        document.getElementById("passwordForm");

    const newPassword =
        document.getElementById("newPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");


    /* =====================================================
       EDITABLE PROFILE FIELDS
       ===================================================== */

    const editableFields = [
        firstName,
        lastName,
        email,
        phone,
        locationField,
        cohort,
        bio
    ].filter(Boolean);


    /* =====================================================
       ORIGINAL PROFILE DATA
       ===================================================== */

    let originalProfile = {};

    function saveOriginalProfile() {
        originalProfile = {
            firstName: firstName?.value || "",
            lastName: lastName?.value || "",
            email: email?.value || "",
            phone: phone?.value || "",
            location: locationField?.value || "",
            cohort: cohort?.value || "",
            bio: bio?.value || ""
        };
    }

    saveOriginalProfile();


    /* =====================================================
       EDIT MODE
       ===================================================== */

    function enableEditMode() {
        editableFields.forEach((field) => {
            field.disabled = false;
        });

        document.body.classList.add("profile-editing");

        if (editTopBtn) {
            editTopBtn.hidden = true;
        }

        if (cancelTopBtn) {
            cancelTopBtn.hidden = false;
        }

        if (formActions) {
            formActions.classList.add("show");
        }

        if (firstName) {
            firstName.focus();
        }
    }


    /* =====================================================
       DISABLE EDIT MODE
       ===================================================== */

    function disableEditMode() {
        editableFields.forEach((field) => {
            field.disabled = true;
        });

        document.body.classList.remove("profile-editing");

        if (editTopBtn) {
            editTopBtn.hidden = false;
        }

        if (cancelTopBtn) {
            cancelTopBtn.hidden = true;
        }

        if (formActions) {
            formActions.classList.remove("show");
        }
    }


    /* =====================================================
       RESTORE ORIGINAL PROFILE
       ===================================================== */

    function restoreOriginalProfile() {
        if (firstName) {
            firstName.value = originalProfile.firstName;
        }

        if (lastName) {
            lastName.value = originalProfile.lastName;
        }

        if (email) {
            email.value = originalProfile.email;
        }

        if (phone) {
            phone.value = originalProfile.phone;
        }

        if (locationField) {
            locationField.value = originalProfile.location;
        }

        if (cohort) {
            cohort.value = originalProfile.cohort;
        }

        if (bio) {
            bio.value = originalProfile.bio;
        }

        updateBioCount();
        clearProfileErrors();
    }


    /* =====================================================
       EDIT BUTTON
       ===================================================== */

    if (editTopBtn) {
        editTopBtn.addEventListener(
            "click",
            enableEditMode
        );
    }


    /* =====================================================
       TOP CANCEL BUTTON
       ===================================================== */

    if (cancelTopBtn) {
        cancelTopBtn.addEventListener("click", () => {
            restoreOriginalProfile();
            disableEditMode();
        });
    }


    /* =====================================================
       FORM CANCEL BUTTON
       ===================================================== */

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            restoreOriginalProfile();
            disableEditMode();
        });
    }


    /* =====================================================
       PROFILE VALIDATION
       ===================================================== */

    function showProfileError(fieldName, message) {
        const field = document.getElementById(fieldName);

        const error = document.getElementById(
            `${fieldName}Error`
        );

        if (field) {
            field.classList.add("input-error");
        }

        if (error) {
            error.textContent = message;
        }
    }


    function clearProfileErrors() {
        const fields = [
            "firstName",
            "lastName",
            "email",
            "phone",
            "location",
            "cohort",
            "bio"
        ];

        fields.forEach((id) => {
            const field = document.getElementById(id);

            if (field) {
                field.classList.remove("input-error");
            }

            const error = document.getElementById(
                `${id}Error`
            );

            if (error) {
                error.textContent = "";
            }
        });
    }


    function validateProfile() {
        clearProfileErrors();

        let isValid = true;

        const firstNameValue =
            firstName?.value.trim() || "";

        const lastNameValue =
            lastName?.value.trim() || "";

        const emailValue =
            email?.value.trim() || "";

        if (!firstNameValue) {
            showProfileError(
                "firstName",
                "Please enter your first name."
            );

            isValid = false;
        }

        if (!lastNameValue) {
            showProfileError(
                "lastName",
                "Please enter your last name."
            );

            isValid = false;
        }

        if (!emailValue) {
            showProfileError(
                "email",
                "Please enter your email address."
            );

            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showProfileError(
                "email",
                "Please enter a valid email address."
            );

            isValid = false;
        }

        return isValid;
    }


    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }


    /* =====================================================
       PROFILE FORM SUBMIT
       ===================================================== */

    if (profileForm) {
        profileForm.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                if (!validateProfile()) {
                    return;
                }

                saveProfile();
            }
        );
    }


    /* =====================================================
       SAVE PROFILE
       ===================================================== */

    function saveProfile() {
        const originalButtonText =
            saveBtn?.innerHTML || "Save Changes";

        if (saveBtn) {
            saveBtn.disabled = true;

            saveBtn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Saving...
            `;
        }

        setTimeout(() => {
            originalProfile = {
                firstName: firstName?.value.trim() || "",
                lastName: lastName?.value.trim() || "",
                email: email?.value.trim() || "",
                phone: phone?.value.trim() || "",
                location: locationField?.value.trim() || "",
                cohort: cohort?.value || "",
                bio: bio?.value.trim() || ""
            };

            updateProfileSummary();

            disableEditMode();

            showSuccessToast();

            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalButtonText;
            }
        }, 700);
    }


    /* =====================================================
       UPDATE PROFILE SUMMARY
       ===================================================== */

    function updateProfileSummary() {
        const fullName =
            `${firstName?.value.trim() || ""} ${lastName?.value.trim() || ""}`
                .trim();

        if (profileName) {
            profileName.textContent =
                fullName || "Your Name";
        }

        if (profileRole) {
            profileRole.textContent =
                role?.value.trim() || "Student";
        }
    }


    /* =====================================================
       BIO CHARACTER COUNT
       ===================================================== */

    function updateBioCount() {
        if (!bio || !bioCount) {
            return;
        }

        bioCount.textContent = bio.value.length;
    }


    if (bio) {
        bio.addEventListener(
            "input",
            updateBioCount
        );

        updateBioCount();
    }


    /* =====================================================
       AVATAR UPLOAD
       ===================================================== */

    if (avatarEditBtn && avatarInput) {
        avatarEditBtn.addEventListener(
            "click",
            () => {
                avatarInput.click();
            }
        );
    }


    if (avatarInput) {
        avatarInput.addEventListener(
            "change",
            (event) => {
                const file =
                    event.target.files?.[0];

                if (!file) {
                    return;
                }

                if (!file.type.startsWith("image/")) {
                    alert(
                        "Please select a valid image file."
                    );

                    avatarInput.value = "";
                    return;
                }

                const maxSize =
                    5 * 1024 * 1024;

                if (file.size > maxSize) {
                    alert(
                        "Image size must be less than 5MB."
                    );

                    avatarInput.value = "";
                    return;
                }

                const reader =
                    new FileReader();

                reader.onload = (loadEvent) => {
                    if (profileImage) {
                        profileImage.src =
                            loadEvent.target.result;
                    }

                    showSuccessToast(
                        "Profile Picture Updated",
                        "Your new profile picture has been applied."
                    );
                };

                reader.readAsDataURL(file);
            }
        );
    }


    /* =====================================================
       SUCCESS TOAST
       ===================================================== */

    let toastTimer = null;

    function showSuccessToast(
        title = "Profile Updated",
        message =
            "Your information has been saved successfully."
    ) {
        if (!successToast) {
            return;
        }

        const titleElement =
            successToast.querySelector("strong");

        const messageElement =
            successToast.querySelector("p");

        if (titleElement) {
            titleElement.textContent = title;
        }

        if (messageElement) {
            messageElement.textContent = message;
        }

        successToast.classList.add("show");

        if (toastTimer) {
            clearTimeout(toastTimer);
        }

        toastTimer = setTimeout(() => {
            hideSuccessToast();
        }, 4500);
    }


    function hideSuccessToast() {
        if (successToast) {
            successToast.classList.remove("show");
        }
    }


    if (closeToast) {
        closeToast.addEventListener(
            "click",
            hideSuccessToast
        );
    }


    /* =====================================================
       PASSWORD MODAL
       ===================================================== */

    function openPasswordModal() {
        if (!passwordModal) {
            return;
        }

        passwordModal.classList.add("show");

        document.body.classList.add(
            "modal-open"
        );

        clearPasswordErrors();

        if (passwordForm) {
            passwordForm.reset();
        }

        setTimeout(() => {
            if (newPassword) {
                newPassword.focus();
            }
        }, 150);
    }


    function closePasswordModalFunction() {
        if (!passwordModal) {
            return;
        }

        passwordModal.classList.remove("show");

        document.body.classList.remove(
            "modal-open"
        );

        clearPasswordErrors();

        if (passwordForm) {
            passwordForm.reset();
        }
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
            closePasswordModalFunction
        );
    }


    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener(
            "click",
            closePasswordModalFunction
        );
    }


    /* =====================================================
       CLOSE MODAL WHEN CLICKING OUTSIDE
       ===================================================== */

    if (passwordModal) {
        passwordModal.addEventListener(
            "click",
            (event) => {
                if (
                    event.target === passwordModal
                ) {
                    closePasswordModalFunction();
                }
            }
        );
    }


    /* =====================================================
       CLOSE MODAL WITH ESCAPE
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key === "Escape" &&
                passwordModal?.classList.contains("show")
            ) {
                closePasswordModalFunction();
            }
        }
    );


    /* =====================================================
       PASSWORD VALIDATION
       ===================================================== */

    function showPasswordError(
        fieldName,
        message
    ) {
        const field =
            document.getElementById(fieldName);

        const error =
            document.getElementById(
                `${fieldName}Error`
            );

        if (field) {
            field.classList.add(
                "input-error"
            );
        }

        if (error) {
            error.textContent = message;
        }
    }


    function clearPasswordErrors() {
        const passwordFields = [
            "newPassword",
            "confirmPassword"
        ];

        passwordFields.forEach((id) => {
            const field =
                document.getElementById(id);

            if (field) {
                field.classList.remove(
                    "input-error"
                );
            }

            const error =
                document.getElementById(
                    `${id}Error`
                );

            if (error) {
                error.textContent = "";
            }
        });
    }


    function validatePassword() {
        clearPasswordErrors();

        const password =
            newPassword?.value || "";

        const confirmation =
            confirmPassword?.value || "";

        let isValid = true;

        if (!password) {
            showPasswordError(
                "newPassword",
                "Please enter a new password."
            );

            isValid = false;
        } else if (password.length < 8) {
            showPasswordError(
                "newPassword",
                "Password must be at least 8 characters."
            );

            isValid = false;
        }

        if (!confirmation) {
            showPasswordError(
                "confirmPassword",
                "Please confirm your password."
            );

            isValid = false;
        } else if (password !== confirmation) {
            showPasswordError(
                "confirmPassword",
                "Passwords do not match."
            );

            isValid = false;
        }

        return isValid;
    }


    /* =====================================================
       PASSWORD FORM SUBMIT
       ===================================================== */

    if (passwordForm) {
        passwordForm.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                if (!validatePassword()) {
                    return;
                }

                const submitButton =
                    passwordForm.querySelector(
                        'button[type="submit"]'
                    );

                const originalText =
                    submitButton?.innerHTML ||
                    "Update Password";

                if (submitButton) {
                    submitButton.disabled = true;

                    submitButton.innerHTML = `
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        Updating...
                    `;
                }

                setTimeout(() => {
                    closePasswordModalFunction();

                    showSuccessToast(
                        "Password Updated",
                        "Your password has been changed successfully."
                    );

                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML =
                            originalText;
                    }
                }, 800);
            }
        );
    }


    /* =====================================================
       REAL-TIME PASSWORD ERROR CLEARING
       ===================================================== */

    if (newPassword) {
        newPassword.addEventListener(
            "input",
            () => {
                newPassword.classList.remove(
                    "input-error"
                );

                const error =
                    document.getElementById(
                        "newPasswordError"
                    );

                if (error) {
                    error.textContent = "";
                }
            }
        );
    }


    if (confirmPassword) {
        confirmPassword.addEventListener(
            "input",
            () => {
                confirmPassword.classList.remove(
                    "input-error"
                );

                const error =
                    document.getElementById(
                        "confirmPasswordError"
                    );

                if (error) {
                    error.textContent = "";
                }
            }
        );
    }


    /* =====================================================
       REAL-TIME PROFILE ERROR CLEARING
       ===================================================== */

    editableFields.forEach((field) => {
        field.addEventListener(
            "input",
            () => {
                field.classList.remove(
                    "input-error"
                );

                const error =
                    document.getElementById(
                        `${field.id}Error`
                    );

                if (error) {
                    error.textContent = "";
                }
            }
        );

        field.addEventListener(
            "change",
            () => {
                field.classList.remove(
                    "input-error"
                );

                const error =
                    document.getElementById(
                        `${field.id}Error`
                    );

                if (error) {
                    error.textContent = "";
                }
            }
        );
    });


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    disableEditMode();
    updateBioCount();
    updateProfileSummary();
});
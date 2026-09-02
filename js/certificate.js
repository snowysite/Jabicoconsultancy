/* =========================================================
   JABICO COHORT PORTAL
   CERTIFICATE PAGE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const downloadBtn = document.getElementById(
        "downloadCertificateBtn"
    );

    const printBtn = document.getElementById(
        "printCertificateBtn"
    );

    const fullscreenBtn = document.getElementById(
        "fullscreenCertificateBtn"
    );

    const shareBtn = document.getElementById(
        "shareCertificateBtn"
    );

    const verifyBtn = document.getElementById(
        "verifyCertificateBtn"
    );

    const certificate = document.getElementById(
        "certificate"
    );

    const shareModal = document.getElementById(
        "shareModal"
    );

    const verificationModal = document.getElementById(
        "verificationModal"
    );

    const closeShareModal = document.getElementById(
        "closeShareModal"
    );

    const closeVerificationModal =
        document.getElementById(
            "closeVerificationModal"
        );

    const verificationDoneBtn =
        document.getElementById(
            "verificationDoneBtn"
        );

    const closeToast = document.getElementById(
        "closeToast"
    );

    const toast = document.getElementById(
        "certificateToast"
    );

    const toastTitle = document.getElementById(
        "toastTitle"
    );

    const toastMessage = document.getElementById(
        "toastMessage"
    );


    /* =====================================================
       CERTIFICATE DATA
       ===================================================== */

    const certificateData = {
        name: "Alex Johnson",
        cohort: "Cohort 2",
        date: "August 29, 2026",
        id: "JBC-2026-00248",
        program: "JABICO Digital Skills Cohort Program"
    };


    /* =====================================================
       UPDATE CERTIFICATE INFORMATION
       ===================================================== */

    function updateCertificateInformation() {

        const studentName =
            document.getElementById(
                "certificateStudentName"
            );

        const certificateCohort =
            document.getElementById(
                "certificateCohort"
            );

        const certificateDate =
            document.getElementById(
                "certificateDate"
            );

        const certificateId =
            document.getElementById(
                "certificateId"
            );

        const recipientName =
            document.getElementById(
                "recipientName"
            );

        const recipientCohort =
            document.getElementById(
                "recipientCohort"
            );

        const recipientDate =
            document.getElementById(
                "recipientDate"
            );

        const recipientCertificateId =
            document.getElementById(
                "recipientCertificateId"
            );

        const verifiedCertificateId =
            document.getElementById(
                "verifiedCertificateId"
            );

        const verifiedRecipient =
            document.getElementById(
                "verifiedRecipient"
            );


        if (studentName) {
            studentName.textContent =
                certificateData.name;
        }

        if (certificateCohort) {
            certificateCohort.textContent =
                certificateData.cohort;
        }

        if (certificateDate) {
            certificateDate.textContent =
                certificateData.date;
        }

        if (certificateId) {
            certificateId.textContent =
                certificateData.id;
        }

        if (recipientName) {
            recipientName.textContent =
                certificateData.name;
        }

        if (recipientCohort) {
            recipientCohort.textContent =
                certificateData.cohort;
        }

        if (recipientDate) {
            recipientDate.textContent =
                certificateData.date;
        }

        if (recipientCertificateId) {
            recipientCertificateId.textContent =
                certificateData.id;
        }

        if (verifiedCertificateId) {
            verifiedCertificateId.textContent =
                certificateData.id;
        }

        if (verifiedRecipient) {
            verifiedRecipient.textContent =
                certificateData.name;
        }
    }


    updateCertificateInformation();


    /* =====================================================
       TOAST
       ===================================================== */

    let toastTimer = null;

    function showToast(
        title,
        message
    ) {

        if (!toast) {
            return;
        }

        if (toastTitle) {
            toastTitle.textContent = title;
        }

        if (toastMessage) {
            toastMessage.textContent = message;
        }

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3500);
    }


    if (closeToast) {

        closeToast.addEventListener(
            "click",
            () => {
                toast.classList.remove("show");
            }
        );

    }


    /* =====================================================
       MODAL HELPERS
       ===================================================== */

    function openModal(modal) {

        if (!modal) {
            return;
        }

        modal.classList.add("show");
        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";
    }


    function closeModal(modal) {

        if (!modal) {
            return;
        }

        modal.classList.remove("show");
        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";
    }


    /* =====================================================
       SHARE MODAL
       ===================================================== */

    if (shareBtn) {

        shareBtn.addEventListener(
            "click",
            () => {
                openModal(shareModal);
            }
        );

    }


    if (closeShareModal) {

        closeShareModal.addEventListener(
            "click",
            () => {
                closeModal(shareModal);
            }
        );

    }


    /* =====================================================
       VERIFICATION MODAL
       ===================================================== */

    if (verifyBtn) {

        verifyBtn.addEventListener(
            "click",
            () => {

                openModal(
                    verificationModal
                );

            }
        );

    }


    if (closeVerificationModal) {

        closeVerificationModal.addEventListener(
            "click",
            () => {
                closeModal(
                    verificationModal
                );
            }
        );

    }


    if (verificationDoneBtn) {

        verificationDoneBtn.addEventListener(
            "click",
            () => {
                closeModal(
                    verificationModal
                );
            }
        );

    }


    /* =====================================================
       CLOSE MODALS WHEN CLICKING OUTSIDE
       ===================================================== */

    [shareModal, verificationModal]
        .forEach((modal) => {

            if (!modal) {
                return;
            }

            modal.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target === modal
                    ) {
                        closeModal(modal);
                    }

                }
            );

        });


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }

            closeModal(shareModal);
            closeModal(
                verificationModal
            );

            if (
                certificate &&
                certificate.classList.contains(
                    "fullscreen"
                )
            ) {
                exitFullscreenPreview();
            }

        }
    );


    /* =====================================================
       PRINT CERTIFICATE
       ===================================================== */

    function printCertificate() {

        window.print();

    }


    if (printBtn) {

        printBtn.addEventListener(
            "click",
            printCertificate
        );

    }


    /* =====================================================
       DOWNLOAD CERTIFICATE
       ===================================================== */

    function downloadCertificate() {

        showToast(
            "Preparing Certificate",
            "Your certificate download is being prepared."
        );

        setTimeout(() => {

            window.print();

        }, 700);

    }


    if (downloadBtn) {

        downloadBtn.addEventListener(
            "click",
            downloadCertificate
        );

    }


    /* =====================================================
       FULLSCREEN PREVIEW
       ===================================================== */

    function enterFullscreenPreview() {

        if (!certificate) {
            return;
        }

        certificate.classList.add(
            "fullscreen"
        );

        fullscreenBtn.innerHTML =
            '<i class="fa-solid fa-compress"></i> Exit Fullscreen';
    }


    function exitFullscreenPreview() {

        if (!certificate) {
            return;
        }

        certificate.classList.remove(
            "fullscreen"
        );

        if (fullscreenBtn) {

            fullscreenBtn.innerHTML =
                '<i class="fa-solid fa-expand"></i> Fullscreen Preview';

        }
    }


    if (fullscreenBtn) {

        fullscreenBtn.addEventListener(
            "click",
            () => {

                if (
                    certificate.classList.contains(
                        "fullscreen"
                    )
                ) {

                    exitFullscreenPreview();

                } else {

                    enterFullscreenPreview();

                }

            }
        );

    }


    /* =====================================================
       SHARE FUNCTIONS
       ===================================================== */

    const shareOptions =
        document.querySelectorAll(
            ".share-option"
        );


    shareOptions.forEach((button) => {

        button.addEventListener(
            "click",
            async () => {

                const platform =
                    button.dataset.share;

                const shareText =
                    `I successfully completed the JABICO Digital Skills Cohort Program and earned my certificate. Certificate ID: ${certificateData.id}.`;

                const currentUrl =
                    window.location.href;


                /* COPY LINK */

                if (platform === "copy") {

                    try {

                        await navigator.clipboard.writeText(
                            currentUrl
                        );

                        closeModal(shareModal);

                        showToast(
                            "Link Copied",
                            "Certificate link copied to your clipboard."
                        );

                    } catch (error) {

                        showToast(
                            "Copy Failed",
                            "Unable to copy the certificate link."
                        );

                    }

                    return;
                }


                /* LINKEDIN */

                if (platform === "linkedin") {

                    const linkedinUrl =
                        "https://www.linkedin.com/sharing/share-offsite/?url=" +
                        encodeURIComponent(
                            currentUrl
                        );

                    window.open(
                        linkedinUrl,
                        "_blank",
                        "noopener,noreferrer"
                    );

                }


                /* FACEBOOK */

                if (platform === "facebook") {

                    const facebookUrl =
                        "https://www.facebook.com/sharer/sharer.php?u=" +
                        encodeURIComponent(
                            currentUrl
                        );

                    window.open(
                        facebookUrl,
                        "_blank",
                        "noopener,noreferrer"
                    );

                }


                /* WHATSAPP */

                if (platform === "whatsapp") {

                    const whatsappUrl =
                        "https://wa.me/?text=" +
                        encodeURIComponent(
                            shareText +
                            " " +
                            currentUrl
                        );

                    window.open(
                        whatsappUrl,
                        "_blank",
                        "noopener,noreferrer"
                    );

                }

            }
        );

    });


    /* =====================================================
       NATIVE SHARE API
       ===================================================== */

    if (
        shareBtn &&
        navigator.share
    ) {

        shareBtn.addEventListener(
            "dblclick",
            async () => {

                try {

                    await navigator.share({
                        title:
                            "JABICO Certificate",
                        text:
                            `I successfully completed the JABICO Digital Skills Cohort Program.`,
                        url:
                            window.location.href
                    });

                } catch (error) {

                    if (
                        error.name !==
                        "AbortError"
                    ) {

                        showToast(
                            "Sharing Unavailable",
                            "Please use one of the available sharing options."
                        );

                    }

                }

            }
        );

    }


});
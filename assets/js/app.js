/* Nordstone – site behaviour: inquiry modal, back-to-top, mobile menu, inquiry form */

/* Set this to your form-handling URL (PHP, Formspree, etc.). Leave empty to only show the confirmation. */
var INQUIRY_ENDPOINT = '';

function openInquiryModal() {
    var modal = document.getElementById('inquiryModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeInquiryModal() {
    var modal = document.getElementById('inquiryModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function () {

    /* ---- Inquiry modal: close on backdrop click / Esc ---- */
    var modal = document.getElementById('inquiryModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeInquiryModal();
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeInquiryModal();
    });

    /* ---- Mobile menu toggle ---- */
    var menuBtn = document.getElementById('mobileMenuButton');
    var menu = document.getElementById('mobileMenu');
    if (menuBtn && menu) {
        menuBtn.addEventListener('click', function () {
            menu.classList.toggle('hidden');
            var icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    /* ---- Mobile accordion (buttons with data-submenu open <id>Menu) ---- */
    document.querySelectorAll('[data-submenu]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var target = document.getElementById(btn.getAttribute('data-submenu') + 'Menu');
            if (!target) return;
            target.classList.toggle('hidden');
            var chevron = btn.querySelector('i');
            if (chevron) {
                chevron.classList.toggle('fa-chevron-down');
                chevron.classList.toggle('fa-chevron-up');
            }
        });
    });

    /* ---- Inquiry popup form + Contact page form (both use class "InsertData") ---- */
    document.querySelectorAll('form.InsertData').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var done = function () {
                form.reset();
                closeInquiryModal();
                if (window.Swal) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thank you!',
                        text: 'Your message has been sent. Our team will contact you shortly.',
                        confirmButtonColor: '#ea580c'
                    });
                }
            };

            if (!INQUIRY_ENDPOINT) { done(); return; }

            fetch(INQUIRY_ENDPOINT, { method: 'POST', body: new FormData(form) })
                .then(function (r) {
                    if (!r.ok) throw new Error('Request failed');
                    done();
                })
                .catch(function () {
                    if (window.Swal) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Something went wrong',
                            text: 'Please try again or email us directly.',
                            confirmButtonColor: '#ea580c'
                        });
                    }
                });
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const themeButton = document.querySelector("[data-theme-toggle]");

    if (!themeButton) return;

    const savedTheme = localStorage.getItem("nordstone-theme");
    const theme = savedTheme === "light" ? "light" : "dark";

    function applyTheme(selectedTheme) {
        document.body.classList.toggle(
            "light-theme",
            selectedTheme === "light"
        );

        document.body.classList.toggle(
            "dark-theme",
            selectedTheme === "dark"
        );

        themeButton.textContent =
            selectedTheme === "light" ? "☀" : "☾";

        themeButton.setAttribute(
            "aria-label",
            selectedTheme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
        );

        themeButton.setAttribute(
            "title",
            selectedTheme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
        );

        localStorage.setItem("nordstone-theme", selectedTheme);
    }

    applyTheme(theme);

    themeButton.addEventListener("click", () => {
        const isLight = document.body.classList.contains("light-theme");

        applyTheme(isLight ? "dark" : "light");
    });
});


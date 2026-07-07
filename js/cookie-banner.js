// ==========================================
// COOKIE BANNER - CENTRO CRIA
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("acceptCookies");
    const rejectBtn = document.getElementById("rejectCookies");
    const preferencesLink = document.getElementById("cookiePreferences");

    if (!banner || !acceptBtn || !rejectBtn) return; // segurança extra

    // Mostrar banner apenas se ainda não existir escolha
    if (localStorage.getItem("cookieConsent") === null) {
        banner.classList.remove("cookie-hidden");
    }

    // Se o utilizador já aceitou anteriormente
    if (localStorage.getItem("cookieConsent") === "accepted") {
        loadGoogleAnalytics();
    }

    // Aceitar cookies
    acceptBtn.addEventListener("click", function () {
        localStorage.setItem("cookieConsent", "accepted");
        banner.classList.add("cookie-hidden");
        loadGoogleAnalytics();
    });

    // Rejeitar cookies
    rejectBtn.addEventListener("click", function () {
        localStorage.setItem("cookieConsent", "rejected");
        banner.classList.add("cookie-hidden");
    });

    // Reabrir banner através do footer
    if (preferencesLink) {
        preferencesLink.addEventListener("click", function (e) {
            e.preventDefault();
            banner.classList.remove("cookie-hidden");
        });
    }
});

// ==========================================
// GOOGLE ANALYTICS
// ==========================================
function loadGoogleAnalytics() {
    if (window.gaLoaded) return;
    window.gaLoaded = true;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-K0RMTS5KMH";
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-K0RMTS5KMH');
}

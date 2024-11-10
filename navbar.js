document.addEventListener("DOMContentLoaded", function () {
    var navToggle = document.getElementById("navToggle");
    var navLinks = document.getElementById("navLinks");
    navToggle === null || navToggle === void 0 ? void 0 : navToggle.addEventListener("click", function () {
        navLinks === null || navLinks === void 0 ? void 0 : navLinks.classList.toggle("active");
    });
    // Smooth scroll for anchor links
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function (anchor) {
        anchor.addEventListener("click", function (event) {
            var _a;
            event.preventDefault();
            var targetId = (_a = anchor.getAttribute("href")) === null || _a === void 0 ? void 0 : _a.substring(1);
            if (targetId) {
                var targetElement = document.getElementById(targetId);
                targetElement === null || targetElement === void 0 ? void 0 : targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});
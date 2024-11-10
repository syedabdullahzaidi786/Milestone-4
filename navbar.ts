document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("navToggle") as HTMLElement;
    const navLinks = document.getElementById("navLinks") as HTMLElement;

    navToggle?.addEventListener("click", () => {
        navLinks?.classList.toggle("active");
    });

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = (anchor as HTMLAnchorElement).getAttribute("href")?.substring(1);
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                targetElement?.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});
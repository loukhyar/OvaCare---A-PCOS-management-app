document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".about-book, .about-box, .scroll-animate");

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        elements.forEach((el) => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 50) {
                el.classList.add("show");
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Run on load
});

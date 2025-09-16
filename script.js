document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.querySelector("nav");

  // Toggle 'show' class on navigation when menu icon is clicked
  toggle.addEventListener("click", () => {
    nav.classList.toggle("show");
  });

  // Close the navigation menu when a link is clicked (on mobile)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('show')) {
        nav.classList.remove('show');
      }
    });
  });

  // Reset nav when resizing back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 995) {
      nav.classList.remove('show');
    }
  });

  // Typing effect for roles
  const roles = [
    "Web Developer",
    "Developer",
    "Web Designer",
    "CPU-HARDWARE EXPERT",
    "STUDENT"
  ];

  const typingSpan = document.querySelector(".typing-text span");
  let roleIndex = 0;
  let charIndex = 0;
  let currentRole = "";
  let isDeleting = false;

  function typeEffect() {
    currentRole = roles[roleIndex];

    if (isDeleting) {
      typingSpan.textContent = currentRole.substring(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    } else {
      typingSpan.textContent = currentRole.substring(0, charIndex++);
      if (charIndex > currentRole.length) {
        isDeleting = true;
      }
    }

    setTimeout(typeEffect, isDeleting ? 100 : 150);
  }

  typeEffect();
});

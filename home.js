document.addEventListener("click", function (event) {
  const navbar = document.getElementById("mobileNav");
  const toggler = document.querySelector(".navbar-toggler");

  const clickedInsideNavbar =
    navbar.contains(event.target) || toggler.contains(event.target);

  if (!clickedInsideNavbar && navbar.classList.contains("show")) {
    new bootstrap.Collapse(navbar).hide();
  }
});

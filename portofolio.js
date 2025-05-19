document.addEventListener("DOMContentLoaded", function () {
  const filterMap = {
    all: [
      "gymWebsite",
      "developingRobots",
      "airbnbCopy",
      "shiftBuilder",
      "rpgGame",
    ],
    responsiveDesign: ["developingRobots", "airbnbCopy"],
    javascript: ["shiftBuilder", "rpgGame"],
    bootstrap: ["gymWebsite"],
  };

  const navLinks = document.querySelectorAll(".filter-btn");
  const allItems = {
    gymWebsite: document.getElementById("gymWebsite"),
    developingRobots: document.getElementById("developingRobots"),
    airbnbCopy: document.getElementById("airbnbCopy"),
    shiftBuilder: document.getElementById("shiftBuilder"),
    rpgGame: document.getElementById("rpgGame"),
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Update active class
      navLinks.forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");

      // Get the selected category
      const selected = this.id;
      const visibleIds = filterMap[selected] || [];

      // Toggle visibility
      for (const [id, element] of Object.entries(allItems)) {
        if (visibleIds.includes(id)) {
          element.classList.remove("d-none");
          element.classList.add("d-block");
        } else {
          element.classList.remove("d-block");
          element.classList.add("d-none");
        }
      }
    });
  });
});

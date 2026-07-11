// Listen for when the playlists menu starts to open
document
  .getElementById("playlistsMenu")
  .addEventListener("show.bs.collapse", function () {
    // Smoothly scroll to the absolute bottom of the page
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100); // A tiny 100ms delay ensures the content is rendered before calculating the final page height
  });

// Wait for entrance animations to finish, then delete them
document.querySelectorAll(".item").forEach((item) => {
  item.addEventListener("animationend", () => {
    item.classList.remove(
      "animate__animated",
      "animate__bounceInRight",
      "animate__BounceInLeft",
      "animate__BounceInDown",
      "animate__BounceInUp",
    );
  });
});

const liveNow = document.getElementById("liveNow");
function updateLiveBanner() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Bucharest",
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday").value;
  const hour = parseInt(parts.find((p) => p.type === "hour").value, 10);
  const isVisible =
    (weekday === "Sat" && hour >= 23) || (weekday === "Sun" && hour < 4);
  liveNow.style.display = isVisible ? "block" : "none";
}
updateLiveBanner();
setInterval(updateLiveBanner, 60000);

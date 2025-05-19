document
  .getElementById("contact-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop the form from redirecting

    const form = e.target;
    const statusDiv = form.querySelector(".status");

    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      const response = await fetch("https://formspree.io/f/mqaqdqva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        statusDiv.innerText = "✓ Message sent!";
        form.reset();
      } else {
        statusDiv.innerText = "✗ Something went wrong.";
      }
    } catch (error) {
      statusDiv.innerText = "✗ Network error.";
    }
  });

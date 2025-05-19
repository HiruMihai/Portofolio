let isResettingPassword = false;

document.getElementById("forgotPassword").addEventListener("click", function () {
    if (!isResettingPassword) {
        document.getElementById("login_password").style.display = "none";
        document.getElementById("login").style.display = "none";
        document.getElementById("resetPassword").style.display = "block";
        displayError("loginPasswordError", "Resetting password will delete the current user.");
        document.getElementById("forgotPassword").textContent = "Go back to login";

        isResettingPassword = true;
    } else {
        document.getElementById("login_password").style.display = "block";
        document.getElementById("login").style.display = "block";
        document.getElementById("resetPassword").style.display = "none";
        clearErrors("loginPasswordError");
        document.getElementById("forgotPassword").textContent = "Forgot password?";
        isResettingPassword = false;
    }
});

document.getElementById("resetPassword").addEventListener("click", function () {
    let loginEmail = document.getElementById("login_email").value;
    let userData = JSON.parse(localStorage.getItem("userData")) || {};

    if (userData.hasOwnProperty(loginEmail)) {
        delete userData[loginEmail];
        localStorage.setItem("userData", JSON.stringify(userData));
        document.getElementById("login_email").value = "";
        document.getElementById("resetPassword").style.display = "none";
        document.getElementById("login_email").style.display = "block";
        document.getElementById("login_password").style.display = "block";
        document.getElementById("login").style.display = "block";
        clearErrors("loginPasswordError");
        document.getElementById("forgotPassword").textContent = "Forgot password?";
    }
});

document.getElementById("login").addEventListener("click", function () {
    let loginEmail = document.getElementById("login_email").value;
    let loginPassword = document.getElementById("login_password").value;
    let userData = JSON.parse(localStorage.getItem("userData")) || {};
    clearErrors("loginEmailError");
    clearErrors("loginPasswordError");
    let hasError = false;
    if (loginEmail.trim() === "") {
        displayError("loginEmailError", "Please enter an email.");
        hasError = true;
    }
    if (hasError) {
        return false;
    }
    if (userData.hasOwnProperty(loginEmail)) {
        let user = userData[loginEmail];
        if (loginPassword.trim() === "") {
            displayError("loginPasswordError", "Please enter a password.");
            hasError = true;
        }
        if (loginPassword === user.password) {
            localStorage.setItem("loggedInUserEmail", loginEmail);
            window.location.href = "../homepage/homepage.html";
        } else {
            displayError("loginPasswordError", "Incorrect password. Please try again.");
            hasError = true;
            clearPassword();
        }
    } else {
        displayError("loginEmailError", "No account found with this email.");
        hasError = true;
        clearPassword();
    }
    if (hasError) {
        return false;
    }
});

function clearErrors(id) {
    if (id) {
        const errorElement = document.getElementById(id);
        errorElement.textContent = "";
        errorElement.style.display = "none";
    } else {
        const errorElements = document.querySelectorAll(".error");
        errorElements.forEach(element => {
            element.textContent = "";
            element.style.display = "none";
        });
    }
}

function displayError(id, message) {
    let errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

function clearPassword() {
    let passwordField = document.getElementById("login_password");
    passwordField.value = ""
}






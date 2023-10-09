document.getElementById("register").addEventListener("click", function () {
    clearErrors();
    let hasError = false;
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let firstName = document.getElementById("first_name").value;
    let lastName = document.getElementById("last_name").value;
    let age = document.getElementById("age").value;
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        displayError("emailError", "Please enter a valid email address.");
        hasError = true;
    } else {
        clearErrors("emailError");
    }
    if (username.length < 3) {
        displayError("usernameError", "Username must be at least 3 characters long.");
        hasError = true;
    } else {
        clearErrors("usernameError");
    }
    if (password.length < 6) {
        displayError("passwordError", "Password must be at least 6 characters long.");
        hasError = true;
    } else {
        clearErrors("passwordError");
    }
    if (firstName.length < 2) {
        displayError("firstNameError", "First name must be at least 2 characters long.");
        hasError = true;
    } else {
        clearErrors("firstNameError");
    }
    if (lastName.length < 2) {
        displayError("lastNameError", "Last name must be at least 2 characters long.");
        hasError = true;
    } else {
        clearErrors("lastNameError");
    }
    if (age.length < 1) {
        displayError("ageError", "Please enter your age.");
        hasError = true;
    } else {
        const ageValue = parseInt(age);
        if (ageValue < 18) {
            displayError("ageError", "You are too young to work here.");
            hasError = true;
        } else if (ageValue > 65) {
            displayError("ageError", "You should retire.");
            hasError = true;
        } else {
            clearErrors("ageError");
        }
    }
    if (!hasError) {
        let userData = JSON.parse(localStorage.getItem("userData")) || {};
        if (userData.hasOwnProperty(email)) {
            displayError("emailError", "Email is already registered.")
            return;
        }
        let newUser = {
            email: email,
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            age: age
        };
        userData[email] = newUser;
        localStorage.setItem("userData", JSON.stringify(userData));
        window.location.href = "../login/login.html";
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

function isValidEmail(email) {
    return email.indexOf('@') !== -1 && email.indexOf('.') !== -1;
}
const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
if (loggedInUserEmail) {
    let userData = JSON.parse(localStorage.getItem("userData")) || {};
    if (userData.hasOwnProperty(loggedInUserEmail)) {
        let user = userData[loggedInUserEmail];
        document.getElementById("email").value = user.email;
        document.getElementById("username").value = user.username;
        document.getElementById("password").value = user.password;
        document.getElementById("first_name").value = user.firstName;
        document.getElementById("last_name").value = user.lastName;
        document.getElementById("age").value = user.age;
        document.getElementById("update").addEventListener("click", function () {
            clearErrors();
            let hasError = false;
            let updatedEmail = document.getElementById("email").value;
            let updatedUsername = document.getElementById("username").value;
            let updatedPassword = document.getElementById("password").value;
            let updatedFirstName = document.getElementById("first_name").value;
            let updatedLastName = document.getElementById("last_name").value;
            let updatedAge = document.getElementById("age").value;
            if (updatedEmail.indexOf('@') === -1 || updatedEmail.indexOf('.') === -1) {
                displayError("emailError", "Please enter a valid email address.");
                hasError = true;
            } else {
                clearErrors("emailError");
            }
            if (updatedUsername.length < 3) {
                displayError("usernameError", "Username must be at least 3 characters long.");
                hasError = true;
            } else {
                clearErrors("usernameError");
            }
            if (updatedPassword.length < 6) {
                displayError("passwordError", "Password must be at least 6 characters long.");
                hasError = true;
            } else {
                clearErrors("passwordError");
            }
            if (updatedFirstName.length < 2) {
                displayError("firstNameError", "First name must be at least 2 characters long.");
                hasError = true;
            } else {
                clearErrors("firstNameError");
            }
            if (updatedLastName.length < 2) {
                displayError("lastNameError", "Last name must be at least 2 characters long.");
                hasError = true;
            } else {
                clearErrors("lastNameError");
            }
            if (updatedAge.length < 1) {
                displayError("ageError", "Please enter your age.");
                hasError = true;
            } else {
                const ageValue = parseInt(updatedAge);
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
                user.email = updatedEmail;
                user.username = updatedUsername;
                user.password = updatedPassword;
                user.firstName = updatedFirstName;
                user.lastName = updatedLastName;
                user.age = updatedAge;
                userData[loggedInUserEmail] = user;
                localStorage.setItem("userData", JSON.stringify(userData));
            }
            const successMessage = document.getElementById("succesful");
            successMessage.textContent = "Data updated successfully";
            successMessage.style.display = "block";
            setTimeout(function () {
                successMessage.textContent = "";
                successMessage.style.display = "none";
            }, 1500);
        });
    }
}

function clearErrors(id) {
    if (id) {
        const errorElement = document.getElementById(id);
        errorElement.textContent = "";
        errorElement.style.display = "none";
    } else {
        const errorElements = document.querySelectorAll("p[id$='Error']");
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
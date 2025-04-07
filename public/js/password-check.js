const name = document.getElementById("name");
const surname = document.getElementById("surname");
const email = document.getElementById("email");
const submitButton = document.querySelector(".register-button");
const passwordRules = document.querySelectorAll(".password-rules li");

const rules = {
    lengthRegex: /.{8,}/,
    upperCaseRegex: /[A-Z]/,
    numberRegex: /\d/,
    specialCharacterRegex: /[.!Q#$%^&*,.?:|<>]/,
};

document.addEventListener("DOMContentLoaded", function () {
    submitButton.style.pointerEvents = "none"; 
    submitButton.style.opacity = "0.5"; 
    
    const validatePasswordRules = () => {
        passwordRules.forEach(rule => {
            rule.style.color = "red"; 
        });

        let isPasswordValid = true;

        if (rules.lengthRegex.test(password.value)) {
            passwordRules[0].style.color = "#25db25";
        } else {
            isPasswordValid = false;
        }

        if (rules.upperCaseRegex.test(password.value)) {
            passwordRules[1].style.color = "#25db25";
        } else {
            isPasswordValid = false;
        }

        if (rules.numberRegex.test(password.value)) {
            passwordRules[2].style.color = "#25db25";
        } else {
            isPasswordValid = false;
        }

        if (rules.specialCharacterRegex.test(password.value)) {
            passwordRules[3].style.color = "#25db25";
        } else {
            isPasswordValid = false;
        }

        return isPasswordValid;
    };

    const validateForm = () => {
        if (name.value && surname.value && email.value && validatePasswordRules()) {
            submitButton.style.pointerEvents = "auto"; 
            submitButton.style.opacity = "1"; 
        } else {
            submitButton.style.pointerEvents = "none"; 
            submitButton.style.opacity = "0.5"; 
        }
    };

    name.addEventListener("input", validateForm);
    surname.addEventListener("input", validateForm);
    email.addEventListener("input", validateForm);
    password.addEventListener("input", function () {
        validatePasswordRules();
        validateForm(); 
    });
});

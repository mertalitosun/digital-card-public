const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const passwordConfirmContainer = document.querySelector(".password-confirm-container");
const submitButton = document.getElementById("submitButton");
const passwordRules = document.querySelectorAll(".password-rules li");

const rules = {
    lengthRegex: /.{8,}/,
    upperCaseRegex: /[A-Z]/,
    numberRegex: /\d/,
    specialCharacterRegex: /[.!Q#$%^&*,.?:|<>]/,
}

document.addEventListener("DOMContentLoaded", function (){
    passwordConfirmContainer.style.display = "none";
    confirmPassword.disabled = true
    submitButton.style.pointerEvents = "none";

    const validatePasswordRules = () => {
        passwordRules.forEach(rule=>{
            rule.style.color = "red";
        });

        if(rules.lengthRegex.test(newPassword.value)){
            passwordRules[0].style.color = "#25db25";
        }

        if(rules.upperCaseRegex.test(newPassword.value)){
            passwordRules[1].style.color = "#25db25";
        }

        if(rules.numberRegex.test(newPassword.value)){
            passwordRules[2].style.color = "#25db25";
        }

        if(rules.specialCharacterRegex.test(newPassword.value)){
            passwordRules[3].style.color = "#25db25";
        }
    }

    const validation = () => {
        validatePasswordRules();
        if(newPassword.value.length < 8){
            confirmPassword.disabled = true
        }else if(newPassword.value.length >= 8 && newPassword.value !== confirmPassword.value){
            
            confirmPassword.disabled = false;
            passwordConfirmContainer.style.display = "block";
            submitButton.style.pointerEvents = "none";
        }else{
            confirmPassword.disabled = false;
            passwordConfirmContainer.style.display = "none";
            submitButton.style.pointerEvents = "auto"
        }
    }

    newPassword.addEventListener("input", validation);
    confirmPassword.addEventListener("input", validation);
});
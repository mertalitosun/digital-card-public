const password = document.getElementById("password");
const eyeToggleBtn = document.getElementById("eye-toggleBtn");

document.addEventListener("DOMContentLoaded", () => {
    eyeToggleBtn.addEventListener("click", function () {
        if (password.type === "password") {
            password.type = "text"; 
            eyeToggleBtn.classList.remove("bi-eye-fill");  
            eyeToggleBtn.classList.add("bi-eye-slash");  
        } else {
            password.type = "password"; 
            eyeToggleBtn.classList.remove("bi-eye-slash"); 
            eyeToggleBtn.classList.add("bi-eye-fill"); 
        }
    });
});

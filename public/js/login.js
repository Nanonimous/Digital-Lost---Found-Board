function login() {
    let username = document.getElementById("gokul").value;
    let password = document.getElementById("12345").value;

    if (username && password) {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("main-container").style.display = "block";
    } else {
        alert("Enter valid credentials");
    }
}
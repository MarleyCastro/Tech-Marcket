const backHome = document.getElementById('backHome');

// Indicação a outra página 
backHome.addEventListener("click", function (e) {
    e.preventDefault();
    setTimeout(function () { window.location.href = "home.html";}, 2000);
})
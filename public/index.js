async function login(event){

    event.preventDefault();

    const username = document.getElementById("username").textContent;
    const password = document.getElementById("password").textContent;

    const response = await fetch('/api/login', {
         method: 'POST',
         headers: {'content-type':'application/json'},
         body: JSON.stringify({"username": username, "password": password})
    });

    const resBody = await response.json();
    console.log(resBody)
    if(response.status != 200){
        console.log(resBody.body);
        showToast(resBody.msg, 10000);
    } else {
        window.location.href = "http://localhost:4000/apartments/apartments.html";
    }
}

async function register(event){

    event.preventDefault();

    const username = document.getElementById("username").textContent;
    const password = document.getElementById("password").textContent;

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({"username": username, "password": password})
    });


    if(response.status === 409){
        const resBody = await response.json();
        showToast(resBody.msg, 100000);
    }
    
    console.log(response.body);
}


function showToast(message, duration = 1500) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;
    toastContainer.appendChild(toast);
  
    toast.style.display = "block";
    setTimeout(function () {
      toast.style.opacity = "0";
    }, duration);
  
    setTimeout(function () {
      toastContainer.removeChild(toast);
    }, duration + 500);
}

function checkButtonEnable() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");

    loginButton.disabled = !(user.length !== 0 && pass.length !== 0);
    registerButton.disabled = !(user.length !== 0 && pass.length !== 0);
}

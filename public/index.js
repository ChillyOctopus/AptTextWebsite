async function login(event){

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    checkButtonEnable();


    const response = await fetch('/api/login', {
         method: 'POST',
         headers: {'content-type':'application/json'},
         body: JSON.stringify({"username": username, "password": password})
    });

    const resBody = await response.json();
    console.log(resBody)
    if(response.status != 200){
        console.log(resBody.body);
        showToast(resBody.msg, 1000);
    } else {
        window.location.href = "https://startup.lethallegacy.click/apartments/apartments.html";
    }
}

async function register(event){

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    checkButtonEnable();

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({"username": username, "password": password})
    });


    const respBody = await response.json();
    console.log(respBody);
    if(response.status != 200){
        const resBody = await response.json();
        showToast(resBody.msg, 1000);
    } else {
        window.location.href = "https://startup.lethallegacy.click/apartments/apartments.html";
    }
    
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

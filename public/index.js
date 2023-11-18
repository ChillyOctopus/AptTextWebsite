async function login(event){

    event.preventDefault();

    window.location.href = "http://localhost:4000/apartments/apartments.html";

    const username = document.getElementById("username").textContent;
    const password = document.getElementById("password").textContent;

    const response = await fetch('/api/login', {
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

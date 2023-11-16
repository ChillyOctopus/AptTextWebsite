async function loadOutbound(){
    const response = await fetch('/api/settings');
    const responseJson = await response.json();

    for(const obj of responseJson){
        if(obj.type === 'contact'){
            document.getElementById("contact").setAttribute("Placeholder", obj.value);
        } else {
            document.getElementById("website").setAttribute("Placeholder", obj.value);
        }
    }
}

function enableSave() {
    const contactInput = document.getElementById("contact");
    const websiteInput = document.getElementById("website");
    const saveButton = document.getElementById("saveButton");

    if (!contactInput.value || !websiteInput.value) {
        saveButton.disabled = true;
    } else {
        saveButton.disabled = false;
    }
}

function enableSend() {
    const massMessageInput = document.getElementById("massMessage");
    const sendButton = document.getElementById("sendButton");

    if (!massMessageInput.value) {
        sendButton.disabled = true;
    } else {
        sendButton.disabled = false;
    }
}

async function send(){
    const massMessageInput = document.getElementById("massMessage");

    const response = await fetch('/text/'+massMessageInput.textContent, {
        method: 'POST',
    });

    massMessageInput.value = "";
    showToast("Sent to all numbers!");
    document.getElementById("sendButton").disabled = true;
}

async function save(){
    const contactInput = document.getElementById("contact");
    const websiteInput = document.getElementById("website");
 
    let contact = {"type": "contact", "value": contactInput.value};
    let website = {"type": "website", "value": websiteInput.value};

    const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify([contact, website])
    });

    const responseJson = await response.json();
    responseJson.forEach(obj =>{
        if(obj.type === 'contact'){
            contactInput.value = "";
            document.getElementById("contact").setAttribute("Placeholder", obj.value);
        } else {
            websiteInput.value = "";
            document.getElementById("website").setAttribute("Placeholder", obj.value);
        }
    });
    
    showToast("Saved your information!");
    document.getElementById("saveButton").disabled = true;
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

loadOutbound();
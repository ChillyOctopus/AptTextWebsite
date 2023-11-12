async function loadOutbound(){

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

    const response = await fetch('/text', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: massMessageInput.textContent
    });

    massMessageInput.value = "";
    massMessageInput.ariaPlaceholder = response.body;
    showToast("Sent to all numbers!");
    document.getElementById("sendButton").disabled = true;
}

async function save(){
    const contactInput = document.getElementById("contact");
    const websiteInput = document.getElementById("website");

    let contact = {"type": "contact", "value": contactInput.textContent};
    let website = {"type": "website", "value": websiteInput.textContent};

    const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify([contact, website])
    });

    contactInput.value = "";
    contactInput.ariaPlaceholder = response.body["contact"];
    websiteInput.value = "";
    websiteInput.ariaPlaceholder = response.body["website"];

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

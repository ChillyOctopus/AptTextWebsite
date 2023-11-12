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

function send(){
    const massMessageInput = document.getElementById("massMessage");
    massMessageInput.value = "";
    showToast("Sent to all numbers!");
    document.getElementById("sendButton").disabled = true;
}

function save(){
    const contactInput = document.getElementById("contact");
    const websiteInput = document.getElementById("website");
    contactInput.value = "";
    websiteInput.value = "";
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
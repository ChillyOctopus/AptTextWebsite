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

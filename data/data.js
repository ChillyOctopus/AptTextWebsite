function clearForm(){
    const numberForm = document.getElementById("number");
    numberForm.clearForm;
    const blockedNum = numberForm.value;
    numberForm.value = "";
    showToast("Blocked " + blockedNum)
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
  
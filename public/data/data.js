
async function loadData(){
  const response = await fetch('/api/data');
  dataArray = await response.json();

  for(const obj of dataArray){
    //Note: the ids of the elements we are setting the values to are the exact same as the "type" name we put into the database, so this works.
    const field = document.getElementById(obj.type);
    field.innerHTML = parseInt(obj.value);
  }
}

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

function checkInputValidity(inputField) {
  const blockButton = document.getElementById("blockButton");
  const validPhoneNumberPattern = /^(\d{10}|\d{3}-\d{3}-\d{4}|\(\d{3}\)\s*\d{3}-\d{4})$/;

  if (validPhoneNumberPattern.test(inputField.value)) {
      blockButton.disabled = false;
  } else {
      blockButton.disabled = true;
  }
}

async function blockNumber(){
  const number = document.getElementById("number");
  await fetch('/api/data', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(number),
  });
  document.getElementById("blockButton").disabled = true;
  clearForm();
}

loadData();
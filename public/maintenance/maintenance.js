async function loadData(){

  for(let i = 0; i < randNum(); i++){
    const rUserUrl = "https://randomuser.me/api/";
    const quoteUrl = "https://api.quotable.io/random";
    const randomUser = await fetch(rUserUrl).then((x) => x.json()).then((data) => data.results[0]);  
  
    const name = randomUser.name.first + " " + randomUser.name.last;
    const aptNum = Math.floor(Math.random() * (1000 - 0) + 0);
    const phoneNum = randomUser.cell;
    const issue = await fetch(quoteUrl).then((x) => x.json()).then((data) => data.content);
    const date = getRandomDateFormatted();
    const important = false;
  
    addMaintenance(name, aptNum, phoneNum, issue, date, important);
  }
}

// Function to add a new row to the table
async function addMaintenance(name, aptNum, phoneNum, issue, date, important) {
  const table = document.getElementById("maintenanceTable");

  // Create a new table row and populate it with the form values
  const newRow = table.insertRow(2); // 2 places the new row right under the first header row (which is empty to let zebra stripes alternate how we want)
  newRow.setAttribute("data-date", date);

  let starData = "";
  if(important){
    starData = '<div class="star-container" style="width: 100%; height: max-content;" onclick="switchStar(event)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="star filled-star" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path></svg></div>'
  } else {
    starData = '<div class="star-container" style="width: 100%; height: max-content;" onclick="switchStar(event)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="star outline-star" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path></svg></div>'
  }

  newRow.innerHTML = `
    <td>${name}</td>
    <td>${aptNum}</td>
    <td>${phoneNum}</td>
    <td>${issue}</td>
    <td>${date}</td>
    <td>${starData}</td>
    <td><button type="button" class="btn btn-info send-button">Send</button></td>
    <td><button type="button" class="btn btn-danger delete-button">Clear</button></td>
  `;

  // Add the "star" class to the star element
  const newStar = newRow.querySelector(".star");
  newStar.classList.add("star");

  // Add an event listener to the new "Send" button
  const sendButton = newRow.querySelector(".send-button");
  sendButton.addEventListener("click", function () {
      showToast("Sent to maintenance!");
  });

  // Add an event listener to the new "Delete" button
  const deleteButton = newRow.querySelector(".delete-button");
  deleteButton.addEventListener("click", function () {
      deleteMaintenance(newRow);
  });

  sortTable(); // Sort the table after adding the new row
  const response = await fetch('/maintenance', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify
  });
}


// Function to switch the star to whatever we don't have
function switchStar(event) {
    const starContainer = event.currentTarget;
    const star = starContainer.querySelector('.star');

    // Check if the star is currently filled or outlined
    if (star.classList.contains('filled-star')) {
        // Switch to an outlined star
        star.innerHTML = '<path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>';
        star.classList.remove('filled-star');
        star.classList.add('outline-star');
    } else {
        // Switch to a filled star
        star.innerHTML = '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>';
        star.classList.remove('outline-star');
        star.classList.add('filled-star');
    }

    sortTable();
}

// Function to delete a row when the "Delete" button is clicked
function deleteMaintenance(row) {
    const table = document.getElementById("maintenanceTable");
    table.deleteRow(row.rowIndex);
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

function sortTable() {
  const table = document.getElementById("maintenanceTable");
  const rows = Array.from(table.rows).slice(2); // Exclude the header rows

  // Custom sorting function
  rows.sort(function (a, b) {
    const starA = a.querySelector(".star")?.classList.contains("filled-star");
    const starB = b.querySelector(".star")?.classList.contains("filled-star");
    const dateA = new Date(a.getAttribute("data-date"));
    const dateB = new Date(b.getAttribute("data-date"));

    // Sort by filled stars (filled stars first), and then by date in descending order
    if (starA && !starB) return -1;
    if (!starA && starB) return 1;
    return dateB - dateA; // Compare dates in descending order (latest first)
  });

  // Reorder the table rows
  rows.forEach((row) => table.appendChild(row));
}



// Function to generate a random date formatted as MM/DD/YYYY
function getRandomDateFormatted() {
  const minDate = new Date(2000, 0, 1); // January 1, 2000
  const maxDate = new Date(2022, 11, 31); // December 31, 2022
  const randomDate = new Date(minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime()));

  const month = (randomDate.getMonth() + 1).toString().padStart(2, '0');
  const day = randomDate.getDate().toString().padStart(2, '0');
  const year = randomDate.getFullYear();

  return `${month}/${day}/${year}`;
}

function randNum(){
  return Math.floor(Math.random() * (12 - 2) + 2);
}

loadData();
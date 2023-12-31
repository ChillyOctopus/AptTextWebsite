async function loadApartments(){

  // Get the apartments from the service
  const response = await fetch('/api/apartments');
  const apartments = await response.json();

  displayApartments(apartments);
}

function displayApartments(apartments){
    apartments.forEach((row) => {
        addListing(row.type, row.gender, row.flatmates, row.price, row.available);
    });
}

async function submitListingFromForm(){
  // Get the values from the form
  const type = document.getElementById("type").value;
  const gender = document.getElementById("gender").value;
  const flatmates = document.getElementById("flatmates").value;
  const price = document.getElementById("price").value + '$';
  const available = document.getElementById("available").value;

  enableSave();
  addListing(type, gender, flatmates, price, available);
}

function addListing(type, gender, flatmates, price, available) {
  document.getElementById("addListingButton").disabled = true;
  const table = document.getElementById("listingTable");
  const form = document.getElementById("addListingForm");

  // Create a new table row and populate it with the form values
  const newRow = table.insertRow(2); // 2 places the new row right under the first header row (which is empty to let zebra stripes alternate how we want)
  newRow.innerHTML = `
    <td>${type}</td>
    <td>${gender}</td>
    <td>${flatmates}</td>
    <td>${price}</td>
    <td>${available}</td>
    <td>
        <div class="btn-group-vertical" role="group" aria-label="modify">
        <button type="button" class="btn btn-success btn-add" aria-label="Left Align" style="margin: 3px; width: 40px; height: 30px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
            </svg>
        </button>
        <button type="button" class="btn btn-warning btn-subtract" aria-label="Left Align" style="margin: 3px; width: 40px; height: 30px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
        </button>
        </div>
    </td>
    <td style="vertical-align: middle;"><button type="button" class="btn btn-danger delete-button">Delete</button></td>
  `;

    let increaseTimer;
    let decreaseTimer;
    const timeGapOfRepeatedIncreases = 75;

    // Add an event listener to the new "Delete" button (one click)
    const deleteButton = newRow.querySelector(".delete-button");
    deleteButton.addEventListener("click", function () {
        deleteListing(newRow);
    });

    // Add an event listener to the new "add" button (one click)
    const addButton = newRow.querySelector(".btn-add");
    addButton.addEventListener("click", function () {
        increaseAvailability(newRow);
    });
    
    // Add an event listener to the new "add" button (hold click)
    addButton.addEventListener("mousedown", function () {
        increaseTimer = setInterval(function () {
            increaseAvailability(newRow);
        }, timeGapOfRepeatedIncreases); // Adjust the interval as needed
    });

    // Stop increasing when the mouse button is released (hold release)
    addButton.addEventListener("mouseup", function () {
        clearInterval(increaseTimer);
    });

    // Add an event listener to the new "subtract" button (one click)
    const subtractButton = newRow.querySelector(".btn-subtract");
        subtractButton.addEventListener("click", function () {
        decreaseAvailability(newRow);
    });

    // Add an event listener to the new "subtract" button (hold click)
    subtractButton.addEventListener("mousedown", function () {
        decreaseTimer = setInterval(function () {
            decreaseAvailability(newRow);
        }, timeGapOfRepeatedIncreases); // Adjust the interval as needed
    });

    // Stop decreasing when the mouse button is released (hold release)
    subtractButton.addEventListener("mouseup", function () {
        clearInterval(decreaseTimer);
    });
    
    // Reset the form fields
    form.reset();
}

// Function to delete a row when the "Delete" button is clicked
function deleteListing(row) {
    enableSave();
    const table = document.getElementById("listingTable");
    table.deleteRow(row.rowIndex);
}
  
//Function to increase an apartment's availability when the up button is clicked
function increaseAvailability(row) {
    changeAvailability(row, 1);
}

//Function to decrease an apartment's availability when the down button is clicked
function decreaseAvailability(row) {
    changeAvailability(row, -1);
}

//General function to change availability
function changeAvailability(row, amount){
    enableSave();
    const cellIndex = 4; // Index of the "available" cell in the row (0-based)
    const cell = row.cells[cellIndex]; // Use row.cells to access the cell
    const current = cell.textContent;
    cell.textContent = parseInt(current) + amount;
}

function enableSave(){
    const button = document.getElementById("saveButton");
    button.disabled = false;
}

async function save(){
    const button = document.getElementById("saveButton");
    button.disabled = true;
    var table = getAllApartments();
    await fetch('/api/apartments', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(table),
    });
}

function checkAddListingEnabled() {
    const addButton = document.getElementById("addListingButton");
    const type = document.getElementById("type").value;
    const gender = document.getElementById("gender").value;
    const flatmates = document.getElementById("flatmates").value;
    const price = document.getElementById("price").value;
    const available = document.getElementById("available").value;

    addButton.disabled = ( ! (
        (type === "Private" || type === "Shared") &&
        (gender === "M" || gender === "F" || gender === "N/A") &&
        flatmates > 0 &&
        price > 0 &&
        available > 0
    ));
}

function getAllApartments(){
    let rows = document.getElementById("listingTable").rows;
    let returnMe = [];
    for(let i = 2; i < rows.length; i++){
        returnMe.push(
            {"type":rows[i].cells[0].innerHTML,
             "gender":rows[i].cells[1].innerHTML,
             "flatmates":rows[i].cells[2].innerHTML,
             "price":rows[i].cells[3].innerHTML,
             "available":rows[i].cells[4].innerHTML});
    }

    return returnMe;
}

loadApartments();
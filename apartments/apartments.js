function addListing() {
  const table = document.getElementById("listingTable");
  const form = document.getElementById("addListingForm");

  // Get the values from the form
  const type = document.getElementById("type").value;
  const gender = document.getElementById("gender").value;
  const flatmates = document.getElementById("flatmates").value;
  const price = document.getElementById("price").value;
  const available = document.getElementById("available").value;

  // Create a new table row and populate it with the form values
  const newRow = table.insertRow(2); // 2 places the new row right under the first header row (which is empty to let zebra stripes alternate how we want)
  newRow.innerHTML = `
    <td>${type}</td>
    <td>${gender}</td>
    <td>${flatmates}</td>
    <td>${price}$</td>
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
    </td>
  `;

    // Add an event listener to the new "Delete" button
    const deleteButton = newRow.querySelector(".delete-button");
    deleteButton.addEventListener("click", function () {
        deleteListing(newRow);
    });

    //Add an event listener to the new "add" button
    const addButton = newRow.querySelector(".btn-add");
    addButton.addEventListener("click", function (){
        increaseAvailability(newRow);
    });

    //Add an event listener to the new "subtract" button
    const subtractButton = newRow.querySelector(".btn-subtract");
    addButton.addEventListener("click", function (){
        decreaseAvailability(newRow);
    });

  // Reset the form fields
  form.reset();
}

// Function to delete a row when the "Delete" button is clicked
function deleteListing(row) {
    const table = document.getElementById("listingTable");
    table.deleteRow(row.rowIndex);
}
  
//Function to increase an apartments availability when the up button is clicked
function increaseAvailability(row){
    const table = document.getElementById("listingTable");
    const current = table.row. available;
    table.row.available = current + 1;
}
 
//Function to decrease an apartments availability when the up button is clicked
function decreaseAvailability(row){
    const table = document.getElementById("listingTable");
    const current = table.row.available;
    table.row.available = current - 1;
}

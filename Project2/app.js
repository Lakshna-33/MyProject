const editTable = document.getElementById('editTable'); // Take the table body element (<tbody id="editTable">) where student rows will be shown

let students = JSON.parse(localStorage.getItem('students')) || []; // Load the array of student records from localStorage, or make a new empty array if none


// -------------- FUNCTION: renderEditTable --------------

function renderEditTable() {   // This repaints the entire table based on the current "students" array
  editTable.innerHTML = ''; // clear existing rows

  
  students.forEach((student, i) => { // This repaints the entire table based on the current "students" array
    const row = document.createElement('tr'); 
    row.innerHTML = `
      <td class="border p-2"><input value="${student.name}" disabled class="border p-1 rounded w-full"></td>
      <td class="border p-2"><input value="${student.id}" disabled class="border p-1 rounded w-full"></td>
      <td class="border p-2"><input value="${student.email}" disabled class="border p-1 rounded w-full"></td>
      <td class="border p-2"><input value="${student.contact}" disabled class="border p-1 rounded w-full"></td>
      <td class="border p-2"><input type="date" value="${student.dob}" disabled class="border p-1 rounded w-full"></td>
      <td class="border p-2"><input value="${student.house}" disabled class="border p-1 rounded w-full"></td>
      <td class="border p-2"><input value="${student.city}" disabled class="border p-1 rounded w-full"></td>
      <td class="border p-2"><input value="${student.pincode}" disabled class="border p-1 rounded w-full"></td>
      <td class="border p-2">
        <button onclick="editStudent(${i})" class="mr-2 text-blue-300 font-medium">Edit</button>
        <button onclick="deleteStudent(${i})" class="text-blue-300 font-medium">Delete</button>
      </td>`;
    editTable.appendChild(row);
  });
}





// -------------- FUNCTION: editStudent --------------

function editStudent(index) {   // Triggered when user clicks "Edit"; replaces that row with editable fields and Save/Cancel buttons
  if (!confirm('Are you sure you want to Edit this student?')) return; // cancel if user declines

  const row = editTable.children[index];        // get the corresponding <tr>
  const student = students[index];              // get the student data object

  //  HTML for the row with input fields (enabled) and Save or Cancel it
  row.innerHTML = `   
    <td class="border p-2"><input id="in-name-${index}"   value="${student.name}"   class="border p-1 rounded w-full text-gray-700" required/></td>
    <td class="border p-2"><input id="in-id-${index}"     value="${student.id}"     class="border p-1 rounded w-full text-gray-700" required/></td>
    <td class="border p-2"><input id="in-email-${index}"   value="${student.email}"  class="border p-1 rounded w-full text-gray-700" required/></td>
    <td class="border p-2"><input id="in-contact-${index}" value="${student.contact}" class="border p-1 rounded w-full text-gray-700" required/></td>
    <td class="border p-2"><input type="date" id="in-dob-${index}" value="${student.dob}"  class="border p-1 rounded w-full text-gray-700" required/></td>
    <td class="border p-2"><input id="in-house-${index}"   value="${student.house}"   class="border p-1 rounded w-full text-gray-700" required/></td>
    <td class="border p-2"><input id="in-city-${index}"    value="${student.city}"    class="border p-1 rounded w-full text-gray-700" required/></td>
    <td class="border p-2"><input id="in-pincode-${index}" value="${student.pincode}" class="border p‑1 rounded w-full text-gray-700" required/></td>

    <td class="border p-2">
      <button onclick="saveStudent(${index})" class="mr-2 text-green-400 font-medium">Save</button>
      <button onclick="renderEditTable()" class="text-gray-400 font-medium">Cancel</button>
    </td>`;
}




// -------------- FUNCTION: validateeditTable --------------

function validateeditTable(data) { // Verifies that all input is present and correctly formatted before saving
  const nameRegex    = /^[a-zA-Z\s]{3,20}$/;    // 3–20 letters/spaces
  const idRegex      = /^[a-zA-Z0-9]{6,10}$/;   // alphanumeric, 6–10 chars
  const emailRegex   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // basic email pattern
  const contactRegex = /^[0-9]{10}$/;           // exactly 10 digits
  const pinRegex     = /^[0-9]{6}$/;            // exactly 6 digits

  // First check that none of the required fields is empty or just blank spaces
  if (!data.name || !data.id || !data.email || !data.contact || !data.dob || !data.house || !data.city || !data.pincode) {
    alert("All fields are required");
    return false;
  }

  // Then test each field against its regex; show specific message if invalid
  if (!nameRegex.test(data.name))      { alert("Invalid name. Only letters and 3–20 characters allowed.");    return false; }
  if (!idRegex.test(data.id))          { alert("Student ID must be 6–10 characters long.");                 return false; }
  if (!emailRegex.test(data.email))    { alert("Invalid email address.");                                 return false; }
  if (!contactRegex.test(data.contact)) { alert("Contact must be 10 digits.");                              return false; }
  if (!pinRegex.test(data.pincode))     { alert("Pincode must be exactly 6 digits.");                      return false; }

  return true; // all validations passed
}





// -------------- FUNCTION: saveStudent --------------

function saveStudent(index) {  // Triggered on "Save", reads edited input, validates, updates, saves to localStorage and redraws table
  
  const name    = document.getElementById(`in-name-${index}`).value.trim();  // Read values from each input field for this row
  const id      = document.getElementById(`in-id-${index}`).value.trim();
  const email   = document.getElementById(`in-email-${index}`).value.trim();
  const contact = document.getElementById(`in-contact-${index}`).value.trim();
  const dob     = document.getElementById(`in-dob-${index}`).value.trim();
  const house   = document.getElementById(`in-house-${index}`).value.trim();
  const city    = document.getElementById(`in-city-${index}`).value.trim();
  const pincode = document.getElementById(`in-pincode-${index}`).value.trim();

  const data = { name, id, email, contact, dob, house, city, pincode };

  if (!validateeditTable(data)) return; // If validation fails, abort save

  Object.assign(students[index], data); // Copy edited fields into original student object
  localStorage.setItem('students', JSON.stringify(students)); // Persist array to localStorage
  alert("Student details updated successfully!");
  renderEditTable(); // Re-render the table showing updated, non-editable fields
}





// -------------- FUNCTION: deleteStudent --------------

function deleteStudent(val) {   // Called when the user clicks "Delete": confirms, removes from array, saves and redraws
  if (!confirm('Are you sure you want to delete this student?')) return; // do not continue if cancelled

  students.splice(val, 1); // remove the selected one element from array at position 'val'
  localStorage.setItem('students', JSON.stringify(students)); // update storage
  renderEditTable(); // refresh table display
}

renderEditTable(); // Initial rendering of table when page loads

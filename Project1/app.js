const form = document.getElementById('studentForm');  //Take the form element by its id "studentForm" so we can use it for submission

const studentTable = document.getElementById('studentTable'); // Grab the tbody where student rows will be shown dynamically later

const captchaDisplay = document.getElementById('captchaDisplay'); // Grab the span (or element) where we will display the captcha question for users to solve

const clock = document.getElementById('clock'); // Grab the clock element where we will keep updating the current time (for a live clock)

let students = JSON.parse(localStorage.getItem('students')) || []; // Try to load previously saved students from localStorage (if any), or start with an empty list

let currentCaptchaAnswer = ''; // Placeholder for storing the correct answer to the captcha so we can verify later



  // -------------- Function: captcha --------------

function generateCaptcha() {   // Generates a simple math captcha (e.g., "adding 2 nos") and stores the correct result for validation
  const a = Math.floor(Math.random() * 10); // random digit 0 to 9
  const b = Math.floor(Math.random() * 10); // another random digit 0 to 9
  currentCaptchaAnswer = (a + b).toString(); // store answer as string for comparison with input
  captchaDisplay.textContent = `${a} + ${b}`; // show question on page for user
}





   // -------------- FUNCTION: logout -------------- 

function logout() {   // Logs out user from home page by replacing the entire page with a "Thank You" message
  document.body.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-size: 48px;
      color: #333;">
      Thank You!!!!
    </div>`; // adds a big centered message
  alert(("Are you sure you want to logout?")); // then shows a confirmation popup (a bit late in the flow)
}




 // ------------ FUNCTION: clock -------------

function updateClock() {    // Updates the clock element every second to show current India time
  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }); // Indian format & timezone
  clock.textContent = ` ${now}`; // display it (with a leading space for visual padding)
}
setInterval(updateClock, 1000); // Call updateClock every 1000 ms (1 second) to keep the time live
updateClock(); // Run it once immediately so you see time right away on page load





 // ------------- FUNCTION: renderstudents ------------
function renderStudents() {     // Clears previous student rows and then builds new ones from the `students` array
  studentTable.innerHTML = ''; // empty the table body
  students.forEach((student) => {
    const row = document.createElement('tr'); // create a new row for each student
    row.innerHTML = `                               
      <td class="border p-2">${student.name}</td>   
      <td class="border p-2">${student.id}</td>
      <td class="border p-2">${student.email}</td>
      <td class="border p-2">${student.contact}</td>
      <td class="border p-2">${student.dob}</td>
      <td class="border p-2">${student.house}, ${student.city}, ${student.pincode}</td>
    `; 
    studentTable.appendChild(row);      // then insert the row into the table body
  });
}




 // ------------ FUNCTION: validateform -------------
function validateForm(data) {         // Validates that each field matches its requirements using regular expressions
  const nameRegex = /^[a-zA-Z\s]{3,20}$/;          // accepts letters and spaces, length must be 3–20
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // accept only basic email format with "@"
  const contactRegex = /^[0-9]{10}$/;               // accept exactly 10 digits only
  const idRegex = /^[a-zA-Z0-9]{6,10}$/;            // accept alphanumeri and length 6–10 on;y
  const pinRegex = /^[0-9]{6}$/;                    // accepts exactly 6 digits only

  if (!nameRegex.test(data.name))        //test the value of the above condition  
    return alert("Invalid name. Only letters and 3–20 characters allowed."); // return alert invalid name if test fails
  if (!idRegex.test(data.id)) 
    return alert("Student ID must be 6–10 characters long."); // return alert invalid name if test fails
  if (!emailRegex.test(data.email)) 
    return alert("Invalid email address."); // return alert invalid email if test fails
  if (!contactRegex.test(data.contact)) 
    return alert("Contact must be 10 digits."); // return alert invalid contact if test fails
  if (!pinRegex.test(data.pincode)) 
    return alert("Pincode must be exactly 6 digits."); // return alert invalid pincode if test fails
  if (data.captcha !== currentCaptchaAnswer) 
    return alert("Incorrect captcha answer."); // return alert incorrect captcha if test fails

  return true; // if all passed, return true to continue
}



 // ----------------- form Submit ----------------
form.onsubmit = (e) => {   // Handle form submission event – when user clicks the "Register" button
  e.preventDefault(); // prevent page reload (default browser form submission)

  
  const data = {   // Collect all field values from the form, trimming whitespace as needed
    name: form.studentName.value.trim(),
    id: form.studentID.value.trim(),
    email: form.email.value.trim(),
    contact: form.contact.value.trim(),
    dob: form.dob.value,
    captcha: form.captcha.value.trim(),
    house: form.house.value.trim(),
    city: form.city.value.trim(),
    pincode: form.pincode.value.trim(),
  };

  if (!validateForm(data)) return; // donot continue if validation fails

  students.push(data); // add the valid student entry into the array
  localStorage.setItem('students', JSON.stringify(students)); // save updated array to localStorage
  renderStudents(); // refresh the table to show the new student
  form.reset(); // clear the form fields for next entry
};

renderStudents();    // On page reload, show existing students value
generateCaptcha();   // On page reload, generate a new captcha 
     
      
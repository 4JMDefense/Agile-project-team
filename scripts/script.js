const darkThemeButton = document.querySelector('.dark-Theme');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const logo = document.querySelector('#logo');
const allButtons = document.querySelectorAll('button');
const importBtn = document.getElementById("fileInput");
const noteTitle = document.querySelector('.notes-title');
const noteTextarea = document.querySelector('.notes-body');
const notearea= document.querySelector('.notes-preview');

// Dark mode toggle button functionality 

darkThemeButton.addEventListener('click', function() {
  sidebar.classList.toggle('dark');
  mainContent.classList.toggle('dark');
  notearea.classList.toggle('dark')
  noteTextarea.classList.toggle('dark');
  noteTitle.classList.toggle('dark');


  allButtons.forEach((button) => {
    button.classList.toggle('button-border-dark');
  });


  if (darkThemeButton.textContent === 'Dark Theme') {
    darkThemeButton.textContent = 'Light Theme';
    darkThemeButton.classList.add('light-Theme-button');
    logo.src = "img/github-mark-white.png";
  } else {
    darkThemeButton.textContent = 'Dark Theme';
    darkThemeButton.classList.remove('light-Theme-button')
    logo.src = "img/github-mark.png";

  }
});

// Sidebar functionality - commented out for now

// const saveButton = document.querySelector('.save-button');
// const newnoteButton = document.querySelector('.new-note');

// newnoteButton.addEventListener('click', function() {
//     noteTextarea.value = '';
//     noteTitle.value = '';
// });

// const notesArray = [
//     {title: "Welcome to Notify!", body: "Notify instructions go here"},
//   ];
// const sidebarList = document.querySelector(".sidebar ul");
  
// saveButton.addEventListener("click", function() {
//     if (noteTitle) {
//         const newNote = {title: noteTitle.value, body: noteTextarea.value};
    
//         notesArray.push(newNote);
    
//         const newListItem = document.createElement("li");
//         newListItem.textContent = newNote.title;
    
//         sidebarList.appendChild(newListItem);
    
//         noteTextarea.value = "";
//         noteTitle.value = "";
//     }
// });



// import button functionality 

// Add a click event listener to the "importBtn" button to handle importing files
importBtn.addEventListener("click", async () => {
  // Create a new input element of type "file" to open the file dialog
  const fileInput = document.createElement("input");
  fileInput.type = "file";

  // Add a "change" event listener to the file input element to handle file selection
  fileInput.addEventListener("change", async (event) => {
    // Get the first file selected from the file input
    const file = event.target.files[0];
    // Create a new FormData object to hold the file data
    const formData = new FormData();
    formData.append("file", file);

    // Set up the fetch options for sending the file data to the server
    const fetchOptions = {
      method: "POST",
      body: formData,
    };

    // Try to send the file to the server and handle the response
    try {
        // Send the file to the "/api" endpoint using the fetch options
      const response = await fetch("/api", fetchOptions);

        // If the server responds with a successful status, process the response
      if (response.ok) {
        // Get the text content of the response
        const contents = await response.text();
        // Get the title of the note by removing the ".txt" extension from the file name
        const title = file.name.replace(".txt", "");
        // Call the "createNote" function with the title and contents
        createNote(title, contents);
        // If the server responds with an error status, log the error
      } else {
        console.error("Error uploading file:", response.statusText);
      }
    // Catch any errors that occur during the fetch process and log them
    } catch (e) {
      console.error(e);
    }

  });

});

// Add a "DOMContentLoaded" event listener to the document to handle file input changes
document.addEventListener("DOMContentLoaded", () => {
    // Get the file input element with the ID "fileInput"
    const fileInput = document.getElementById("fileInput");

    // Add a "change" event listener to the file input element to handle file selection
    fileInput.addEventListener("change", async (event) => {
    // Get the first file selected from the file input
    const file = event.target.files[0];
    // Create a new FileReader instance to read the contents of the file
    const reader = new FileReader();
    
    // Add a "load" event listener to the FileReader instance to handle the file read process
    reader.onload = (e) => {
        // Get the contents of the file from the FileReader instance
        const contents = e.target.result;
        // Get the textarea element with the class ".notes-body" and set its value to the file contents
        const textarea = document.querySelector(".notes-body");
        textarea.value = contents;
    };
    // Read the contents of the file as text using the FileReader instance
    reader.readAsText(file);
    // Simulate a click event on the file input element to open the file dialog
    fileInput.click();
  });
});


// Create note

// Function to add a new note to the notes list in the sidebar
function addNoteToList(title, body, updated) {
  const notesList = document.getElementById("notesList");

  // Create a new note list item
  const listItem = document.createElement("div");
  listItem.classList.add("notes-list-item");

  // Add the title, body, and updated date to the new note list item
  const smallTitle = document.createElement("div");
  smallTitle.classList.add("notes-small-title");
  smallTitle.textContent = title;
  listItem.appendChild(smallTitle);

  const smallBody = document.createElement("div");
  smallBody.classList.add("notes-small-body");
  smallBody.textContent = body;
  listItem.appendChild(smallBody);

  const smallUpdated = document.createElement("div");
  smallUpdated.classList.add("notes-small-updated");
  smallUpdated.textContent = updated;
  listItem.appendChild(smallUpdated);

  // Append the new note list item to the notes list
  notesList.appendChild(listItem);
}

// Add a click event listener to the save button
document.getElementById("saveButton").addEventListener("click", () => {
  const title = document.querySelector(".notes-title").value;
  const body = document.querySelector(".notes-body").value;
  const updated = new Date().toLocaleString();

  // Call the addNoteToList function with the title, body,
  addNoteToList(title, body, updated);

  // Clear the note title and body input fields
  document.querySelector(".notes-title").value = "";
  document.querySelector(".notes-body").value = "";
  });




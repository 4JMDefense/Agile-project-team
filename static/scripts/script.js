const darkThemeButton = document.querySelector('.dark-Theme');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const logo = document.querySelector('#logo');
const allButtons = document.querySelectorAll('button');
const importBtn = document.getElementById("fileInput");
const noteTitle = document.querySelector('.notes-title');
const noteTextarea = document.querySelector('.notes-body');
const notearea= document.querySelector('.notes-preview');

// "/" command functionality
function commands(event) {
  const noteTextarea = document.querySelector(".notes-body");
  // bullet
  noteTextarea.value = noteTextarea.value.replace("/bullet", "•");



  noteTextarea.value = noteTextarea.value.replace("/date", new Date().toLocaleString());
  noteTextarea.value = noteTextarea.value.replace("/time", new Date().toLocaleTimeString());
  noteTextarea.value = noteTextarea.value.replace("/day", new Date().toLocaleDateString());
  noteTextarea.value = noteTextarea.value.replace("/month", new Date().toLocaleString('en-US', {month: 'long'}));
  noteTextarea.value = noteTextarea.value.replace("/year", new Date().getFullYear());
}
// If the user enters the space key, run the commands function
noteTextarea.addEventListener("keyup", function(event) {
  if (event.keyCode === 32) {
    commands(event);
  }
});


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

// New note button functionality
const newnoteButton = document.querySelector('.new-note');

newnoteButton.addEventListener('click', function() {
  noteTitle.value = '';
  noteTextarea.value = '';
});


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

// Add a click event listener to the save button
document.getElementById("saveButton").addEventListener("click", () => {
  const title = document.querySelector(".notes-title").value;
  const body = document.querySelector(".notes-body").value;
  const updated = new Date().toLocaleString();

  const data = {
    title: title,
    body: body
  };

  fetch("/save", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message);})
  .catch(error => {
    console.error("Error:", error);
  });

  // Call the addNoteToList function with the title, body,
  addNoteToList(title, body, updated);

  // Clear the note title and body input fields
  document.querySelector(".notes-title").value = "";
  document.querySelector(".notes-body").value = "";
  });

  function addNoteToList(title, body, updated) {
    const noteItem = document.createElement("div");
    noteItem.classList.add("notes-list-item");
  
    // Format the date as "Day hh:mm am/pm"
    const formattedDate = new Date(updated).toLocaleString('en-US', {weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true});
  
    noteItem.innerHTML = `
      <div class="notes-small-title">${title}</div>
      <div class="notes-small-body">${body}</div>
      <div class="notes-small-updated">${formattedDate}</div>
    `;
  
    // Add a click event listener to the note item
    noteItem.addEventListener("click", () => {
      // Remove the active class from the currently active note list item
      const activeNote = document.querySelector(".notes-list-item--active");
      if (activeNote) {
        activeNote.classList.remove("notes-list-item--active");
      }
  
      // Add the active class to the clicked note list item
      noteItem.classList.add("notes-list-item--active");
  
      // Update the note title and body input fields
      document.querySelector(".notes-title").value = title;
      document.querySelector(".notes-body").value = body;
    });

      // Add a double click event listener to the note item
      noteItem.addEventListener("dblclick", () => {
        // Display a confirmation dialog to the user
        if (confirm("Are you sure you want to delete this note?")) {
          // If the user confirms, remove the note item from the DOM
          noteItem.remove();
        }
      });
  
    document.querySelector(".notes-list").appendChild(noteItem);
  }


    

  document.addEventListener("DOMContentLoaded", () => {
    const initialTitle = "Welcome to Notify!";
    const initialBody = "Instructions go here";
    const initialUpdated = new Date(); // You can set a specific date if you want
  
    // Call the addNoteToList function with the initial title, body, and updated date
    addNoteToList(initialTitle, initialBody, initialUpdated);
  
    // Set the initial note as active
    document.querySelector(".notes-list-item").classList.add("notes-list-item--active");
  
    // Update the note title and body input fields with the initial note
    document.querySelector(".notes-title").value = initialTitle;
    document.querySelector(".notes-body").value = initialBody;
  });

  document.addEventListener("DOMContentLoaded", () => {
    fetch("/notes")
        .then(response => response.json())
        .then(notes => {
            for (const note of notes) {
                addNoteToList(note.title, note.body, note.updated);
            }
        })
        .catch(error => console.error("Error:", error));
});
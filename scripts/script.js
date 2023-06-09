var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
    this.classList.toggle("active");

    var dropdownContent = this.nextElementSibling;

    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
    //if there is no item, notice user to add item

  });
}

function updateBinMessage() {
  const binDropdown = document.querySelector(".dropdown-container");
  const emptyBinMessage = binDropdown.querySelector(".empty-bin-message");
  const noteItems = binDropdown.getElementsByClassName("notes-list-item");
  
  if (noteItems.length > 0) {
    // If there are any note items in the bin, hide the message
    emptyBinMessage.style.display = "none";
  } else {
    // Otherwise, show the message
    emptyBinMessage.style.display = "block";
  }
}




// "/" command functionality

const noteTextarea = document.querySelector('.notes-body');

function commands(event) {
  // bullet
  noteTextarea.value = noteTextarea.value.replace("/wbullet", "○");
  noteTextarea.value = noteTextarea.value.replace("/bullet", "•");
  // boxes
  noteTextarea.value = noteTextarea.value.replace("/box", "☐");
  noteTextarea.value = noteTextarea.value.replace("/check", "☑");
  noteTextarea.value = noteTextarea.value.replace("/cross", "☒");
  // formatting
  noteTextarea.value = noteTextarea.value.replace("/todo", "☐"); 

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
const darkThemeButton = document.querySelector('.dark-Theme');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const logo = document.querySelector('#logo');
const allButtons = document.querySelectorAll('button');
const noteTitle = document.querySelector('.notes-title');
const notearea= document.querySelector('.notes-preview');

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




// Define a variable to keep track of the currently active note
let activeNote = null;

// New note button functionality
const newNoteButton = document.querySelector('.new-note');
newNoteButton.addEventListener('click', function() {
  // Create a new note item and add it to the notes list
  const noteItem = document.createElement("div");
  noteItem.classList.add("notes-list-item");

  // Add the note item to the notes list
  document.querySelector(".notes-list").appendChild(noteItem);

  // Clear the note title and body input fields
  document.querySelector(".notes-title").value = "";
  document.querySelector(".notes-body").value = "";

  // Set the new note as the active note
  activeNote = noteItem;
});

// Add a click event listener to the save button


// Define a function to sort the notes
function sortNotes() {
  const notesList = document.querySelector(".notes-list");
  const binDropdown = document.querySelector(".dropdown-container");
  const notesArray = Array.from(notesList.children).filter(note => !note.classList.contains("deleted-note"));
  const option = document.getElementById("sortSelection").value;

  if (option === "title") {
    notesArray.sort((a, b) => {
      const aTitleElement = a.querySelector(".notes-small-title");
      const bTitleElement = b.querySelector(".notes-small-title");
      if (!aTitleElement || !bTitleElement) return 0;
      const aTitle = aTitleElement.textContent.toUpperCase();
      const bTitle = bTitleElement.textContent.toUpperCase();
      if (aTitle < bTitle) {
        return -1;
      } else if (aTitle > bTitle) {
        return 1;
      } else {
        return 0;
      }
    });
  } else if (option === "recent") {
    notesArray.sort((a, b) => {
      const aDateElement = a.querySelector(".notes-small-updated");
      const bDateElement = b.querySelector(".notes-small-updated");

      // if one of the elements doesn't exist or doesn't contain a proper date-time string, stop
      if (!aDateElement || !bDateElement || isNaN(Date.parse(aDateElement.dataset.updated)) || isNaN(Date.parse(bDateElement.dataset.updated))) {
        return 0;
      }

      const aDate = new Date(aDateElement.dataset.updated);
      const bDate = new Date(bDateElement.dataset.updated);

      // a and b are Date objects and we can compare them
      return bDate - aDate;
    });
  }

  // Clear the notes list
  while (notesList.firstChild) {
    notesList.firstChild.remove();
  }

  // Append the sorted notes back to the notes list
  notesArray.forEach(note => {
    notesList.appendChild(note);
  });

  // Append the notes from the bin back to the bin dropdown
  Array.from(binDropdown.children).forEach(note => {
    binDropdown.appendChild(note);
  });

  // Update the bin message
  updateBinMessage();
}


// Add event listener to the sort selection dropdown
document.getElementById("sortSelection").addEventListener("change", sortNotes);


const searchInput = document.querySelector('.searchInput');
searchInput.addEventListener('input', () => {
    fetch(`/notes?query=${encodeURIComponent(searchInput.value)}`)
        .then(response => response.json())
        .then(notes => {
            // Remove all current notes from sidebar when searching
            const notesList = document.querySelector(".notes-list");
            while (notesList.firstChild) {
                notesList.firstChild.remove();
            }
            // Add each note matching from the response query text
            for (const note of notes) {
                addNoteToList(note.title, note.body, note.updated);
            }
        })
        .catch(error => console.error("Error:", error));
});


// Call the sorting function whenever a note is added or updated
document.getElementById("saveButton").addEventListener("click", () => {
  const title = document.querySelector(".notes-title").value;
  const body = document.querySelector(".notes-body").value;
  const updated = new Date();
const formattedDate = updated.toLocaleString('en-US', {weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true});

if (activeNote) {
    // If there's an active note, update its content
    activeNote.innerHTML = `
      <div class="notes-small-title">${title}</div>
      <div class="notes-small-body">${body}</div>
      <div class="notes-small-updated" data-updated="${updated.toISOString()}">${formattedDate}</div>
      `;
} else {
    // If there's no active note, create a new note
    const noteItem = document.createElement("div");
    noteItem.classList.add("notes-list-item");

    noteItem.innerHTML = `
      <div class="notes-small-title">${title}</div>
      <div class="notes-small-body">${body}</div>
      <div class="notes-small-updated" data-updated="${updated.toISOString()}">${formattedDate}</div>
      `;

    // Add the note item to the notes list
    document.querySelector(".notes-list").appendChild(noteItem);
}
    
    // Clear the note title and body input fields
    document.querySelector(".notes-title").value = "";
    document.querySelector(".notes-body").value = "";
  
  // Clear the active note
  activeNote = null;
  
  sortNotes();
});



// Add a click event listener to the notes list to handle note selection
document.querySelector(".notes-list").addEventListener("click", (event) => {
  // Get the clicked note item
  const noteItem = event.target.closest(".notes-list-item");

  if (noteItem) {
    // If a note item was clicked, set it as the active note and load its content into the input fields
    activeNote = noteItem;
    
    const title = noteItem.querySelector(".notes-small-title").textContent;
    const body = noteItem.querySelector(".notes-small-body").textContent;
    
    document.querySelector(".notes-title").value = title;
    document.querySelector(".notes-body").value = body;
    
    // Remove the active class from the currently active note list item
    const activeNoteElement = document.querySelector(".notes-list-item--active");
    if (activeNoteElement) {
      activeNoteElement.classList.remove("notes-list-item--active");
    }
    
    // Add the active class to the clicked note list item
    noteItem.classList.add("notes-list-item--active");
  }
    
});

// Add a double click event listener to the notes list to handle note deletion
document.querySelector(".notes-list").addEventListener("dblclick", (event) => {
  // Get the clicked note item
  const noteItem = event.target.closest(".notes-list-item");

  if (noteItem) {
    // If a note item was double clicked, display a confirmation dialog
    if (confirm("Are you sure you want to delete this note?")) {

      noteItem.classList.add("deleted-note");

      // If the user confirms, remove the note item from the DOM
      let binDropdown = document.querySelector(".dropdown-container");

      // Move the note item to the bin dropdown
      binDropdown.appendChild(noteItem);

      // If the deleted note was the active note, clear the active note
      if (activeNote === noteItem) {
        activeNote = null;
      }

      noteItem.dataset.dateDeleted = new Date().toISOString();

      const buttonGroup = document.createElement("div");
      buttonGroup.classList.add("button-group");
    
      // Create the restore button
      const restoreButton = document.createElement("button");
      restoreButton.textContent = "Restore";
      restoreButton.classList.add("restore-button");
      
      // Create the delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-button");
    
      // Add the buttons to the button group div
      buttonGroup.appendChild(restoreButton);
      buttonGroup.appendChild(deleteButton);
      
      // Add the button group to the note item
      noteItem.appendChild(buttonGroup);

      // Update the binDropdown to reflect the current state of the DOM
      binDropdown = document.querySelector(".dropdown-container");
    }
  }
  updateBinMessage();
});


document.querySelector(".dropdown-container").addEventListener("click", (event) => {

  const noteItem = event.target.closest(".notes-list-item");

  if (event.target.classList.contains("restore-button")) {

    noteItem.classList.remove("deleted-note");

    //Ask the user if they want to restore the note
    if (!confirm("Are you sure you want to restore this note?")) {
      return;
    }


    // Move the note item back to the notes list
    const notesList = document.querySelector(".notes-list");
    notesList.appendChild(noteItem);

    // Remove the dateDeleted attribute from the restored note
    delete noteItem.dataset.dateDeleted;

     // Remove the restore and delete buttons from the note
     noteItem.querySelector(".button-group").remove();
   }

  else if (event.target.classList.contains("delete-button")) {
      // If the delete button was clicked, display a confirmation dialog
      if (confirm("Are you sure you want to permanently delete this note?")) {
        // If the user confirms, remove the note item from the DOM
        noteItem.remove();
      }

  }
  updateBinMessage();
});

// When the page is loaded, remove any notes that have been in the bin for more than 30 days
document.addEventListener("DOMContentLoaded", function() {
  const binDropdown = document.querySelector(".dropdown-container");
  const noteItems = binDropdown.querySelectorAll(".notes-list-item");

  noteItems.forEach(noteItem => {
    const dateDeleted = new Date(noteItem.dataset.dateDeleted);
    const now = new Date();

    // If the note has been in the bin for more than 30 days, remove it
    if ((now - dateDeleted) > (30 * 24 * 60 * 60 * 1000)) {
      noteItem.remove();
    }
  });
});




document.addEventListener("DOMContentLoaded", function() {
  const noteItem = document.createElement("div");
  noteItem.classList.add("notes-list-item");

  const title = "Welcome to Notify!";
  const body = "Instruction goes here";
  const updated = new Date().toLocaleString();
  
  // Format the date as "Day hh:mm am/pm"
  const formattedDate = new Date(updated).toLocaleString('en-US', {weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true});
  
  noteItem.innerHTML = `
    <div class="notes-small-title">${title}</div>
    <div class="notes-small-body">${body}</div>
    <div class="notes-small-updated">${formattedDate}</div>
  `;

  document.querySelector(".notes-list").appendChild(noteItem);

  // Set the initial note as active
  noteItem.classList.add("notes-list-item--active");

   // Remove the active class from the currently active note list item
   const activeNoteElement = document.querySelector(".notes-list-item--active");
   if (activeNoteElement) {
     activeNoteElement.classList.remove("notes-list-item--active");
   }

});


            
// import button functionality 
const importBtn = document.getElementById("fileInput");
            
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



  



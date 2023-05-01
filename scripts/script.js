const darkThemeButton = document.querySelector('.dark-Theme');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const logo = document.querySelector('#logo');


darkThemeButton.addEventListener('click', function() {
  sidebar.classList.toggle('dark');
  mainContent.classList.toggle('dark');

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


const cancelButton = document.querySelector('.cancel-button');
const noteTextarea = document.querySelector('#note');
const saveButton = document.querySelector('.save-button');

cancelButton.addEventListener('click', function() {
    noteTextarea.classList.add('hidden');
    saveButton.classList.add('hidden');
    cancelButton.classList.add('hidden');
});

const newnoteButton = document.querySelector('.new-note');

newnoteButton.addEventListener('click', function() {
    noteTextarea.classList.remove('hidden');
    saveButton.classList.remove('hidden');
    cancelButton.classList.remove('hidden');
    noteTextarea.value = '';
});

const notesArray = [
    {title: "Welcome to Notify!", body: "Notify instructions go here"},
  ];
const sidebarList = document.querySelector(".sidebar ul");
  
saveButton.addEventListener("click", function() {
    const title = prompt("Please enter a title for your note");
    if (title) {
        const newNote = {title: title, body: noteTextarea.value};
    
        notesArray.push(newNote);
    
        const newListItem = document.createElement("li");
        newListItem.textContent = title;
    
        sidebarList.appendChild(newListItem);
    
        noteTextarea.value = "";
    }
});

sidebarList.addEventListener("click", function(event) {
  if(event.target.tagName === "LI") {
    const clickedTitle = event.target.textContent;
    const clickednote = notesArray.find(function(note) {
        return note.title === clickedTitle;
    });
    noteTextarea.value = clickednote.body;
  }
});

const importBtn = document.getElementById("fileInput");

importBtn.addEventListener("click", async () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const fetchOptions = {
      method: "POST",
      body: formData,
    };

    try {
      const response = await fetch("/api", fetchOptions);

      if (response.ok) {
        const contents = await response.text();
        const title = file.name.replace(".txt", "");
        createNote(title, contents);
      } else {
        console.error("Error uploading file:", response.statusText);
      }
    } catch (e) {
      console.error(e);
    }

  });

});

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");

    fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const contents = e.target.result;
        const textarea = document.getElementById("note");
        textarea.value = contents;
    };

    reader.readAsText(file);
    
    fileInput.click();
  });
});










  

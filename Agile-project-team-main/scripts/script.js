const darkThemeButton = document.querySelector('.dark-Theme');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const logo = document.querySelector('#logo');
const allButtons = document.querySelectorAll('button');
const importBtn = document.getElementById("fileInput");
const noteTitle = document.querySelector('.notes-title');
const noteTextarea = document.querySelector('.notes-body');
const notearea= document.querySelector('.notes-preview');
const title =document.querySelector('.title')
const inputButton = document.querySelector('fileInput')

darkThemeButton.addEventListener('click', function() {
  sidebar.classList.toggle('dark');
  mainContent.classList.toggle('dark');
  notearea.classList.toggle('dark')
  noteTextarea.classList.toggle('dark');
  noteTitle.classList.toggle('dark');


  allButtons.forEach((button) => {
    button.classList.toggle('button-border-dark');
    title.classList.toggle('button-border-dark')
  });


  if (darkThemeButton.textContent === 'Dark Theme') {
    darkThemeButton.textContent = 'Light Theme';
    darkThemeButton.classList.add('light-Theme-button');
    newnoteButton.classList.add('light-Theme-button');  
    saveButton.classList.add('light-Theme-button');
    title.classList.add('light-bg')
    inputButton.classList.add('light-bg')
    logo.src = "img/github-mark-white.png";
  } else {
    darkThemeButton.textContent = 'Dark Theme';
    darkThemeButton.classList.remove('light-Theme-button');
    saveButton.classList.remove('light-Theme-button');
    newnoteButton.classList.remove('light-Theme-button');
    title.classList.remove('light-bg')
    inputButton.classList.remove('light-bg')
    logo.src = "img/github-mark.png";

  }
});


const saveButton = document.querySelector('.save-button');
const newnoteButton = document.querySelector('.new-note');

newnoteButton.addEventListener('click', function() {
    noteTextarea.value = '';
    noteTitle.value = '';
});

const notesArray = [
    {title: "Welcome to Notify!", body: "Notify instructions go here"},
  ];
const sidebarList = document.querySelector(".sidebar ul");
  
saveButton.addEventListener("click", function() {
    if (noteTitle) {
        const newNote = {title: noteTitle.value, body: noteTextarea.value};
    
        notesArray.push(newNote);
    
        const newListItem = document.createElement("li");
        newListItem.textContent = newNote.title;
    
        sidebarList.appendChild(newListItem);
    
        noteTextarea.value = "";
        noteTitle.value = "";
    }
});


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
        const textarea = document.querySelector(".notes-body");
        textarea.value = contents;
    };

    reader.readAsText(file);
    
    fileInput.click();
  });
});



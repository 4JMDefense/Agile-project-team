const darkThemeButton = document.querySelector('.dark-Theme');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

darkThemeButton.addEventListener('click', function() {
  sidebar.classList.toggle('dark');
  mainContent.classList.toggle('dark');

  if (darkThemeButton.textContent === 'Dark Theme') {
    darkThemeButton.textContent = 'Light Theme';
    darkThemeButton.classList.add('light-Theme-button');
  } else {
    darkThemeButton.textContent = 'Dark Theme';
    darkThemeButton.classList.remove('light-Theme-button')
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
    {title: "note one", body: "this is my first note"},
    {title: "note two", body: "this is my second note"}
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

  

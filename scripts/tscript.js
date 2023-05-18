const todoList = document.querySelector("#td")
const wipList = document.querySelector("#wp")
const completeList = document.querySelector("#ct")
const todoButton = document.querySelector("#todoButton")
const wipButton = document.querySelector("#wipButton")
const completeButton = document.querySelector("#completeButton")

function addTodo(){
    const newText = document.createElement("textarea")
    newText.setAttribute('cols','65')
    const newTask = document.createElement("td")
    newTask.append(newText)
    todoList.appendChild(newTask)
}

function addWIP(event){
    console.log(event)
    const newText = document.createElement("textarea")
    const newTask = document.createElement("td")
    newText.setAttribute('cols','65')
    newTask.append(newText)
    wipList.appendChild(newTask)
}

function addComplete(event){
    console.log(event)
    const newText = document.createElement("textarea")
    const newTask = document.createElement("td")
    newText.setAttribute('cols','65')
    newTask.append(newText)
    completeList.appendChild(newTask)
}




todoButton.addEventListener("click",addTodo)
wipButton.addEventListener("click",addWIP)
completeButton.addEventListener("click",addComplete)



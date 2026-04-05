const firstAddBtn = document.querySelector(".first-add-btn");

const tasksCont = document.querySelector(".tasks-cont");
const noTasksCont = document.querySelector(".no-tasks-cont");

const itemsList = document.querySelector(".items-list");
const firstInputElem = document.querySelector(".items-list .text-input");
const buttonsCont = document.querySelector(".buttons");

const addBtn = document.querySelector(".add-btn");

const tasksArr = [];

//!UTILITY FUNCTIONS
const getLastItem = () => itemsList.lastElementChild;
const getLastTextInput = () => getLastItem().querySelector(".text-input");
const getLastCheckbox = () => getLastItem().querySelector(".checkbox");

const tasksFromLocalStorage = () => JSON.parse(localStorage.getItem("tasks"));

//generates random num between 10 & 99
const generateTaskId = () => Math.floor(10 + Math.random() * 90);

//creates ids for the last li element, checkbox and text input on the page
function updateIds() {
    getLastItem().setAttribute("id", `task-${generateTaskId()}`);
    getLastTextInput().id = `task-${generateTaskId()}-checkbox`
    getLastCheckbox().id = `task-${generateTaskId()}-text-input`;
}

//!EVENT LISTENERS
firstAddBtn.addEventListener("click", function (e) {
    tasksCont.classList.remove("display-none");
    buttonsCont.classList.remove("display-none");

    noTasksCont.classList.add("display-none");

    updateIds();

    firstInputElem.focus();
});



class Task {

    constructor(id, checkedState, userInput) {
        this.id = id;
        this.checkedState = checkedState;
        this.userInput = userInput;
    }

    //? static because it make use of any instance data
    static addTask() {

        //clones list item 
        const clonedListItem = getLastItem().cloneNode(true);

        const clonedCheckbox = clonedListItem.querySelector(".checkbox");
        const clonedTextInput = clonedListItem.querySelector(".text-input");

        clonedCheckbox.checked = false;

        clonedTextInput.value = "";

        //adds a new list element to the list
        itemsList.appendChild(clonedListItem);

        clonedTextInput.focus();
    }

    //? not static because it make use of any instance data
    saveTaskInLocalStorage() {
        tasksArr.push(this);

        //update local storage
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
    }

}


addBtn.addEventListener("click", function (e) {
    if (itemsList.children.length < 10) {

        if (!itemsList.querySelector(".text-input").value) {
            alert("Fill in the current task first!");
            const message = "Attempt to duplicate empty task item"; //todo: change to error message
            console.log(message);
            return;
        }

        //creates a new task object and adds it to an array containing task objects
        const taskObj = new Task(generateTaskId(), false, getLastTextInput().value);

        //static method that adds a task to the page
        Task.addTask();

        //instance method
        taskObj.saveTaskInLocalStorage();

    } else {
        alert("Task limit reached");
    }


});





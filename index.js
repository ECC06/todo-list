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

const getTasksFromLocalStorage = () => JSON.parse(localStorage.getItem("tasks"));

//generates random num between 10 & 99
const generateTaskId = () => Math.floor(10 + Math.random() * 90);

//creates ids for the last li element, checkbox and text input on the page
function updateIds(id) {
    getLastItem().setAttribute("id", `task-${id}`);
    getLastTextInput().id = `task-${id}-text-input`
    getLastCheckbox().id = `task-${id}-checkbox`;
}

function showMainPage() {
    noTasksCont.classList.add("display-none");
    tasksCont.classList.remove("display-none");
    buttonsCont.classList.remove("display-none");
}

//!EVENT LISTENERS
firstAddBtn.addEventListener("click", function (e) {

    showMainPage();

    updateIds(generateTaskId());

    firstInputElem.focus();
});



class Task {

    constructor(id, checkedState, userInput) {
        this.id = id;
        this.checkedState = checkedState;
        this.userInput = userInput;
    }

    static addTask() {

        //clones list item 
        const clonedListItem = getLastItem().cloneNode(true);

        const clonedCheckbox = clonedListItem.querySelector(".checkbox");
        const clonedTextInput = clonedListItem.querySelector(".text-input");

        clonedCheckbox.checked = false;

        clonedTextInput.value = "";

        //adds a new list element to the list
        itemsList.appendChild(clonedListItem);

        // update the ids of the last li element on the page (including it's checkbox and text input)
        updateIds(generateTaskId());

        clonedTextInput.focus();
    }

    saveTaskInLocalStorage() {

        const tasksInLocalStorage = getTasksFromLocalStorage();

        if (tasksInLocalStorage) {

            //if the id of the task the user updated is found in local storage, then just update that task in local storage
            for (const obj of tasksInLocalStorage) {
                if (obj.id === this.id) {
                    obj.userInput = this.userInput;
                    localStorage.setItem("tasks", JSON.stringify(tasksInLocalStorage));
                    return;
                }
            }
        }

        //if the id of the task the user updated isn't found in local storage, then just create a new task in local storage
        tasksArr.push(this); //this => {id, checkedState, userInput}

        //update local storage
        localStorage.setItem("tasks", JSON.stringify(tasksArr));

    }

}


addBtn.addEventListener("click", function (e) {
    if (itemsList.children.length < 10) {

        //checks that the input textbox isn't empty
        if (!itemsList.querySelector(".text-input").value) {
            alert("Fill in the current task first!");
            const message = "Attempt to duplicate empty task item"; //todo: change to error message
            console.log(message);


            return;
        }

        Task.addTask();

    } else {
        alert("Task limit reached");
    }


});

//!Creates or updates a task in local storage when user focuses out of the input textbox
itemsList.addEventListener("focusout", function (e) {
    if (e.target.type === "text") {
        const textInputElem = e.target;

        if (textInputElem.value !== "") {

            const textInputElemId = textInputElem.id; //e.g "task-33-text-input"
            const taskId = textInputElemId.split("-")[1]; //"33"

            //creates a new task object 
            const taskObj = new Task(taskId, false, textInputElem.value);

            // creates or saves a new task in local storage
            taskObj.saveTaskInLocalStorage();
        }

        //todo: write code that will
    }

});


document.addEventListener("DOMContentLoaded", function () {
    const tasksArr = getTasksFromLocalStorage();

    if (!tasksArr) return;

    showMainPage();

    //add error handling into the getTasksFromLocalStorage function for when there's no task array in local storage
    if (tasksArr.length === 1) {

        const taskInfo = getTasksFromLocalStorage()[0];

        updateIds(taskInfo.id);

        getLastCheckbox().checked = taskInfo.checkedState;
        getLastTextInput().value = taskInfo.userInput;
    } else {
        tasksArr.forEach((obj, index) => {
            updateIds(obj.id);
            getLastCheckbox().checked = obj.checkedState;
            getLastTextInput().value = obj.userInput;

            //don't clone the last object
            if (index !== tasksArr.length - 1) {
                const clonedItem = getLastItem().cloneNode(true);
                itemsList.appendChild(clonedItem);
            }


        });

        const checkBoxes = document.querySelectorAll(".checkbox"); //[]

        checkBoxes.forEach(function (checkbox) {
            checkbox.addEventListener("change", function (e) {
                const checkBox = e.target;
                const checkId = checkBox.id.split("-")[1]; //e.g "task-92-checkbox" => 92
                console.log(checkId);
                //find an object in local storage with the id

                const tasksArr = getTasksFromLocalStorage();

                for (const obj of tasksArr) {
                    if (obj.id === checkId) {
                        obj.checkedState = !obj.checkedState;
                        break;
                    }
                }

                localStorage.setItem("tasks", JSON.stringify(tasksArr));
            });
        })

    }


});







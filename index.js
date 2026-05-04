import { dialog, itemsList, updateIds, generateTaskId, getLastItem, getLastCheckbox, getLastTextInput, getArrFromLocalStorage, addBtn, deleteBtn, elementsHighlighted, showMainPage } from "./shared.js";

import { updateCheckedState, handleSelectedElement, toggleHighlightedListBorders } from "./event-handlers.js";

import { Task } from "./task-class.js";

const deleteSingleTaskBtn = document.querySelector(".delete-task-btn");
const cancelDeleteBtn = document.querySelector(".cancel-delete-btn");

const firstAddBtn = document.querySelector(".first-add-btn");

const firstInputElem = document.querySelector(".items-list .text-input")


firstAddBtn.addEventListener("click", function (e) {

    showMainPage();

    updateIds(generateTaskId());

    firstInputElem.focus();
});

//!Creates a task on the page
addBtn.addEventListener("click", Task.addTaskToPage);

//!Reads tasks from local storage when the page loads (or is re-loaded)
document.addEventListener("DOMContentLoaded", function () {
    const tasksInLocalStorage = getArrFromLocalStorage();

    if (!tasksInLocalStorage) {
        console.log("No tasks in local storage");
        return;
    } else {
        tasksInLocalStorage.forEach((obj, index) => {
            updateIds(obj.id);
            getLastCheckbox().checked = obj.checkedState;
            getLastTextInput().value = obj.userInput;

            //don't clone the last object
            if (index !== tasksInLocalStorage.length - 1) {
                const clonedItem = getLastItem().cloneNode(true);
                itemsList.appendChild(clonedItem);
            }
        });
        showMainPage();
    }
});

//!Updates a task in local storage when user focuses out of the input textbox
itemsList.addEventListener("focusout", function (e) {
    if (e.target.type === "text") {
        const textInputElem = e.target;

        if (textInputElem.value !== "") {
            const textInputElemId = textInputElem.id; //e.g "task-33-text-input"
            const taskId = textInputElemId.split("-")[1]; //"33"

            //creates a new task object 
            const taskObj = new Task(taskId, false, textInputElem.value);

            // creates or saves a new task in local storage
            taskObj.updateTaskInLocalStorage();
        } else {
            const listElem = textInputElem.parentElement.parentElement;
            listElem.remove();
        }
    }
});

//!Updates the "checkedState" property in local storage when user clicks on the textbox of an element

itemsList.addEventListener("change", updateCheckedState);



















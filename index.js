import { dialog, itemsList, updateIds, generateTaskId, getLastItem, getLastCheckbox, getLastTextInput, getArrFromLocalStorage, addBtn, deleteBtn, deleteSingleItemClicked, showMainPage } from "./shared.js";

import { updateCheckedState, handleSelectedElement, toggleHighlightedListBorders, deleteAllTasks, updateTask } from "./event-handlers.js";

import { Task } from "./task-class.js";

const closeModal = document.querySelector(".close-modal");
const deleteSingleTaskBtn = document.querySelector(".delete-single-task");
const deleteAllBtn = document.querySelector(".delete-all-btn");

const firstAddBtn = document.querySelector(".first-add-btn");

const firstInputElem = document.querySelector(".items-list .text-input");

const body = document.querySelector("body");
const chalkboardCont = document.querySelector(".chalkboard-cont");


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
        updateTask(e);
    }
});

//!Updates the "checkedState" property in local storage when user clicks on the textbox of an element
itemsList.addEventListener("change", updateCheckedState);


//!Shows a modal which presents the user with the option to delete one task, or delete all tasks
deleteBtn.addEventListener("click", function (e) {
    body.style.backdropFilter = "blur(10px)";
    chalkboardCont.style.filter = "blur(10px)";

    dialog.showModal();

    deleteBtn.disabled = true;
    deleteBtn.pointerEvents = "none";

    addBtn.disabled = true;
    addBtn.style.pointerEvents = "none";
});

//fired when the user clicks on the delete single task button
deleteSingleTaskBtn.addEventListener("click", function (e) {
    body.style.backdropFilter = "none";
    chalkboardCont.style.filter = "none";

    deleteSingleItemClicked.bool = true;

    toggleHighlightedListBorders(deleteSingleItemClicked.bool);

    itemsList.addEventListener("click", handleSelectedElement, { once: true });

    dialog.close();
});

//gives the user the option to just go back and abort deleting an item
closeModal.addEventListener("click", function () {
    body.style.backdropFilter = "none";
    chalkboardCont.style.filter = "none";

    deleteBtn.disabled = false;
    deleteBtn.pointerEvents = "auto";

    addBtn.disabled = false;
    addBtn.style.pointerEvents = "auto";

    dialog.close();
});


deleteAllBtn.addEventListener("click", function (e) {
    const confirmDeleteAll = confirm("Are you sure you want to delete ALL tasks?");

    if (confirmDeleteAll === true) {
        deleteAllTasks();
    }

    deleteBtn.disabled = false;
    deleteBtn.pointerEvents = "auto";

    addBtn.disabled = false;
    addBtn.style.pointerEvents = "auto";

    body.style.backdropFilter = "none";
    chalkboardCont.style.filter = "none";

    dialog.close();
});
















import { dialog, itemsList, updateIds, generateTaskId, getLastItem, getLastCheckbox, getLastTextInput, getArrFromLocalStorage, addBtn, deleteBtn, deleteSingleItemClicked, showMainPage, tasksCheckedElem, tasksCreatedElem, getTasksCreatedFromLocalStorage, getTasksCheckedFromLocalStorage, tasksCompletedCont, deleteOptionsCont } from "./shared.js";

import { updateCheckedState, confirmDelete, toggleHighlightedListBorders, deleteAllTasks, updateTask } from "./event-handlers.js";

import { Task } from "./task-class.js";

const closeModal = document.querySelector(".close-modal");
const deleteSingleTaskBtn = document.querySelector(".delete-single-task");
const deleteAllBtn = document.querySelector(".delete-all-btn");

const firstAddBtn = document.querySelector(".first-add-btn");

const firstInputElem = document.querySelector(".items-list .text-input");

const body = document.querySelector("body");
const chalkboardImg = document.querySelector(".chalkboard");
const chalkboardCont = document.querySelector(".chalkboard-cont");

firstAddBtn.addEventListener("click", function (e) {
    localStorage.setItem("tasks-created", JSON.stringify(1));
    localStorage.setItem("tasks-checked", JSON.stringify(0));

    showMainPage();

    updateIds(generateTaskId());

    firstInputElem.focus();
});

//prevents the image element from being dragged
chalkboardImg.addEventListener("dragstart", function (e) {
    e.preventDefault();
})

//!Creates a task on the page when the user clicks on the add button or clicks on the "Enter" key
addBtn.addEventListener("click", Task.addTaskToPage);

itemsList.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        if (e.target.className === "text-input") {
            Task.addTaskToPage(e);
        }
    }
});


//!Reads tasks from local storage when the page loads (or is re-loaded)
document.addEventListener("DOMContentLoaded", function () {
    const tasksInLocalStorage = getArrFromLocalStorage();

    tasksCreatedElem.textContent = getTasksCreatedFromLocalStorage() ?? 1;
    tasksCheckedElem.textContent = getTasksCheckedFromLocalStorage() ?? 0;

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

    itemsList.addEventListener("click", confirmDelete, { once: true });

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

    //in-case the opposite is true
    deleteOptionsCont.classList.remove("display-none");
    tasksCompletedCont.classList.add("display-none");

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

// !!RE-ORDER LIST ITEMS
new Sortable(itemsList, {
    animation: 300,
    delay: 300,

    onStart: function (evt) {
        const textInput = evt.item.querySelector(".text-input");
        document.querySelector(":root").style.setProperty("--highlight-bg", "transparent");
        textInput.disabled = true;
        evt.item.style.opacity = "0.5";
    },
    onEnd: function (evt) {
        const textInput = evt.item.querySelector(".text-input");
        document.querySelector(":root").style.setProperty("--highlight-bg", "blue");
        textInput.disabled = false;
        evt.item.style.opacity = "1";

        updateLocalStorage();

        function updateLocalStorage() {
            const newTasksArr = [];

            for (let li of itemsList.children) {
                const taskId = li.id;
                const checkedState = li.querySelector(".checkbox").checked;
                const userInput = li.querySelector(".text-input").value;

                const taskObj = new Task(taskId, checkedState, userInput);

                newTasksArr.push(taskObj);
            }

            localStorage.setItem("tasks", JSON.stringify(newTasksArr));
        }
    },


});










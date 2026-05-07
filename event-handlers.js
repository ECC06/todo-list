import { itemsList, getArrFromLocalStorage, deleteSingleItemClicked, addBtn, deleteBtn, showMainPage, tasksCheckedElem, tasksCreatedElem, getTasksCheckedFromLocalStorage, getTasksCreatedFromLocalStorage, dialog, tasksCompletedCont, deleteOptionsCont } from "./shared.js";

import { Task } from "./task-class.js";

export function updateTask(event) {

    const textInputElem = event.target;

    if (textInputElem.value !== "") {
        const textInputElemId = textInputElem.id; //e.g "task-33-text-input"
        const taskId = textInputElemId.split("-")[1]; //"33"

        //creates a new task object 
        const taskObj = new Task(taskId, false, textInputElem.value); //{id: 33, checkedState: false, userInput: "Walk the dog"}

        // creates or saves a new task in local storage
        taskObj.updateTaskInLocalStorage();
        return;
    }

    const listElem = textInputElem.parentElement.parentElement;

    if (listElem !== itemsList.firstElementChild) {
        listElem.remove();

        let tasksCreated = JSON.parse(localStorage.getItem("tasks-created"));

        tasksCreated--;

        tasksCreatedElem.textContent = tasksCreated;
        localStorage.setItem("tasks-created", JSON.stringify(tasksCreated));
    };

}

export function updateCheckedState(event) {
    if (event.target.className === "checkbox") {
        let tasksChecked = getTasksCheckedFromLocalStorage();
        let tasksCreated = getTasksCheckedFromLocalStorage();

        if (event.target.checked === true) tasksChecked++;
        if (event.target.checked === false) tasksChecked--;

        updateStateInLocalStorage();
        updateHTML();

        if (getTasksCheckedFromLocalStorage() === getTasksCreatedFromLocalStorage()) {

            dialog.showModal();
            deleteOptionsCont.classList.add("display-none");
            tasksCompletedCont.classList.remove("display-none");
        }


        function updateStateInLocalStorage() {
            const checkBox = event.target;
            const checkId = checkBox.id.split("-")[1]; //e.g "task-92-checkbox" => 92
            //find an object in local storage with the id

            const tasksArr = getArrFromLocalStorage();

            for (const obj of tasksArr) {
                if (obj.id === checkId) {
                    obj.checkedState = !obj.checkedState;
                    break;
                }
            }

            localStorage.setItem("tasks", JSON.stringify(tasksArr));
        }

        function updateHTML() {
            tasksCheckedElem.textContent = tasksChecked;
            localStorage.setItem("tasks-checked", JSON.stringify(tasksChecked));
        }
    }
}

//highlights all the checkboxes when the "delete single item" button is clicked, and removes the highlights when they are done (or if they change their mind)
export function toggleHighlightedListBorders(btnClicked) {
    const cursorValue = (btnClicked) ? "pointer" : "auto";

    document.querySelectorAll(".list-elem").forEach(function (listElem) {
        const listElemCheckbox = listElem.querySelector(".checkbox");
        const listElemInput = listElem.querySelector(".text-input");

        listElem.style.cursor = cursorValue;
        listElemCheckbox.style.cursor = cursorValue;
        listElemInput.style.cursor = cursorValue;

        listElemCheckbox.disabled = (btnClicked) ? true : false;

        listElemInput.addEventListener("focus", function () {
            if (btnClicked === true) {
                this.blur();
            } else {
                this.focus();
            }
        }, { once: true });

        listElem.classList.toggle("red-border");

    });
}

//adds an event listener to each item on the list that can allow it to be removed
export function confirmDelete(event) {
    const confirmation = window.confirm("Are you sure you want to delete this item?");

    if (confirmation === true) {

        let clickedLiElem;

        //ensures the list element is stored in a variable no matter what element is clicked

        if (event.target.className === "list-elem") {
            clickedLiElem = event.target;
        }

        if (event.target.tagName === "LABEL") {
            clickedLiElem = event.target.parentElement;
        }

        if (event.target.className === "text-input") {
            clickedLiElem = event.target.parentElement.parentElement;
            clickedLiElem.blur();
        }

        Task.deleteElement(clickedLiElem);
    }

    deleteSingleItemClicked.bool = false;

    toggleHighlightedListBorders(deleteSingleItemClicked.bool);

    deleteBtn.disabled = false;
    deleteBtn.pointerEvents = "auto";

    addBtn.disabled = false;
    addBtn.style.pointerEvents = "auto";

}

export function deleteAllTasks() {
    const arrayOfTasks = itemsList.children;

    //deletes all tasks backwards except for the first task
    for (let i = arrayOfTasks.length - 1; i >= 0; i--) {
        const li = arrayOfTasks[i];


        if (i !== 0) {
            li.remove();
        } else {
            li.querySelector(".checkbox").checked = false;
            li.querySelector(".text-input").value = "";

            showMainPage();
            break;
        }
    }

    localStorage.clear();
    tasksCheckedElem.textContent = 0;
    tasksCreatedElem.textContent = 1;
}





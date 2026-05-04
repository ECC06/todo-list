import { itemsList, getArrFromLocalStorage, deleteSingleItemClicked, addBtn, deleteBtn, showMainPage } from "./shared.js";

import { Task } from "./task-class.js";

export function updateTask(event) {

    const textInputElem = event.target;

    if (textInputElem.value !== "") {
        const textInputElemId = textInputElem.id; //e.g "task-33-text-input"
        const taskId = textInputElemId.split("-")[1]; //"33"

        //creates a new task object 
        const taskObj = new Task(taskId, false, textInputElem.value);

        // creates or saves a new task in local storage
        taskObj.updateTaskInLocalStorage();
        return;
    }


    const listElem = textInputElem.parentElement.parentElement;

    if (listElem !== itemsList.firstElementChild) listElem.remove();


}

export function updateCheckedState(event) {
    if (event.target.className === "checkbox") {
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
export function handleSelectedElement(event) {
    const confirmation = window.confirm("Are you sure you want to delete this item?");

    if (confirmation === true) {

        let clickedElem;

        //ensures the list element is stored in a variable no matter what element is clicked

        if (event.target.className === "list-elem") {
            clickedElem = event.target;
        }

        if (event.target.tagName === "LABEL") {
            clickedElem = event.target.parentElement;
        }

        if (event.target.className === "text-input") {
            clickedElem = event.target.parentElement.parentElement;
            clickedElem.blur();
        }

        deleteElement(clickedElem);
    }

    deleteSingleItemClicked.bool = false;

    toggleHighlightedListBorders(deleteSingleItemClicked.bool);

    deleteBtn.disabled = false;
    deleteBtn.pointerEvents = "auto";

    addBtn.disabled = false;
    addBtn.style.pointerEvents = "auto";



}


//removes the element from the page and from local storage
function deleteElement(selectedElem) {
    //removes element from page
    if (itemsList.children.length !== 1) {
        selectedElem.remove();
    } else {
        selectedElem.querySelector(".checkbox").checked = false;
        selectedElem.querySelector(".text-input").value = "";

        showMainPage();
    }

    removeItemFromLocalStorage();


    function removeItemFromLocalStorage() {
        //removes element from local storage
        const tasksArr = getArrFromLocalStorage();
        const selectedElemId = selectedElem.id.split("-")[1];

        //finds the task the user selected and removes it from local storage
        const newArr = tasksArr.filter(obj => obj.id !== selectedElemId);

        if (newArr.length === 0) {
            localStorage.removeItem("tasks");
        } else {
            localStorage.setItem("tasks", JSON.stringify(newArr));
        }
    }

}

export function deleteAllTasks() {
    const arrayOfTasks = itemsList.children;

    for (let i = arrayOfTasks.length - 1; i >= 0; i--) {
        const li = arrayOfTasks[i];

        if (i === 0) {
            li.querySelector(".checkbox").checked = false;
            li.querySelector(".text-input").value = "";

            showMainPage();
            break;
        }

        li.remove();
    }

    localStorage.clear();
}





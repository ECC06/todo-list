import { itemsList, getArrFromLocalStorage, elementsHighlighted, addBtn, showMainPage } from "./shared.js";

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
    } else {
        const listElem = textInputElem.parentElement.parentElement;
        listElem.remove();
    }

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


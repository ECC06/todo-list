import { itemsList, getLastItem, updateIds, generateTaskId, getArrFromLocalStorage, showMainPage, tasksCheckedElem, tasksCreatedElem, getTasksCreatedFromLocalStorage } from "./shared.js";

export class Task {

    constructor(id, checkedState, userInput) {
        this.id = id;
        this.checkedState = checkedState;
        this.userInput = userInput;
    }

    //CREATE
    static addTaskToPage(event) {
        const lastElem = itemsList.lastElementChild;
        const lastElemTextInput = lastElem.querySelector(".text-input");

        if (itemsList.children.length < 10) {
            if (!lastElemTextInput.value) {
                alert("Fill in the current task first!"); return;
            } else {

                if (event.type === "click") {
                    const clonedListItem = getLastItem().cloneNode(true);
                    const emptyTask = cleanUpClone(clonedListItem);

                    itemsList.appendChild(emptyTask);

                    clonedListItem.querySelector(".text-input").focus();

                } else if (event.type === "keydown" && event.key === "Enter") {
                    const liOfTextInput = event.target.parentElement.parentElement;

                    const clonedListItem = liOfTextInput.cloneNode(true);
                    const emptyTask = cleanUpClone(clonedListItem);

                    liOfTextInput.after(emptyTask);

                    emptyTask.querySelector(".text-input").focus();
                }

                updateIds(generateTaskId()); // update the ids of the last li element on the page (including it's checkbox and text input

                updateTasksCreated();
                return;

                function cleanUpClone(item) {
                    const clonedCheckbox = item.querySelector(".checkbox");
                    const clonedTextInput = item.querySelector(".text-input");

                    clonedCheckbox.checked = false;

                    clonedTextInput.value = "";

                    return item;
                }

                function updateTasksCreated() {
                    //update the number of tasks created counter
                    let tasksCreated = getTasksCreatedFromLocalStorage();

                    tasksCreated++;

                    tasksCreatedElem.textContent = tasksCreated;
                    localStorage.setItem("tasks-created", JSON.stringify(tasksCreated));
                }
            }

        }

        alert("Task limit reached");
    }


    //UPDATE
    updateTaskInLocalStorage() {
        const tasksArr = [];
        const tasksInLocalStorage = getArrFromLocalStorage();

        let taskUpdated = false;

        //adds a new tasksArray to local storage entirely if local storage is empty
        if (!tasksInLocalStorage) {
            //if the id of the task the user typed into isn't found in local storage, then just create a new task in local storage
            tasksArr.push(this); //this => {id, checkedState, userInput}

            //update local storage
            localStorage.setItem("tasks", JSON.stringify(tasksArr));
            return;
        }

        //updates task.userInput if user typed into is stored in local storage
        for (const obj of tasksInLocalStorage) {
            if (obj.id === this.id) {
                obj.userInput = this.userInput;
                taskUpdated = true;
                break;
            }
        }

        if (!taskUpdated) {
            //adds a new task entirely if the task the user typed into isn't in local storage
            tasksInLocalStorage.push(this);
        }

        localStorage.setItem("tasks", JSON.stringify(tasksInLocalStorage));
    }

    //DELETE

    //removes the element from the page and from local storage
    static deleteElement(selectedElem) {
        //removes element from page
        if (itemsList.children.length !== 1) {
            selectedElem.remove();
        } else {
            selectedElem.querySelector(".checkbox").checked = false;
            selectedElem.querySelector(".text-input").value = "";

            showMainPage();
        }

        removeItemFromLocalStorage();
        updateTrackingNumbers();

        function updateTrackingNumbers() {
            let tasksChecked = JSON.parse(localStorage.getItem("tasks-checked"));
            let tasksCreated = JSON.parse(localStorage.getItem("tasks-created"));

            //reduces the number that tracks the number of tasks checked
            if (selectedElem.querySelector(".checkbox").checked === true) {
                tasksChecked--;
                tasksCheckedElem.textContent = tasksChecked;
                localStorage.setItem("tasks-checked", JSON.stringify(tasksChecked));
            }

            //reduces the number that tracks the number of tasks created
            if (tasksCreated > 1) tasksCreated--;
            tasksCreatedElem.textContent = tasksCreated;
            localStorage.setItem("tasks-created", JSON.stringify(tasksCreated));
        }

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


}
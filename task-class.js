import { itemsList, getLastItem, updateIds, generateTaskId, getArrFromLocalStorage, showMainPage, tasksCreatedElem, getTasksCreatedFromLocalStorage } from "./shared.js";

export class Task {

    constructor(id, checkedState, userInput) {
        this.id = id;
        this.checkedState = checkedState;
        this.userInput = userInput;
    }

    //CREATE
    static addTaskToPage() {
        const lastElem = itemsList.lastElementChild;
        const lastElemTextInput = lastElem.querySelector(".text-input");

        if (itemsList.children.length < 10) {
            if (!lastElemTextInput.value) {
                alert("Fill in the current task first!"); return;
            } else {
                //clones list item 
                const clonedListItem = getLastItem().cloneNode(true);

                const clonedCheckbox = clonedListItem.querySelector(".checkbox");
                const clonedTextInput = clonedListItem.querySelector(".text-input");

                clonedCheckbox.checked = false;

                clonedTextInput.value = "";

                //adds a new list element to the items list
                itemsList.appendChild(clonedListItem);

                // update the ids of the last li element on the page (including it's checkbox and text input)
                updateIds(generateTaskId());

                clonedTextInput.focus();

                //update the number of tasks created counter
                let tasksCreated = getTasksCreatedFromLocalStorage();

                tasksCreated++;

                tasksCreatedElem.textContent = tasksCreated;
                localStorage.setItem("tasks-created", JSON.stringify(tasksCreated));

                return;
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

        let tasksCreated = JSON.parse(localStorage.getItem("tasks-created"));

        //remove tasks created 
        tasksCreated--;
        tasksCreatedElem.textContent = tasksCreated;
        localStorage.setItem("tasks-created", JSON.stringify(tasksCreated));


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
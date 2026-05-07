//...contains variables & functions shared by index.js and other code files

export const dialog = document.querySelector("dialog");

export const tasksCompletedCont = document.querySelector(".tasks-completed-cont");
export const deleteOptionsCont = document.querySelector(".delete-options-cont");

const tasksCont = document.querySelector(".tasks-cont");
const noTasksCont = document.querySelector(".no-tasks-cont");
const buttonsCont = document.querySelector(".buttons");

export const itemsList = document.querySelector(".items-list");
export const addBtn = document.querySelector(".add-btn");
export const deleteBtn = document.querySelector(".delete-btn");

export let deleteSingleItemClicked = { bool: false };

export const tasksCheckedElem = document.querySelector(".tasks-checked");
export const tasksCreatedElem = document.querySelector(".tasks-created");

//!Utility functions
export const getArrFromLocalStorage = () => JSON.parse(localStorage.getItem("tasks"));

export const getTasksCheckedFromLocalStorage = () => JSON.parse(localStorage.getItem("tasks-checked"));
export const getTasksCreatedFromLocalStorage = () => JSON.parse(localStorage.getItem("tasks-created"));

export const getLastItem = () => itemsList.lastElementChild;

export const getLastTextInput = () => getLastItem().querySelector(".text-input");
export const getLastCheckbox = () => getLastItem().querySelector(".checkbox");

export const generateTaskId = () => {
    //generates random num between 10 & 99
    const generateId = () => Math.floor(10 + Math.random() * 90);

    if (itemsList.children.length === 1) {
        return generateId();
    } else {
        //keeps on generating a new id until no duplicate id is found in the tasks arr

        const tasksArr = getArrFromLocalStorage();
        let finalId = generateId();
        let duplicateFound = false; //true

        findDuplicate();

        while (duplicateFound === true) {
            finalId = generateId();
            findDuplicate();
        }

        function findDuplicate() {
            if (tasksArr.some((obj) => Number(obj.id) === finalId)) {
                duplicateFound = true;
            } else {
                duplicateFound = false;
            }
        };

        return finalId;
    }


};


//creates ids for the last li element, checkbox and text input on the page
export function updateIds(id) {
    getLastItem().setAttribute("id", `task-${id}`);
    getLastTextInput().id = `task-${id}-text-input`
    getLastCheckbox().id = `task-${id}-checkbox`;
}

export function showMainPage() {
    noTasksCont.classList.toggle("display-none");
    tasksCont.classList.toggle("display-none");
    buttonsCont.classList.toggle("display-none");
}

//...contains variables & functions shared by index.js and other code files

export const dialog = document.querySelector("dialog");

const tasksCont = document.querySelector(".tasks-cont");
const noTasksCont = document.querySelector(".no-tasks-cont");
const buttonsCont = document.querySelector(".buttons");

export const itemsList = document.querySelector(".items-list");
export const addBtn = document.querySelector(".add-btn");
export const deleteBtn = document.querySelector(".delete-btn");

export let deleteSingleItemClicked = { bool: false };


//!Utility functions
export const getArrFromLocalStorage = () => JSON.parse(localStorage.getItem("tasks"));

export const getLastItem = () => itemsList.lastElementChild;

export const getLastTextInput = () => getLastItem().querySelector(".text-input");
export const getLastCheckbox = () => getLastItem().querySelector(".checkbox");

export const generateTaskId = () => Math.floor(10 + Math.random() * 90); //generates random num between 10 & 99

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

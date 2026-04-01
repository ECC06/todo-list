const firstAddBtn = document.querySelector(".first-add-btn");
const tasksCont = document.querySelector(".tasks-cont");
const noTasksCont = document.querySelector(".no-tasks-cont");
const itemsList = document.querySelector(".items-list");
const firstInputElem = document.querySelector(".items-list .text-input");

firstAddBtn.addEventListener("click", function (e) {
    tasksCont.classList.remove("display-none");
    noTasksCont.classList.add("display-none");
    firstInputElem.focus();
});


//! ---------- New task input and new task button ---------- //

const newTaskInput = document.querySelector("#newTaskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");

//! ----- P tag that updates content depending on the operation -----//

const liveText = document.querySelector("#liveText");

//! ----- Saved Tasks List ----- //

const savedTasksList = document.querySelector("#savedTasksUL");

//! ---- Functions for adding, appending new tasks to list on submit (refactoring comes later?, baby steps) ---- //

let savedTasksArr = loadTasksFromLocalStorage();

//! ------ Render tasks for localStorage on load ------- //

function renderTasks(tasks) {
   savedTasksList.innerHTML = "";
   tasks.forEach((task, index) => {
      createTaskElement(task, index);
   });
}

liveText.classList.add("blueLiveText");
updateTaskList();

//! ---------- EventListener function for submitting a new task ---------- //

document.querySelector("#newTaskForm").addEventListener("submit", function (e) {
   e.preventDefault(); //?  Prevents page from reloading
   const value = newTaskInput.value.trim();

   //! ---------- Make sure the task input is valid ---------- //

   if (!value) {
      liveText.textContent = "Please enter a task to save";
      liveText.classList.add("redLiveText");
      setTimeout(function () {
         liveText.textContent = "Live feedback";
         liveText.classList.remove("redLiveText");
         liveText.classList.add("blueLiveText");
      }, 4000);
      return;
   }

   //! push as obj to arr

   savedTasksArr.push({
      text: value,
      completed: false,
   });
   saveTasksToLocalStorage(); //? Save to localStorage
   updateTaskList();

   //! ---------- clear input and update live text for next task ---------- //

   newTaskInput.value = "";
   liveText.textContent = "Task added!";
   liveText.classList.add("greenLiveText");
   setTimeout(function () {
      liveText.textContent = "Live feedback";
      liveText.classList.remove("greenLiveText");
      liveText.classList.add("blueLiveText");
   }, 4000);
});

//! ---------- function for storing tasks in localStorage ---------- //

function saveTasksToLocalStorage() {
   localStorage.setItem("savedTasksArr", JSON.stringify(savedTasksArr));
}

//! ------ function for loading tasks from localStorage (if any) ----- //

function loadTasksFromLocalStorage() {
   const tasks = localStorage.getItem("savedTasksArr");
   return tasks ? JSON.parse(tasks) : [];
}

//! ----- Create saved task li element with checkbox, task content, edit and delete button ----- //

function createTaskElement(task, index) {
   //! ---------- destructure task object for easier access ---------- //
   const { text, completed } = task;
   //! ---------- creating li element --------- //

   const li = document.createElement("li");
   li.className = "savedTask";
   li.setAttribute("data-index", index);

   //! ---------- creating checkbox ---------- //

   const checkbox = document.createElement("input");
   checkbox.type = "checkbox";
   checkbox.className = "savedTaskCheckbox";
   checkbox.checked = completed;
   checkbox.title = checkbox.checked ? "Mark as incomplete" : "Mark as complete";

   //! ---------- creating task content input ---------- //

   const savedTaskContent = document.createElement("input");
   savedTaskContent.type = "text";
   savedTaskContent.value = text;
   savedTaskContent.setAttribute("readonly", true);
   savedTaskContent.className = "savedTaskContent";
   if (completed) savedTaskContent.classList.add("checkedTask");

   //! ---------- checkbox adding and removing CSS class for checked items ---------- //

   checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
         savedTaskContent.classList.add("checkedTask");
         checkbox.title = checkbox.checked ? "Mark as incomplete" : "Mark as complete";
      } else {
         savedTaskContent.classList.remove("checkedTask");
         checkbox.title = checkbox.checked ? "Mark as incomplete" : "Mark as complete";
      }
      savedTasksArr[index].completed = checkbox.checked;
      saveTasksToLocalStorage();
   });

   //! ---------- creating edit button ---------- //

   const editBtn = document.createElement("button");
   editBtn.className = "editSavedTaskBtn";
   editBtn.innerHTML = `<img src="./assets/icons/edit.png" alt="black pen on an empty square meaning to edit the saved task"/> Edit`;
   editBtn.title = "Edit this task";

   //! --------------- edit button function for editing saved tasks ---------------//

   editBtn.addEventListener("click", function () {
      if (savedTaskContent.hasAttribute("readonly")) {
         savedTaskContent.removeAttribute("readonly");
         savedTaskContent.focus();
         editBtn.innerHTML = `<img src="./assets/icons/save.png" alt="floppy disk icon indicating save after editing"/> Save`;
      } else {
         if (!savedTaskContent.value.trim()) {
            liveText.textContent = "Please enter a task to save";
            liveText.classList.add("redLiveText");
            setTimeout(function () {
               liveText.textContent = "Live feedback";
               liveText.classList.remove("redLiveText");
               liveText.classList.add("blueLiveText");
            }, 4000);
            savedTaskContent.focus();
            return;
         }

         savedTaskContent.setAttribute("readonly", true);
         editBtn.innerHTML = `<img src="./assets/icons/edit.png" alt="black pen on an empty square meaning to edit the saved task"/> Edit`;
         savedTasksArr[index].text = savedTaskContent.value;
         saveTasksToLocalStorage();
         updateTaskList();

         liveText.textContent = "Edited task saved!";
         liveText.classList.add("greenLiveText");

         setTimeout(function () {
            liveText.textContent = "Live feedback";
            liveText.classList.remove("greenLiveText");
            liveText.classList.add("blueLiveText");
         }, 4000);
      }
   });

   //! ---------- delete button ---------- //

   const deleteBtn = document.createElement("button");
   deleteBtn.className = "deleteSavedTaskBtn";
   deleteBtn.innerHTML = `<img src="./assets/icons/delete.png" alt="white trashcan in a red filled circle meaning to delete the saved task"/> Delete`;
   deleteBtn.title = "Delete this task";

   //! --------------- delete button function for deleting saved tasks ---------------//

   deleteBtn.addEventListener("click", function () {
      const index = parseInt(li.getAttribute("data-index"));
      savedTasksArr.splice(index, 1); //! removed from array
      saveTasksToLocalStorage();
      li.remove(); //! removed from DOM
      updateTaskList(); //! re-render the task list

      //! update data-index on remaining tasks
      // document.querySelectorAll(".savedTask").forEach((taskLi, i) => {
      //    taskLi.setAttribute("data-index", i);
      // });
      liveText.textContent = "Task deleted!";
      liveText.classList.add("redLiveText");
      setTimeout(function () {
         liveText.textContent = "Live feedback";
         liveText.classList.remove("redLiveText");
      }, 4000);
   });

   //! ---------- append to li ---------- //

   li.append(checkbox, savedTaskContent, editBtn, deleteBtn);
   savedTasksList.append(li);
}

//* ---------- Filter tasks based on radio input selection ---------- //

// 1. Filter logic
function filterTasks(tasks) {
   const checkedFilter = document.querySelector('input[name="taskFilter"]:checked').value;
   if (checkedFilter === "completed") {
      return tasks.filter((task) => task.completed);
   } else if (checkedFilter === "active") {
      return tasks.filter((task) => !task.completed);
   }
   return tasks; // "all"
}

// 2. Sort logic
function sortTasks(tasks) {
   const sortBy = document.querySelector("#sortBy").value;
   let tasksCopy = [...tasks];
   if (sortBy === "alphabetical") {
      tasksCopy.sort((a, b) => a.text.localeCompare(b.text));
   } else if (sortBy === "completed") {
      // Completed last (change to - for completed first)
      tasksCopy.sort((a, b) => Number(a.completed) - Number(b.completed));
   }
   return tasksCopy;
}

function updateTaskList() {
   let tasks = filterTasks(savedTasksArr);
   tasks = sortTasks(tasks);
   renderTasks(tasks);
}

document.querySelector(".filters").addEventListener("change", updateTaskList);
document.querySelector("#sortBy").addEventListener("change", updateTaskList);

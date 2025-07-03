//! ---------- New task input and new task button ---------- //

const newTaskInput = document.querySelector("#newTaskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");

//! ----- P tag that updates content depending on the operation -----//

const liveText = document.querySelector("#liveText");

//! ----- Saved Tasks List ----- //

const savedTasksList = document.querySelector("#savedTasksUL");

//! --------------- Functions for adding, appending new tasks to list on submit (refactoring comes later, baby steps) --------------- //

let savedTasksArr = loadTasksFromLocalStorage();

//! ------ Render tasks for localStorage on load ------- //

savedTasksArr.forEach((task, index) => {
   createTaskElement(task, index);
});

//! ---------- EventListener function for submitting a new task ---------- //

document.querySelector("#newTaskForm").addEventListener("submit", function (e) {
   e.preventDefault(); //?  Prevents page from reloading
   const value = newTaskInput.value.trim();

   //! ---------- Make sure the task input is valid ---------- //

   if (!value) {
      liveText.textContent = "Please enter a task to save";
      liveText.classList.add("redLiveText");
      setTimeout(function () {
         liveText.textContent = "";
         liveText.classList.remove("redLiveText");
      }, 2000);
      return;
   }

   //! push as obj to arr

   savedTasksArr.push({
      text: value,
      completed: false,
   });

   saveTasksToLocalStorage();

   createTaskElement(savedTasksArr[savedTasksArr.length - 1], savedTasksArr.length - 1);

   //! ---------- clear input and update live text for next task ---------- //

   newTaskInput.value = "";
   liveText.textContent = "Task added!";
   liveText.classList.add("greenLiveText");
   setTimeout(function () {
      liveText.textContent = "";
      liveText.classList.remove("greenLiveText");
   }, 2000);
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
   //! ---------- creating li element --------- //

   const li = document.createElement("li");
   li.className = "savedTask";
   li.setAttribute("data-index", index);

   //! ---------- creating checkbox ---------- //

   const checkbox = document.createElement("input");
   checkbox.type = "checkbox";
   checkbox.className = "savedTaskCheckbox";
   checkbox.checked = task.completed;

   //! ---------- creating task content input ---------- //

   const savedTaskContent = document.createElement("input");
   savedTaskContent.type = "text";
   savedTaskContent.value = task.text;
   savedTaskContent.setAttribute("readonly", true);
   savedTaskContent.className = "savedTaskContent";
   if (task.completed) savedTaskContent.classList.add("checkedTask");

   //! ---------- checkbox adding and removing CSS class for checked items ---------- //

   checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
         savedTaskContent.classList.add("checkedTask");
      } else {
         savedTaskContent.classList.remove("checkedTask");
      }
      savedTasksArr[index].completed = checkbox.checked;
      saveTasksToLocalStorage();
   });

   //! ---------- creating edit button ---------- //

   const editBtn = document.createElement("button");
   editBtn.className = "editSavedTaskBtn";
   editBtn.innerHTML = `<img src="./assets/icons/edit.png" alt="black pen on an empty square meaning to edit the saved task"/>`;

   //! --------------- edit button function for editing saved tasks ---------------//

   editBtn.addEventListener("click", function () {
      if (savedTaskContent.hasAttribute("readonly")) {
         savedTaskContent.removeAttribute("readonly");
         savedTaskContent.focus();
         editBtn.innerHTML = `<img src="./assets/icons/save.png" alt="floppy disk icon indicating save after editing"/>`;
      } else {
         savedTaskContent.setAttribute("readonly", true);
         editBtn.innerHTML = `<img src="./assets/icons/edit.png" alt="black pen on an empty square meaning to edit the saved task"/>`;
         savedTasksArr[index].text = savedTaskContent.value;
         saveTasksToLocalStorage();

         liveText.textContent = "Edited task saved!";
         liveText.classList.add("greenLiveText");

         setTimeout(function () {
            liveText.textContent = "";
            liveText.classList.remove("greenLiveText");
         }, 2000);
      }
   });

   //! ---------- delete button ---------- //

   const deleteBtn = document.createElement("button");
   deleteBtn.className = "deleteSavedTaskBtn";
   deleteBtn.innerHTML = `<img src="./assets/icons/delete.png" alt="white trashcan in a red filled circle meaning to delete the saved task"/>`;

   //! --------------- delete button function for deleting saved tasks ---------------//

   deleteBtn.addEventListener("click", function () {
      const index = parseInt(li.getAttribute("data-index"));
      li.remove(); //! removed from DOM
      savedTasksArr.splice(index, 1); //! removed from array
      saveTasksToLocalStorage();

      //! update data-index on remaining tasks
      document.querySelectorAll(".savedTask").forEach((taskLi, i) => {
         taskLi.setAttribute("data-index", i);
      });
      liveText.textContent = "Task deleted!";
      liveText.classList.add("redLiveText");
      setTimeout(function () {
         liveText.textContent = "";
         liveText.classList.remove("redLiveText");
      }, 2000);
   });

   //! ---------- append to li ---------- //

   li.append(checkbox, savedTaskContent, editBtn, deleteBtn);
   savedTasksList.append(li);
}

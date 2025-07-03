//! ---------- New task input and new task button ---------- //

const newTaskInput = document.querySelector("#newTaskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");

//! ----- P tag that updates content depending on the operation -----//

const liveText = document.querySelector("#liveText");

//! ----- Saved Tasks List ----- //

const savedTasksList = document.querySelector("#savedTasksUL");

//! -------------------- Function for adding, appending new tasks to list on submit (refactoring comes later, baby steps) -------------------- //

let savedTasksArr = [];

document.querySelector("#newTaskForm").addEventListener("submit", function (e) {
   e.preventDefault(); //?  Prevents page from reloading
   const value = newTaskInput.value.trim();

   //! ---------- Make sure the task input in valid ---------- //

   if (!value) {
      liveText.textContent = "Please enter a task to save";
      liveText.classList = "redLiveText";
      setTimeout(function () {
         liveText.textContent = "";
      }, 2000);
      return;
   }
   savedTasksArr.push({
      text: value,
      completed: false,
   });

   //! ----- Create saved task li element with checkbox, task content, edit and delete button ----- //

   //! ---------- creating li element --------- //

   const li = document.createElement("li");
   li.className = "savedTask";
   li.setAttribute("data-index", savedTasksArr.length - 1);

   //! ---------- creating checkbox ---------- //

   const checkbox = document.createElement("input");
   checkbox.type = "checkbox";
   checkbox.className = "savedTaskCheckbox";

   //! ---------- creating task content input ---------- //

   const savedTaskContent = document.createElement("input");
   savedTaskContent.type = "text";
   savedTaskContent.value = value;
   savedTaskContent.setAttribute("readonly", true);
   savedTaskContent.className = "savedTaskContent";

   //! ---------- checkbox adding and removing CSS class for checked items ---------- //

   checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
         savedTaskContent.classList.add("checkedTask");
      } else {
         savedTaskContent.classList.remove("checkedTask");
      }
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

         const index = parseInt(li.getAttribute("data-index"));
         savedTasksArr[index] = savedTaskContent.value;

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
      li.remove(li); //! removed from DOM
      savedTasksArr.splice(index, 1); //! removed from array

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

   //! ---------- clear input and update live text for next task ---------- //

   newTaskInput.value = "";
   liveText.textContent = "Task added!";
   liveText.className = "greenLiveText";
   setTimeout(function () {
      liveText.textContent = "";
   }, 2000);
});

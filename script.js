//! ---------- New task input and new task button ---------- //

const newTaskInput = document.querySelector("#newTaskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");

//! ----- P tag that updates content depending on the operation -----//

const liveText = document.querySelector("#liveText");

//! ----- Saved Tasks List ----- //

const savedTasksList = document.querySelector("#savedTasksUL");

//! ----- Function for adding, appending new tasks to list ----- //

let savedTasksArr = [];

document.querySelector("#newTaskForm").addEventListener("submit", function (e) {
   e.preventDefault(); // Prevents page from reloading
   const value = newTaskInput.value.trim();

   if (!value) {
      // Make sure the task input in valid
      liveText.textContent = "Please enter a task to save";
      liveText.classList = "redLiveText";
      return;
   }
   savedTasksArr.push(value);

   // Create saved task li element with checkbox, task content, edit and delete button

   //! li element
   const li = document.createElement("li");
   li.className = "savedTask";

   //! checkbox
   const checkbox = document.createElement("input");
   checkbox.type = "checkbox";
   checkbox.className = "savedTaskCheckbox";

   //! task content
   const savedTaskContent = document.createElement("input");
   savedTaskContent.type = "text";
   savedTaskContent.value = value;
   savedTaskContent.setAttribute("readonly", true);
   savedTaskContent.className = "savedTaskContent";

   //! edit button
   const editBtn = document.createElement("button");
   editBtn.className = "editSavedTaskBtn";
   editBtn.innerHTML = `<img src="./assets/icons/edit.png" alt="black pen on an empty square meaning to edit the saved task"/>`;

   //! delete button
   const deleteBtn = document.createElement("button");
   deleteBtn.className = "deleteSavedTaskBtn";
   deleteBtn.innerHTML = `<img src="./assets/icons/delete.png" alt="white trashcan in a red filled circle meaning to delete the saved task"/>`;

   //! append to li
   li.append(checkbox, savedTaskContent, editBtn, deleteBtn);
   savedTasksList.append(li);

   //! clear input and update live text
   newTaskInput.value = "";
   liveText.textContent = "Task added!";
   liveText.className = "greenLiveText";
   setTimeout(function () {
      liveText.textContent = "";
   }, 1500);
});

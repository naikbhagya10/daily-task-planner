// ==========================================
// DAILY TASK PLANNER
// ==========================================


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const currentDate = document.getElementById("currentDate");

const filterButtons = document.querySelectorAll(".filter-btn");


// ==========================================
// DISPLAY CURRENT DATE
// ==========================================

const today = new Date();

currentDate.textContent = today.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});


// ==========================================
// LOAD TASKS FROM LOCAL STORAGE
// ==========================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ==========================================
// SAVE TASKS TO LOCAL STORAGE
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ==========================================
// DISPLAY / RENDER TASKS
// ==========================================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;


    // Show only pending tasks
    if (currentFilter === "pending") {

        filteredTasks = tasks.filter(
            task => !task.completed
        );

    }


    // Show only completed tasks
    else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(
            task => task.completed
        );

    }


    // Show empty message
    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    }

    else {

        emptyMessage.style.display = "none";

    }


    // Create task elements
    filteredTasks.forEach(task => {

        const taskItem = document.createElement("div");

        taskItem.className = "task-item";

        taskItem.dataset.id = task.id;


        taskItem.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    class="form-check-input"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <p class="task-title ${
                    task.completed ? "completed" : ""
                }">

                    ${escapeHTML(task.title)}

                </p>

            </div>


            <div class="task-buttons">

                <button
                    class="btn btn-sm btn-warning"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>


                <button
                    class="btn btn-sm btn-danger"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        `;


        taskList.appendChild(taskItem);

    });

}


// ==========================================
// ADD NEW TASK
// ==========================================

function addTask() {

    const title = taskInput.value.trim();


    // Check empty task
    if (title === "") {

        alert("Please enter a task.");

        taskInput.focus();

        return;
    }


    // Create new task
    const newTask = {

        id: Date.now(),

        title: title,

        completed: false

    };


    // Add task to array
    tasks.push(newTask);


    // Save
    saveTasks();


    // Display
    renderTasks();


    // Clear input
    taskInput.value = "";


    // Focus input again
    taskInput.focus();

}


// ==========================================
// COMPLETE / PENDING TASK
// ==========================================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {

                ...task,

                completed: !task.completed

            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    renderTasks();

}


// ==========================================
// EDIT TASK
// ==========================================

function editTask(id) {

    const task = tasks.find(
        task => task.id === id
    );


    if (!task) {

        return;

    }


    // Find the task element
    const taskItem = document.querySelector(
        `.task-item[data-id="${id}"]`
    );


    if (!taskItem) {

        return;

    }


    const taskLeft =
        taskItem.querySelector(".task-left");

    const taskButtons =
        taskItem.querySelector(".task-buttons");


    // Replace task text with input box
    taskLeft.innerHTML = `

        <input
            type="text"
            class="form-control edit-input"
            id="edit-${id}"
            value="${escapeHTML(task.title)}"
        >

    `;


    // Replace buttons with Save and Cancel
    taskButtons.innerHTML = `

        <button
            class="btn btn-sm btn-success"
            onclick="saveEdit(${id})"
        >
            Save
        </button>


        <button
            class="btn btn-sm btn-secondary"
            onclick="cancelEdit()"
        >
            Cancel
        </button>

    `;


    // Focus edit input
    const editInput =
        document.getElementById(`edit-${id}`);


    editInput.focus();


    // Select existing text
    editInput.select();


    // Save when Enter is pressed
    editInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                saveEdit(id);

            }

            if (event.key === "Escape") {

                cancelEdit();

            }

        }
    );

}


// ==========================================
// SAVE EDITED TASK
// ==========================================

function saveEdit(id) {

    const editInput =
        document.getElementById(`edit-${id}`);


    if (!editInput) {

        return;

    }


    const newTitle =
        editInput.value.trim();


    // Prevent empty task
    if (newTitle === "") {

        alert("Task cannot be empty.");

        editInput.focus();

        return;

    }


    // Find task
    const task = tasks.find(
        task => task.id === id
    );


    if (task) {

        task.title = newTitle;

    }


    saveTasks();

    renderTasks();

}


// ==========================================
// CANCEL EDIT
// ==========================================

function cancelEdit() {

    renderTasks();

}


// ==========================================
// FILTER TASKS
// ==========================================

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            // Get selected filter
            currentFilter =
                button.dataset.filter;


            // Reset all filter buttons
            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "btn-dark",
                    "active"
                );

                btn.classList.add(
                    "btn-outline-dark"
                );

            });


            // Highlight selected filter
            button.classList.remove(
                "btn-outline-dark"
            );

            button.classList.add(
                "btn-dark",
                "active"
            );


            // Display filtered tasks
            renderTasks();

        }
    );

});


// ==========================================
// ADD BUTTON EVENT
// ==========================================

addBtn.addEventListener(
    "click",
    addTask
);


// ==========================================
// PRESS ENTER TO ADD TASK
// ==========================================

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ==========================================
// INITIAL DISPLAY
// ==========================================

renderTasks();
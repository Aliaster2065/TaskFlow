const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Retrieve and display tasks
async function loadTasks() {
    const response = await fetch("/api/tasks");
    const tasks = await response.json();

    taskList.innerHTML = "";

    tasks.forEach(task => {
        const listItem = document.createElement("li");

        // Create checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = Boolean(task.completed);

        checkbox.addEventListener("change", () => {
            updateTask(task.id, checkbox.checked);
        });

        // Create task text
        const taskText = document.createElement("span");
        taskText.textContent = task.title;

        if (task.completed) {
            taskText.style.textDecoration = "line-through";
        }

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(taskText);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });
}

// Add a new task
taskForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") return;

    const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: taskText })
    });

    if (response.ok) {
        taskInput.value = "";
        loadTasks();
    }
});

// Update task completion status
async function updateTask(id, completed) {
    await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed })
    });

    loadTasks();
}

// Delete a task
async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}

// Load tasks when the page opens
loadTasks();

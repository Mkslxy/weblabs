// Масив для зберігання завдань
let tasks = [];
let taskToEditIndex = null;  // Для редагування завдання

// Функція для створення нової задачі
function addTask(taskName) {
    const task = {
        name: taskName,
        createdAt: new Date(),
        updatedAt: new Date(),
        completed: false
    };
    tasks.push(task);
    renderTasks();
}

// Функція для видалення завдання
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Функція для редагування завдання
function editTask(index) {
    taskToEditIndex = index;
    document.getElementById("edit-task-input").value = tasks[index].name;
    document.getElementById("edit-modal").style.display = "block";
}

// Функція для збереження редагування
function saveTask() {
    const newName = document.getElementById("edit-task-input").value;
    if (newName) {
        tasks[taskToEditIndex].name = newName;
        tasks[taskToEditIndex].updatedAt = new Date();
        renderTasks();
        closeModal();
    }
}

// Функція для позначення завдання як виконаного
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    tasks[index].updatedAt = new Date();
    renderTasks();
}

// Функція для сортування завдань
function sortTasks(criteria) {
    switch (criteria) {
        case 'created':
            tasks.sort((a, b) => a.createdAt - b.createdAt);
            break;
        case 'status':
            tasks.sort((a, b) => a.completed - b.completed);
            break;
        case 'updated':
            tasks.sort((a, b) => a.updatedAt - b.updatedAt);
            break;
    }
    renderTasks();
}

// Функція для відображення всіх завдань
function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const taskElement = document.createElement("li");
        taskElement.classList.add("task");
        if (task.completed) {
            taskElement.classList.add("completed");
        }
        taskElement.addEventListener("click", ()=>toggleTaskCompletion(index))
        taskElement.innerHTML = `
            <span class="task-name" onclick="toggleTaskCompletion(${index})">${task.name}</span>
            <div class="button-wrapper">
                <button onclick="deleteTask(${index})">Видалити</button>
                <button onclick="editTask(${index})">Редагувати</button>
            </div>
            `;
        taskList.appendChild(taskElement);
    });
}

// Обробка форми додавання нового завдання
document.getElementById("todo-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newTaskInput = document.getElementById("new-task");
    if (newTaskInput.value) {
        addTask(newTaskInput.value);
        newTaskInput.value = "";
    }
});

// Обробка вибору сортування
document.getElementById("sort-options").addEventListener("change", (e) => {
    sortTasks(e.target.value);
});

document.getElementById("close-modal").addEventListener("click", () => {
    closeModal();
});

document.getElementById("save-edit-btn").addEventListener("click", saveTask);

// Функція для закриття модального вікна
function closeModal() {
    document.getElementById("edit-modal").style.display = "none";
}

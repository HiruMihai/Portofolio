
// ADDING TASK

const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const addTask = document.getElementById('addTask');
const todoList = document.getElementById("todo-list");
const doneList = document.getElementById("done-list");

addTask.addEventListener('click', function () {
    const titleValue = taskTitle.value;
    const descriptionValue = taskDescription.value;
    if (titleValue && descriptionValue) {
        const newTask = document.createElement('li');
        newTask.classList.add('to-do-task');

        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        newTask.appendChild(checkbox);

        const titleSpan = document.createElement('span');
        titleSpan.classList.add('task-description');
        titleSpan.textContent = titleValue;
        newTask.appendChild(titleSpan);

        const descriptionParagraph = document.createElement('p');
        descriptionParagraph.textContent = descriptionValue;
        newTask.appendChild(descriptionParagraph);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('trash');
        deleteButton.textContent = "🗑";
        newTask.appendChild(deleteButton);

        todoList.appendChild(newTask);

        taskTitle.value = "";
        taskDescription.value = "";

    }
});

// MOVING TASK

todoList.addEventListener("change", function (event) {
    if (event.target.tagName === "INPUT" && event.target.type === "checkbox") {
        const listItem = event.target.parentElement;
        if (event.target.checked) {
            doneList.appendChild(listItem);
            listItem.classList.add("done-task")
        } else {
            todoList.appendChild(listItem);
        }
    }
});

doneList.addEventListener("change", function (event) {
    if (event.target.tagName === "INPUT" && event.target.type === "checkbox") {
        const listItem = event.target.parentElement;
        if (!event.target.checked) {
            todoList.appendChild(listItem);
            listItem.classList.remove("done-task");
            listItem.classList.add("to-do-task");
        } else {
            doneList.appendChild(listItem);
        }
    }
});

// DELETING TASK

const listsContainer = document.querySelector('#toDoApp');
listsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('trash')) {
        const listItem = event.target.closest('.to-do-task, .done-task');
        if (listItem) {
            listItem.remove();
        }
    }

});

// SEARCH TASK

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('search');
const clearButton = document.getElementById('clear');

searchButton.addEventListener('click', function () {
    const searchTerm = searchInput.value.trim().toLowerCase();

    clearSearchResults();

    searchInList(todoList, searchTerm);
    searchInList(doneList, searchTerm);
});

function searchInList(list, term) {
    const listItems = list.getElementsByClassName('to-do-task');
    for (const listItem of listItems) {
        const title = listItem.querySelector('.task-description').textContent.toLowerCase();
        const description = listItem.querySelector('p').textContent.toLowerCase();
        if (title.includes(term) || description.includes(term)) {
            listItem.style.display = 'block';
        } else {
            listItem.style.display = 'none';
        }
    }
}

function clearSearchResults() {
    const allListItems = [...todoList.getElementsByClassName('to-do-task'), ...doneList.getElementsByClassName('done-task')];
    for (const listItem of allListItems) {
        listItem.style.display = 'block';
    }
}

clearButton.addEventListener('click', function () {
    searchInput.value = '';
    clearSearchResults();
});

// LOCAL STORAGE:

document.addEventListener('DOMContentLoaded', function () {
    const todoTasks = localStorage.getItem('todoTasks');
    const doneTasks = localStorage.getItem('doneTasks');

    if (todoTasks) {
        todoList.innerHTML = todoTasks;
    }

    if (doneTasks) {
        doneList.innerHTML = doneTasks;
    }
});

function saveTasksToLocalStorage() {
    const todoTasksContent = todoList.innerHTML;
    const doneTasksContent = doneList.innerHTML;

    localStorage.setItem('todoTasks', todoTasksContent);
    localStorage.setItem('doneTasks', doneTasksContent);
}

addTask.addEventListener('click', function () {
    taskTitle.value = "";
    taskDescription.value = "";
    saveTasksToLocalStorage();
});

todoList.addEventListener("change", function () {
    saveTasksToLocalStorage();
});

doneList.addEventListener("change", function () {
    saveTasksToLocalStorage();
});

listsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('trash')) {
        const listItem = event.target.closest('.to-do-task, .done-task');
        if (listItem) {
            listItem.remove();
            saveTasksToLocalStorage();
        }
    }
});

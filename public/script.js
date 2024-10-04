// Fetch all todos from API
async function fetchTodos() {
    const response = await fetch('/api/todos');
    const todos = await response.json();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        
        const taskText = document.createElement('span');
        taskText.textContent = todo.task;
        taskText.classList.toggle('completed', todo.completed);
        taskText.onclick = () => toggleComplete(todo._id, todo.completed);
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editTodo(todo._id, todo.task);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTodo(todo._id);
        
        li.appendChild(taskText);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });
}

// Add new todo
async function addTodo() {
    const taskInput = document.getElementById('new-task');
    const task = taskInput.value.trim();
    if (!task) return;
    
    await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
    });
    
    taskInput.value = '';
    fetchTodos();
}

// Toggle todo completion
async function toggleComplete(id, completed) {
    await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
    });
    fetchTodos();
}

// Edit todo
async function editTodo(id, oldTask) {
    const newTask = prompt('Edit your task:', oldTask);
    if (newTask === null || newTask.trim() === '') return;
    
    await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask, completed: false })  // Reset completion when edited
    });
    fetchTodos();
}

// Delete todo
async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
    });
    fetchTodos();
}

// Initialize
fetchTodos();

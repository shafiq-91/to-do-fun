const tasks = [];
let taskIdCounter = 1;

// Show modal
document.getElementById('addTaskBtn').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.querySelector('.modal-enter').classList.add('modal-enter-active');
    });
});

// Close modal
document.getElementById('closeModalBtn').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.querySelector('.modal-enter').classList.remove('modal-enter-active');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
});

// Save task
document.getElementById('saveTaskBtn').addEventListener('click', () => {
    const taskTitle = document.getElementById('taskTitle').value;
    const taskPriority = document.getElementById('taskPriority').value;

    if (taskTitle) {
        const task = {
            id: taskIdCounter++,
            title: taskTitle,
            date: new Date().toLocaleDateString(),
            status: 'Pending',
            priority: taskPriority,
        };
        tasks.push(task);
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskPriority').value = 'Low';
        closeTaskModal();
        renderTasks();
    }
});

// Close modal helper
function closeTaskModal() {
    const modal = document.getElementById('modal');
    modal.querySelector('.modal-enter').classList.remove('modal-enter-active');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Render tasks with animation
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.classList.add('fade-enter');
        row.innerHTML = `
            <td class="border-b border-gray-300 p-4">${task.id}</td>
            <td class="border-b border-gray-300 p-4">${task.title}</td>
            <td class="border-b border-gray-300 p-4">${task.date}</td>
            <td class="border-b border-gray-300 p-4"><span class="text-${task.status === 'Pending' ? 'red' : 'green'}-600 font-semibold">${task.status}</span></td>
            <td class="border-b border-gray-300 p-4">${task.priority}</td>
            <td class="border-b border-gray-300 p-4 flex space-x-2">
                <button class="text-red-600 hover:text-red-700 transition-transform transform hover:scale-110" onclick="deleteTask(${task.id})">🗑️</button>
                <button class="text-blue-600 hover:text-blue-700 transition-transform transform hover:scale-110" onclick="editTask(${task.id})">✏️</button>
                <button class="text-green-600 hover:text-green-700 transition-transform transform hover:scale-110" onclick="completeTask(${task.id})">✔️</button>
            </td>
        `;
        taskList.appendChild(row);

        // Trigger fade-in animation
        requestAnimationFrame(() => {
            row.classList.add('fade-enter-active');
        });
    });
}

// Delete task
function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index > -1) {
        tasks.splice(index, 1);
        renderTasks();
    }
}

// Edit task
function editTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskPriority').value = task.priority;
        deleteTask(id);
        document.getElementById('modal').classList.remove('hidden');
    }
}

// Complete task
function completeTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
        renderTasks();
    }
}

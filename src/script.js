const tasks = [];
let taskIdCounter = 1;
let taskToDeleteId = null;
let taskToEditId = null;

// Show modal for adding task
document.getElementById('addTaskBtn').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.querySelector('.modal-enter').classList.add('modal-enter-active');
    });
});

// Close add task modal
document.getElementById('closeModalBtn').addEventListener('click', () => {
    closeTaskModal();
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

// Render tasks in the table
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;

    taskList.innerHTML = ''; // Clear existing tasks

    const filteredTasks = tasks.filter(task => {
        const statusMatch = statusFilter === 'All' || task.status === statusFilter;
        const priorityMatch = priorityFilter === 'All' || task.priority === priorityFilter;
        return statusMatch && priorityMatch;
    });

    filteredTasks.forEach(task => {
        const row = document.createElement('tr');
        row.classList.add('border-b-1', 'border-red-100');

        row.innerHTML = `
            <td class="p-4">${task.id}</td>
            <td class="p-4">${task.title}</td>
            <td class="p-4">${task.date}</td>
            <td class="p-4">${task.status}</td>
            <td class="p-4">${task.priority}</td>
            <td class="p-4 flex space-x-2">
                <button class="text-green-500 hover:text-green-700 complete-task-btn">✔️</button>
                <button class="text-blue-500 hover:text-blue-700 edit-task-btn">✏️</button>
                <button class="text-red-500 hover:text-red-700 delete-task-btn">🗑️</button>
            </td>
        `;
        taskList.appendChild(row);

        // Delete task action
        row.querySelector('.delete-task-btn').addEventListener('click', () => {
            taskToDeleteId = task.id;
            showDeleteModal();
        });

        // Edit task action
        row.querySelector('.edit-task-btn').addEventListener('click', () => {
            taskToEditId = task.id;
            showEditModal(task);
        });

        // Complete task action
        row.querySelector('.complete-task-btn').addEventListener('click', () => {
            task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
            renderTasks();
        });
    });

    // Update the task count in the footer
    const taskCountElement = document.getElementById('taskCount');
    taskCountElement.textContent = `Total Tasks: ${filteredTasks.length}`;
}

// Initial render
renderTasks();


// Show Edit Task Modal
function showEditModal(task) {
    const editModal = document.getElementById('editModal');
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskPriority').value = task.priority;
    editModal.classList.remove('hidden');
    requestAnimationFrame(() => {
        editModal.querySelector('.modal-enter').classList.add('modal-enter-active');
    });
}

// Close Edit Task Modal
document.getElementById('closeEditModalBtn').addEventListener('click', () => {
    closeEditModal();
});

// Save Edited Task
document.getElementById('saveEditBtn').addEventListener('click', () => {
    const editedTitle = document.getElementById('editTaskTitle').value;
    const editedPriority = document.getElementById('editTaskPriority').value;

    if (editedTitle && taskToEditId !== null) {
        const task = tasks.find(t => t.id === taskToEditId);
        task.title = editedTitle;
        task.priority = editedPriority;
        renderTasks();
        closeEditModal();
    }
});

// Close edit modal helper
function closeEditModal() {
    const editModal = document.getElementById('editModal');
    editModal.querySelector('.modal-enter').classList.remove('modal-enter-active');
    setTimeout(() => {
        editModal.classList.add('hidden');
    }, 300);
}

// Show delete modal
function showDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.classList.remove('hidden');
    requestAnimationFrame(() => {
        deleteModal.querySelector('.modal-enter').classList.add('modal-enter-active');
    });
}

// Confirm delete task
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (taskToDeleteId !== null) {
        tasks.splice(tasks.findIndex(task => task.id === taskToDeleteId), 1);
        taskToDeleteId = null;
        renderTasks();
        closeDeleteModal();
    }
});

// Cancel delete action
document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    closeDeleteModal();
});

// Close delete modal helper
function closeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.querySelector('.modal-enter').classList.remove('modal-enter-active');
    setTimeout(() => {
        deleteModal.classList.add('hidden');
    }, 300);
}

// Filter event listeners
document.getElementById('statusFilter').addEventListener('change', renderTasks);
document.getElementById('priorityFilter').addEventListener('change', renderTasks);

// Initial render
renderTasks();

// Base64 encoding function
function base64Encode(data) {
    return btoa(unescape(encodeURIComponent(data)));
}

// Download tasks as encrypted HABLU file
function downloadTasksAsHABLU() {
    const jsonData = JSON.stringify(tasks);
    const encryptedData = base64Encode(jsonData); // Encrypt the JSON data
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(encryptedData); // Change MIME type to text/plain
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "tasks.hablu"); // Change file extension to .hablu
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// Upload tasks from encrypted HABLU file
function uploadTasksFromHABLU(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const uploadedData = e.target.result;
            const decryptedData = decodeURIComponent(escape(atob(uploadedData))); // Decrypt the data
            const uploadedTasks = JSON.parse(decryptedData); // Parse the decrypted JSON
            tasks.length = 0; // Clear the current tasks
            tasks.push(...uploadedTasks); // Add the uploaded tasks
            taskIdCounter = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1; // Update the taskIdCounter
            renderTasks(); // Re-render the tasks
        };
        reader.readAsText(file);
    }
}

// Trigger file upload
function triggerFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.hablu'; // Change accepted file type to .hablu
    fileInput.addEventListener('change', uploadTasksFromHABLU);
    fileInput.click();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.code === 'KeyX') { // ALT + X = Download HABLU
        downloadTasksAsHABLU();
    } else if (e.altKey && e.code === 'KeyU') { // ALT + U = Upload HABLU
        triggerFileUpload();
    }
});

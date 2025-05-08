const columns = document.querySelectorAll('.kanban-column');

columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        column.classList.add('dragover'); 
    });

    column.addEventListener('dragleave', () => {
        column.classList.remove('dragover');
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.classList.remove('dragover');
        
        const draggedItemId = e.dataTransfer.getData('text');
        const draggedItem = document.getElementById(draggedItemId);
        
        column.appendChild(draggedItem);
    });
});

const tasks = document.querySelectorAll('.kanban-item');

tasks.forEach(task => {
    task.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', task.id);
    });
});

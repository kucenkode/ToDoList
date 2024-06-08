const parent = document.querySelector('.wrapper');

(function() {
    //Функция добавления задачи в список
    function addTaskToList() {
        const existingTasks = document.querySelector('.existing-tasks');
        const addTaskInput = document.querySelector('#add-task-input');

        addTaskInput.addEventListener('keydown', (event) => {
            if (event.keyCode === 13) {
                const shouldAddTask = changeTheStatusOfAddingTask();
                if (shouldAddTask && addTaskInput.value.trim()) {
                    //Создаем новый узел - это будет новой задачей
                    const newTask = document.createElement('li');
                    newTask.className = 'task';
                    newTask.textContent = addTaskInput.value;

                    //Добавляем новую задачу к существующим (если их нет - будет первой)
                    existingTasks.appendChild(newTask);
                };
            };
        });
    };

    //Функция, которая переместит область добавления задачи вниз
    function changeThePositionOfInputWhenFirstTaskIsAdded() {
        const containerTasks = document.querySelector('.container-no-tasks');
        const existingTasks = document.querySelector('.existing-tasks');
        const addTaskInput = document.querySelector('#add-task-input');

        if (existingTasks.children.length < 1) {
            containerTasks.classList.toggle('container-with-tasks');
            addTaskInput.placeholder = 'Добавить новую задачу';
        };
    };

    //Функция, которая изменяет цвет кружочка, отвечающего за корректность ввода
    function changeTheStatusOfAddingTask() {
        const statusCircle = document.querySelector('#status-circle');
        const addTaskInput = document.querySelector('#add-task-input');

        // Три варианта: ничего не ввели, задача уже есть в списке или все верно
        if (addTaskInput.value.trim().length === 0) {
            statusCircle.classList.add('status-circle-incorrect-input');
            return;
        }
        else if (Array.from(document.querySelectorAll('.task')).some((someTask) => someTask.textContent === addTaskInput.value)) {
            statusCircle.classList.add('status-circle-no-changes');
            return confirm('Подобная задача уже существует. Всё равно добавить?');
        }
        else {
            statusCircle.classList.add('status-circle-done');
            changeThePositionOfInputWhenFirstTaskIsAdded();
            return true;
        };
    };

    document.addEventListener('DOMContentLoaded', (event) => {
        const statusCircle = document.querySelector('#status-circle');
        const addTaskInput= document.querySelector('#add-task-input');
        addTaskInput.addEventListener('click', () => {
            event.preventDefault();
            statusCircle.classList.remove('status-circle-incorrect-input', 'status-circle-done');
            addTaskToList();
        });
    });
}) ()
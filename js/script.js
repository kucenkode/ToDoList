const parent = document.querySelector('.wrapper');

(function() {
    /* Добавление задачи в список */
    //Функция добавления задачи в список
    function addTaskToList() {
        const existingTasks = document.querySelector('.existing-tasks');
        const addTaskInput = document.querySelector('#add-task-input');
        const statusCircle = document.querySelector('#status-circle');

        //Создаем новый узел - это будет новой задачей
        const newTaskContainer =  document.createElement('div');
        newTaskContainer.className = 'task';
        newTaskContainer.innerHTML = 
        `
            <img id = "complete-task-circle" src = "img/completeTaskWhite.png"> 
            <li> ${addTaskInput.value.trim()} </li>
            <span id = "delete-btn"> ✕ </button>
        `

        //Добавляем новую задачу к существующим (если их нет - будет первой)
        existingTasks.prepend(newTaskContainer);

        //Меняем цвет кружочка, который отвечает за корректность ввода
        statusCircle.classList.add('status-circle-done');

        if (existingTasks.children.length === 1) changeThePositionOfInputWhenFirstTaskIsAdded();
    };

    //Функция, которая переместит область добавления задачи вниз
    function changeThePositionOfInputWhenFirstTaskIsAdded() {
        const containerTasks = document.querySelector('.container-no-tasks');
        const addTaskInput = document.querySelector('#add-task-input');
        const existingTasks = document.querySelector('.existing-tasks');

        //Меняем положение input
        containerTasks.classList.toggle('container-with-tasks');
        addTaskInput.placeholder = 'Добавить новую задачу';
        
        //Сразу добавляем кнопку для удаления всех задач
        if (!document.querySelector('#delete-all-tasks-button')) {
            const deleteAllTasksButton = document.createElement('button');
            deleteAllTasksButton.id = 'delete-all-tasks-button';
            deleteAllTasksButton.textContent = 'Удалить все задачи';
            const containerAddTaskAndDeleteAllTasks = document.querySelector('.container-add-task-and-delete-all-tasks');

            //Выравниваем поле ввода и кнопку удаления всех задач
            containerAddTaskAndDeleteAllTasks.style.display = 'grid';
            containerAddTaskAndDeleteAllTasks.style.gridTemplateColumns = '84% 15%';

            containerAddTaskAndDeleteAllTasks.appendChild(deleteAllTasksButton);
        };

        if (document.querySelector('#delete-all-tasks-button') && existingTasks.children.length === 0) {
            document.querySelector('#delete-all-tasks-button').remove();

            const containerAddTaskAndDeleteAllTasks = document.querySelector('.container-add-task-and-delete-all-tasks');
            containerAddTaskAndDeleteAllTasks.style.display = 'flex';
        };
    };

    //Если задача существует
    function showModal() { 
        document.querySelector('.popup-container').classList.remove('hidden');
        document.querySelector('#tasks-exists-modal').style.display = 'block';
    };

    function hideModal() { 
        document.querySelector('.popup-container').classList.add('hidden');
    };

    /* Завершение задачи */
    function completeTask() {
        if (event.target.id === 'complete-task-circle') {
            const taskContainer = event.target.closest('div');

            //меняем статус задачи на task-is-completed
            taskContainer.classList.toggle('task-is-completed');
    
            //Если у задачи убрали статус завершенной, то она поднимается обратно
            if (!taskContainer.classList.contains('task-is-completed')) {
                document.querySelector('.existing-tasks').insertBefore(taskContainer, document.querySelector('.existing-tasks').firstChild);
            } else {
                document.querySelector('.existing-tasks').appendChild(taskContainer);
            }
        }
    }

    /* Фильтрация задач по статусу */
    function filterTasksByStatus() {
        const allTasks = document.querySelectorAll('.task');
        const completedTasks = document.querySelectorAll('.task-is-completed');
        const incompletedTasks = document.querySelectorAll('.task:not(.task-is-completed)');
        
        if (event.target.id === 'all-tasks') {
            allTasks.forEach(task => task.classList.remove('hidden'));
        } else if (event.target.id === 'completed-tasks') {
            allTasks.forEach(task => task.classList.add('hidden'));
            completedTasks.forEach(task => task.classList.remove('hidden'));
        } else if (event.target.id === 'incompleted-tasks') {
            allTasks.forEach(task => task.classList.add('hidden'));
            incompletedTasks.forEach(task => task.classList.remove('hidden'));
        };
    };

    /* Удаление задач */
    //Удаление определенной задачи 
    function deleteTask() {
        if (event.target.id === 'delete-btn') {
            event.target.closest('div').remove();
            if (document.querySelector('.existing-tasks').children.length === 0) {
                changeThePositionOfInputWhenFirstTaskIsAdded();

            }
        };
    };

    //Удаление всех задач
    function deleteAllTasks() {
        if (event.target.id === 'delete-all-tasks-button') {
            document.querySelector('.existing-tasks').innerHTML = '';
            changeThePositionOfInputWhenFirstTaskIsAdded();
        };
    };

    document.addEventListener('DOMContentLoaded', (event) => {
        const statusCircle = document.querySelector('#status-circle');
        const addTaskInput= document.querySelector('#add-task-input');

        addTaskInput.addEventListener('click', (event) => {
            event.preventDefault();
            statusCircle.classList.remove('status-circle-incorrect-input', 'status-circle-no-changes', 'status-circle-done');
        });

        addTaskInput.addEventListener('keydown', (event) => {
            if (event.keyCode === 13) {
                statusCircle.classList.remove('status-circle-incorrect-input', 'status-circle-no-changes', 'status-circle-done');

                // Три варианта: ничего не ввели, задача уже есть в списке или все верно
                if (addTaskInput.value.trim().length === 0) {
                    statusCircle.classList.add('status-circle-incorrect-input');
                }
                else if (Array.from(document.querySelectorAll('li')).some((someTask) => someTask.textContent.trim() === addTaskInput.value.trim())) {
                    statusCircle.classList.add('status-circle-no-changes');

                    //Выводим модальное окно, которое даёт выбор: добавить задачу или нет
                    showModal();
                }
                else {
                    addTaskToList();
                    addTaskInput.value = '';
                };
            };
        });

        // Устанавливаем обработчики на кнопки
        document.querySelector('#confirm-yes').addEventListener('click', (event) => { 
            event.preventDefault();
            addTaskToList();
            hideModal();
        });

        document.querySelector('#confirm-no').addEventListener('click', hideModal);

        // при нажатии на круг с галочкой завершит выполнение задачи
        document.querySelector('.existing-tasks').addEventListener('click', (event) => {
            event.preventDefault();
            completeTask();
        });

        //при нажатии на "Все" отобразит и выполненные, и незавершенные задачи
        document.querySelector('#all-tasks').addEventListener('click', filterTasksByStatus);

        //при нажатии на "Выполненные" отобразит завершенные задачи
        document.querySelector('#completed-tasks').addEventListener('click', filterTasksByStatus);

        //при нажатии на "В процессе" отобразит незавершенные задачи
        document.querySelector('#incompleted-tasks').addEventListener('click', filterTasksByStatus);
    
        //При нажатии на кнопку удаляет задачу
        document.querySelector('.existing-tasks').addEventListener('click', () => {
            event.preventDefault();
            deleteTask();
        });

        //При нажатии на кнопку удаляет все задачи
        document.querySelector('.container-add-task-and-delete-all-tasks').addEventListener('click', () => {
            event.preventDefault();
            deleteAllTasks();
        });
    });
}) ()
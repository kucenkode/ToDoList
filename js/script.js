const parent = document.querySelector('.wrapper');

/* 
Проблема: Если задача уже есть в списке, то должно выводиться модальное окно с возможностью выбора
добавить такую же задачу или нет. Но как только окно выводится, выполняется код для кнопки "да" (#confirm-yes)
даже не нужно нажимать на нее. Потом если на эту кнопку нажать, то код для нее снова выполнится. Со второй кнопкой, "нет" (#confirm-no)
такого нет, она срабатывает только при нажатии. А еще вроде иногда окно выводится даже если задача похожа (но не идентична).

Пока там добавление только, остальное очень быстро делается, я это за один вечер сделаю, мне именно с проблемой разобраться нужно. А еще 
у тебя на компьютере не появляется полоса прокрутки?
*/

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
        `

        //Добавляем новую задачу к существующим (если их нет - будет первой)
        existingTasks.prepend(newTaskContainer);

        //Меняем цвет кружочка, который отвечает за корректность ввода
        statusCircle.classList.add('status-circle-done');
        changeThePositionOfInputWhenFirstTaskIsAdded();
    };

    //Функция, которая переместит область добавления задачи вниз
    function changeThePositionOfInputWhenFirstTaskIsAdded() {
        const containerTasks = document.querySelector('.container-no-tasks');
        const existingTasks = document.querySelector('.existing-tasks');
        const addTaskInput = document.querySelector('#add-task-input');

        if (existingTasks.children.length <= 1) {
            containerTasks.classList.toggle('container-with-tasks');
            addTaskInput.placeholder = 'Добавить новую задачу';
        }
    };

    /* ПРОБЛЕМА МОЖЕТ БЫТЬ ЗДЕСЬ */
    //Функция, которая выводит модальное окно, если задача уже существует
    function confirmIfTaskExists() {
        const confirmationModal = document.createElement('dialog');
        confirmationModal.id = 'tasks-exists-modal';
        confirmationModal.className = 'popup';
        confirmationModal.innerHTML = `
            <h3> Подобная задача уже существует. Всё равно добавить? </h3>
            <div class = 'popup-buttons-container'>
                <button id = 'confirm-yes'> Да </button>
                <button id = 'confirm-no'> Нет </button>
            </div>
        `;
        parent.appendChild(confirmationModal);

        const buttonYes = confirmationModal.querySelector('#confirm-yes');
        const buttonNo = confirmationModal.querySelector('#confirm-no');

        confirmationModal.showModal();

        //В модальном окне выбрали добавить задачу
        buttonYes.addEventListener('click', () => {
            console.log('hello');
            //confirmationModal.remove(); строка пока закомментирована, так как иначе окно сразу будет закрываться
        });

        //В модальном окне выбрали не добавлять задачу
        buttonNo.addEventListener('click', () => {
            confirmationModal.remove();
        });
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

    document.addEventListener('DOMContentLoaded', (event) => {
        const statusCircle = document.querySelector('#status-circle');
        const addTaskInput= document.querySelector('#add-task-input');
  
        addTaskInput.addEventListener('click', () => {
            event.preventDefault();
            statusCircle.classList.remove('status-circle-incorrect-input', 'status-circle-no-changes', 'status-circle-done');

            addTaskInput.addEventListener('keydown', (event) => {
                if (event.keyCode === 13) {
                    statusCircle.classList.remove('status-circle-incorrect-input', 'status-circle-no-changes', 'status-circle-done');

                     // Три варианта: ничего не ввели, задача уже есть в списке или все верно
                    if (addTaskInput.value.trim().length === 0) {
                        statusCircle.classList.add('status-circle-incorrect-input');
                    }
                    else if (Array.from(document.querySelectorAll('.task')).some((someTask) => someTask.textContent.trim() === addTaskInput.value.trim())) {
                        statusCircle.classList.add('status-circle-no-changes');

                        //Выводим модальное окно, которое даёт выбор: добавить задачу или нет
                        if(!document.querySelector('#tasks-exists-modal')) confirmIfTaskExists();
                    }
                    else {
                        addTaskToList();
                        addTaskInput.value = '';
                    };
                };
            });
        });

        // при нажатии на круг с галочкой завершит выполнение задачи
        document.querySelector('.existing-tasks').addEventListener('click', (event) => {
            event.preventDefault();
            completeTask();
        });

        document.querySelector('#all-tasks').addEventListener('click', filterTasksByStatus);
        document.querySelector('#completed-tasks').addEventListener('click', filterTasksByStatus);
        document.querySelector('#incompleted-tasks').addEventListener('click', filterTasksByStatus);
    });
}) ()
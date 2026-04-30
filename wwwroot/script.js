function sendToServerNewData(){
    const name = document.getElementById('newNameInput').value;
    const desc = document.getElementById('newDescInput').value;
    
    // Достаём ID из URL (как показано выше)
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    
    fetch('/sendNewData', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            id: taskId,     
            newName: name, 
            newDesc: desc 
        })
    })
    .then(r => r.text())
    .then(data => {
        window.location.href = 'tasklist.HTML';
    });
}
function sendToServer(){
    const name = document.getElementById('nameInput').value;
    const desc = document.getElementById('descInput').value;

    fetch('/sendData', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ Name: name, Desc: desc })
    })
    .then(r => r.text())
    .then(data => {
        document.getElementById('ifTaskAdded').innerText = data;
    });
}
function delAllTasks(){
    fetch('/delalltasks')
    .then(r => r.text())
    .then(r =>{
        console.log("удалены все задачи");
        const list = document.getElementById('taskList');
        const sumoftasks = document.getElementById('sumoftasks');
        list.innerText = r;
        sumoftasks.innerText = '';
    });
}
function loadTasks() {
    fetch('/gettasks')
        .then(r => r.json())
        .then(tasks => {
            console.log("Вот что пришло с сервера:", tasks);
            const list = document.getElementById('taskList');
            const sumoftasks = document.getElementById('sumoftasks');
            list.innerHTML = ''; 
            let tasknumber = 0;
            tasks.forEach(task => {
                list.innerHTML += `
                    <li>
                        <b>${++tasknumber}: ${task.name}</b> - ${task.description}
                        <button data-id="${task.id}" onclick="editTask(this)">Редактировать</button>
                        <button data-id="${task.id}" onclick="deleteTask(this)">Удалить</button>
                    </li>
                `;
            });
            if (tasknumber != 0) {
                sumoftasks.innerText = "количество задач: " + tasknumber;
                
            }
            else{
                sumoftasks.innerText = '';
                list.innerHTML += "<span>похоже, тут пусто</span>";
            }
        });
}       
function forTestButton(button){
    const taskID = button.getAttribute('data-id');
    window.location.href = 'test.html?id=' + taskID;
} 
function editTask(button) {
    const taskId = button.getAttribute('data-id');
    window.location.href = '/edit.html?id=' + taskId;
    
} 
function deleteTask(button) {
    const taskId = button.getAttribute('data-id');
    
    fetch('/deletetask', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: taskId })
    })
    .then(r => r.text())
    .then(data => {
        loadTasks();
    });
}
function showTask(taskid){
    fetch('/test', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: taskid})
    })
    .then(r => r.json())
    .then(task =>{
        const tasknameEL = document.getElementById('tasknameintest');
        const desc = document.getElementById('desc');
        tasknameEL.innerText = task.name;
        desc.innerText = task.description;
    });
}
const taskListElement = document.getElementById('taskList');
if (taskListElement) {
    loadTasks(); 
}
const taskForTest = document.getElementById('tasknameintest');

if(taskForTest){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    showTask(id);
}
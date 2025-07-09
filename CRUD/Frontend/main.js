const baseURL = 'http://127.0.0.1:8000/api/todos/';
    const todoForm = document.getElementById('todo-form');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const todoList = document.getElementById('todo-list');

    //FETCH ALL TODOS
    async function getTodos(){
        const response = await fetch(baseURL);
        const data = await response.json();
        todoList.innerHTML = '';
        data.forEach(todo => {
            const li = document.createElement('li');
            li.innerHTML = `
            <div>
            <strong> ${todo.title}</strong> -> Done(${todo.completed})<br/>
            <small>${todo.description}</small>
            </div>

            <div>
            <button onclick="deleteTodo(${todo.id})" style="background: red; border: none; border-radius: 4px; color: white; margin-top:10px" class="delete">Delete</button>
            <button onclick = "toggleCompleted(${todo.id}, ${todo.completed})" style = "background: blue; border: none; border-radius:4px; color:white" class="complete">Completed</button>
            <div/>
            `;
            todoList.appendChild(li);
        });
    }

    //ADDING A NEW ITEM
    todoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        console.log({title, description});
        const req = await fetch(baseURL, {
            method: 'POST',
            headers :{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({ title, description})
        });
        if(req.ok){
            titleInput = '';
            descriptionInput = '';
            getTodos();
        }
    });

//DELETING THE TODOs
async function deleteTodo(id){
    const response = await fetch(`${baseURL}${id}/`, {
        method: 'DELETE'
    });
    if(response.ok){
        getTodos();
    }else{
        console.error('Delete failed');
    }
}

//Toggle completion
async function toggleCompleted(id, currentStatus){
    await fetch(`${baseURL}${id}/`, {
        method: 'PATCH',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({completed: !currentStatus})
    });
    getTodos();
}

getTodos();
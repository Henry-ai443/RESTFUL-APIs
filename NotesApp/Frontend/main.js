const noteForm = document.getElementById('noteForm');
const token = localStorage.getItem('token');
//CREATING A NEW NOTE
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const  topic = document.getElementById('topic').value.trim();
    const entry = document.getElementById('entry').value.trim();

    console.log(token)

    const req = await fetch('http://127.0.0.1:8000/api/notes/', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization':`Token ${token}`,
        },
        body:JSON.stringify({
            topic, entry
        })
    })

    if(req.ok){
        alert('Note created successfully!')
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').textContent = 'Note created Successfully'
        listNotes()
        window.location.href='notes.html';
    }


});

//LISTING ALL NOTES
async function listNotes(){
    const req = await fetch('http://127.0.0.1:8000/api/notes/',{
        headers:{
            'Authorization':`Token ${token}`
        }
    })
    const notes =await req.json();
    console.log(notes)
    const name = localStorage.getItem('username');
    const noteList = document.getElementById('noteList');
    notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.innerHTML = `
        <div class="noteCard" data-id="${note.id}">
        <h3 id="note-topic-${note.id}">${note.topic}</h3>
        <p id="note-entry-${note.id}">${note.entry}</p>
        <h4><small>${note.created_at}</small></h4>
        <button  onclick="deleteNote(${note.id})" style="background:red; color:white; padding:10px 5px; border:none;border-radius:4px;font-weight:bold; cursor:pointer;" class="deleteBtn">DELETE</button>
        <button onclick="Edit(${note.id})" style="background:blue;padding:10px 10px;border:none;border-radius:4px;font-weight:bold;cursor:pointer;color:white;">Edit</button>
        <p><strong>User: </strong>${name}</p>
        </div>
        `;
        noteList.appendChild(noteDiv);
    });
}


//DELETING A NOTE
async function deleteNote(id) {
    const req = await fetch(`http://127.0.0.1:8000/api/notes/${id}/`, {
        method:'DELETE',
        headers:{
            'Authorization': `Token ${token}`
        }
    });
    if(req.ok){
        alert(` Deleted Successfully`);
    }
    window.location.reload();
    listNotes()
}

 function Edit(id){
    const topic = document.getElementById(`note-topic-${id}`).innerText;
    const entry = document.getElementById(`note-entry-${id}`).innerText;

    document.getElementById('note-id').value = id;
    document.getElementById('edit-note-title').value = topic;
    document.getElementById('edit-note-entry').value = entry;

    document.getElementById('edit-form-container').style.display='block';
}

function cancelEdit(){
    document.getElementById('edit-form-container').style.display = "none";
}

//EDITING A NOTE
document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('note-id').value;
    const topic = document.getElementById('edit-note-title').value.trim();
    const entry = document.getElementById('edit-note-entry').value.trim();

    const req = await fetch(`http://127.0.0.1:8000/api/notes/${id}/`, {
        method:'PATCH',
        headers:{
            'Content-Type': 'application/json',
            'Authorization':`Token ${token}`
        },
        body:JSON.stringify({topic, entry})
    })

    const res = req.json();

    console.log(res.topic)

    document.getElementById(`note-topic-${id}`).innerText=res.topic;
    document.getElementById(`note-entry-${id}`).innerText=res.entry;
    window.location.reload();
    if(req.ok){
        alert('Edited successfully');
    }
    cancelEdit();
})

function logout(){
    localStorage.removeItem('token');
    window.location.href='index.html'
}

listNotes();
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
document.addEventListener('DOMContentLoaded', () => {



registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if(password !== confirmPassword){
        const error = document.getElementById('error');
        error.style.color = 'red'
        error.style.fontSize = '1.3rem'
        error.textContent = 'Passwords do not match!';
        return;
    }

    const req = await fetch('http://127.0.0.1:8000/api/register/', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({
            username, email, password
        })
    })

    const res = await req.json();

    if(req.ok){
        const username = res.user.username
        const token = res.token
        localStorage.setItem('token',token);
        localStorage.setItem('username', username);
        alert('Registration successfull!');
        window.location.href ='login.html';
    }else{
        const error = document.getElementById('error');
        error.style.color = 'red'
        error.style.fontSize = '1.3rem';
        error.textContent = 'Unexpected error occured!';
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('email').value.trim();

    const req = await fetch('http://127.0.0.1:8000/api/login/', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            username, password
        })

    })

    const res = await req.json();

    if(req.ok){
        const token = res.data.token;
        const username = res.data.user.username
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        alert('Login successfull!')
    }
})


})
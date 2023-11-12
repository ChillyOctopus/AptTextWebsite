async function login(){
    const username = document.getElementById("username").textContent;
    const password = document.getElementById("password").textContent;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: {"username": username, "password": password}
    });

    console.log(response.body);
}
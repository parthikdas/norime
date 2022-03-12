const api = 'http://localhost:3000/data'
let showSection = document.getElementById('showSection'), heading = document.getElementById('heading'), submit = document.getElementById('submit'), expenseTracker = document.getElementById('expenseTracker')
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const passInput = document.getElementById('pass-input');
const confirmPassInput = document.getElementById('confirm-pass-input');
let currentUserId = -1

showSection.addEventListener('click',()=>{
    if(showSection.classList.contains('signin')) { // show signout
        showSection.classList.remove('signin')
        nameInput.style.display = confirmPassInput.style.display = 'block'
        showSection.classList.add('signout')
        showSection.innerHTML = 'Click here to Signin'
        heading.innerHTML = 'Sign out'
        submit.onclick = () => { signout() }
    } else { // show signin
        showSection.classList.remove('signout')
        nameInput.style.display = confirmPassInput.style.display = 'none'
        showSection.classList.add('signin')
        showSection.innerHTML = 'Click here to Signout'
        heading.innerHTML = 'Sign in'
        submit.onclick = () => { signin() }
    }
})

function signin() {
    const user_email = document.getElementById('email');
    const user_password = document.getElementById('password');
    if (user_email.value && user_password.value) {
        fetch(api)
        .then(data => data.json())
        .then(data => {
            for(let i=0;i<data.length;i++) {
                if(data[i].email === user_email.value) {
                    currentUserId = data[i].id
                    break
                }
            }
            if(currentUserId === -1) {
                alert("Please Signup.")
                user_email.value = user_password.value = ""
            } else {
                // successful login
                expenseTracker.style.display = 'block'
                document.getElementById('containerShow').style.display = 'none'
            }
        })
    }
}

function signout() {
    const user_name = document.getElementById('name');
    const user_email = document.getElementById('email');
    const user_password = document.getElementById('password');
    const user_confirm_password = document.getElementById('confirm_password');
    if (user_name.value && user_email.value && user_password.value && user_confirm_password.value) {
        if (user_password.value == user_confirm_password.value) {
            fetch("http://localhost:3000/data")
                .then(data => data.json())
                .then(data => {
                    data.push({
                        id: data.length,
                        name: user_name.value,
                        email: user_email.value,
                        password: user_password.value
                    })
                    fetch("http://localhost:3000/data", {
                        method: "POST",
                        body: JSON.stringify(data)
                    }).then(data => data.json()).then(data => console.log(data))
                })
        } else {
            alert("Password not same");
            user_password.innerHTML = user_confirm_password.innerHTML = "";
        }
    }
}

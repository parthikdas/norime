const api = 'http://localhost:3000/data'
let showSection = document.getElementById('showSection'), heading = document.getElementById('heading'), submit = document.getElementById('submit'), expenseTracker = document.getElementById('expenseTracker')
const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const passInput = document.getElementById('pass-input');
const confirmPassInput = document.getElementById('confirm-pass-input');
let currentUserId = -1, balance = 0

showSection.addEventListener('click',()=>{
    if(showSection.classList.contains('signin')) { // show signout
        showSection.classList.remove('signin')
        nameInput.style.display = confirmPassInput.style.display = 'block'
        showSection.classList.add('signout')
        showSection.innerHTML = 'Click here to Signin'
        heading.innerHTML = 'Sign out'
        submit.onclick = () => { signout() }
        document.getElementById('iframe').style.display = 'block'
    } else { // show signin
        showSection.classList.remove('signout')
        nameInput.style.display = confirmPassInput.style.display = 'none'
        showSection.classList.add('signin')
        showSection.innerHTML = 'Click here to Signout'
        heading.innerHTML = 'Sign in'
        submit.onclick = () => { signin() }
        document.getElementById('iframe').style.display = 'none'
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
                document.getElementById('showUser').innerHTML = 'Hi, ' + data[currentUserId].name
                document.getElementById('logout').style.display = 'block'
                expenseTracker.style.display = 'block'
                document.getElementById('containerShow').style.display = 'none'
                balance = parseInt(data[currentUserId].balance)
                showExpenseTracker()
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
            fetch(api)
                .then(data => data.json())
                .then(data => {
                    data.push({
                        id: data.length,
                        name: user_name.value,
                        email: user_email.value,
                        password: user_password.value,
                        balance: 0,
                        transaction: []
                    })
                    fetch(api, {
                        method: "POST",
                        body: JSON.stringify(data)
                    }).then(data => data.json()).then(data => console.log(data))
                    user_name.value = user_email.value = user_password.value = user_confirm_password.value = ''
                })
        } else {
            alert("Password not same");
            user_password.innerHTML = user_confirm_password.innerHTML = "";
        }
    }
}

function showExpenseTracker() {
    fetch(api)
    .then(data => data.json())
    .then(data => {
        document.getElementById('balance').innerHTML = 'Balance: ' + balance
        transactionHistory()
    })
}

function deposit() {
    const expenseName = document.getElementById('expenseName'), expenseAmount = document.getElementById('expenseAmount')
    if(expenseName.value && expenseAmount.value) {
        fetch(api)
        .then(data => data.json())
        .then(data => {
            data[currentUserId].transaction.push({
              name: expenseName.value,
              amount: expenseAmount.value,
              type: 'deposit'
            })
            balance += parseInt(expenseAmount.value)
            data[currentUserId].balance = balance
            fetch(api, {
                method: "POST",
                body: JSON.stringify(data)
            }).then(data => data.json()).then(data => console.log(data))
            showExpenseTracker()
            expenseName.value = expenseAmount.value = ''
        })
    }
}
function withdraw() {
    const expenseName = document.getElementById('expenseName'), expenseAmount = document.getElementById('expenseAmount')
    if(expenseName.value && expenseAmount.value) {
        fetch(api)
        .then(data => data.json())
        .then(data => {
            data[currentUserId].transaction.push({
              name: expenseName.value,
              amount: expenseAmount.value,
              type: 'withdraw'
            })
            balance -= parseInt(expenseAmount.value)
            data[currentUserId].balance = balance
            fetch(api, {
                method: "POST",
                body: JSON.stringify(data)
            }).then(data => data.json()).then(data => console.log(data))
            showExpenseTracker()
            expenseName.value = expenseAmount.value = ''
        })
    }
}
function transactionHistory() {
    const transactionSection = document.getElementById('transaction')
    transactionSection.textContent = ''
    fetch(api)
    .then(data => data.json())
    .then(data => {
        let userTransaction = data[currentUserId].transaction
        console.log(userTransaction)
        for(let i=0;i<userTransaction.length;i++) {
            let div = document.createElement('div')
            div.innerHTML = userTransaction[i].name + ' ' + userTransaction[i].amount
            div.style.color = userTransaction[i].type === 'deposit' ? 'green' : 'red'
            div.style.padding = '.5rem'
            div.style.borderBottom = '1px solid #e7e4e4'
            transactionSection.append(div)
        }
    })
}
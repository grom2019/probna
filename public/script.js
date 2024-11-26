function showForm(formType) {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerTab').classList.remove('active');
    document.getElementById('loginTab').classList.remove('active');

    if (formType === 'register') {
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('registerTab').classList.add('active');
    } else {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('loginTab').classList.add('active');
    }
}

function registerUser() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Реєстрація успішна!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Помилка реєстрації');
    });
}

function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Вхід успішний!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Помилка входу');
    });
}

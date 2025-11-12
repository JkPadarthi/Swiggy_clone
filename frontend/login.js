document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    
    // Clear previous messages
    messageDiv.textContent = '';
    messageDiv.className = 'message';
    
    // Validation
    if (!username || !password) {
        messageDiv.textContent = 'Please enter both username and password';
        messageDiv.className = 'message error';
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    messageDiv.textContent = 'Connecting to server...';
    messageDiv.className = 'message info';
    
    try {
        console.log('Sending login request:', { username, password: '***' });
        
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
            messageDiv.textContent = '✅ Login successful! Redirecting...';
            messageDiv.className = 'message success';
            localStorage.setItem('user', JSON.stringify(data.user));
            setTimeout(() => {
                window.location.href = '/restaurants';
            }, 1000);
        } else {
            messageDiv.textContent = '❌ ' + (data.message || 'Login failed. Please check your credentials.');
            messageDiv.className = 'message error';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    } catch (error) {
        console.error('Login error:', error);
        messageDiv.textContent = '❌ Error: ' + error.message + '. Please check if the server is running.';
        messageDiv.className = 'message error';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
});


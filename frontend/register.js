document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    
    // Clear previous messages
    messageDiv.textContent = '';
    messageDiv.className = 'message';
    
    // Validation
    if (!username || !password) {
        messageDiv.textContent = 'Please enter username and password';
        messageDiv.className = 'message error';
        return;
    }
    
    if (username.length < 3) {
        messageDiv.textContent = 'Username must be at least 3 characters';
        messageDiv.className = 'message error';
        return;
    }
    
    if (password.length < 3) {
        messageDiv.textContent = 'Password must be at least 3 characters';
        messageDiv.className = 'message error';
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    messageDiv.textContent = 'Connecting to server...';
    messageDiv.className = 'message info';
    
    try {
        console.log('Sending registration request:', { username, email, password: '***' });
        
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
            messageDiv.textContent = '✅ Registration successful! Redirecting to login...';
            messageDiv.className = 'message success';
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        } else {
            messageDiv.textContent = '❌ ' + (data.message || 'Registration failed. Username may already exist.');
            messageDiv.className = 'message error';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
        }
    } catch (error) {
        console.error('Registration error:', error);
        messageDiv.textContent = '❌ Error: ' + error.message + '. Please check if the server is running.';
        messageDiv.className = 'message error';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
    }
});


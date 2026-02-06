  // Form switching animations
        function switchToSignup() {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            
            loginForm.classList.remove('active');
            loginForm.classList.add('hidden');
            
            setTimeout(() => {
                signupForm.classList.remove('hidden');
                signupForm.classList.add('active');
            }, 100);
        }

        function switchToLogin() {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            
            signupForm.classList.remove('active');
            signupForm.classList.add('hidden');
            
            setTimeout(() => {
                loginForm.classList.remove('hidden');
                loginForm.classList.add('active');
            }, 100);
        }

        // Password visibility toggle
        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            input.type = input.type === 'password' ? 'text' : 'password';
        }

        // Social login handler
        function socialLogin(provider) {
            alert(`${provider} authentication would be implemented here`);
        }

        // Login form submission
        document.getElementById('loginFormElement').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btn = this.querySelector('.btn-primary');
            btn.classList.add('loading');
            btn.textContent = '';
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            console.log('Login attempt:', { email, password });
            alert(`Login successful!\nEmail: ${email}`);
            window.location = "/Html/index.html"
            
            btn.classList.remove('loading');
            btn.textContent = 'Sign In';
            this.reset();
        });

        // Signup form submission
        document.getElementById('signupFormElement').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            const btn = this.querySelector('.btn-primary');
            btn.classList.add('loading');
            btn.textContent = '';
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            
            console.log('Signup attempt:', { name, email, password });
            alert(`Account created successfully!\nWelcome, ${name}!`);
            window.location="/Html/index.html";
            btn.classList.remove('loading');
            btn.textContent = 'Create Account';
            this.reset();
        });

        // Add subtle parallaxlo effect to background gradients
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const before = document.querySelector('body::before');
            const after = document.querySelector('body::after');
            
            document.body.style.setProperty('--mouse-x', mouseX);
            document.body.style.setProperty('--mouse-y', mouseY);
        });
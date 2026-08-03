document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const authView = document.getElementById('auth-view');
    const todoView = document.getElementById('todo-view');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const logoutBtn = document.getElementById('logout-btn');
    const addTodoForm = document.getElementById('add-todo-form');
    const todoListEl = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const userGreeting = document.getElementById('user-greeting');

    let currentFilter = 'all';

    // Toggle Auth Tabs
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.classList.add('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.remove('active');
        registerForm.classList.add('hidden');
        loginError.textContent = '';
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerForm.classList.add('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.remove('active');
        loginForm.classList.add('hidden');
        registerError.textContent = '';
    });

    // Helper for API calls
    async function apiCall(url, options = {}) {
        options.headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        const res = await fetch(url, options);
        let data = {};
        try {
            const text = await res.text();
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            data = {};
        }
        
        if (!res.ok) {
            if (res.status === 401 && !url.includes('/auth/')) {
                showAuth();
            }
            throw new Error(data.message || data || 'Something went wrong');
        }
        return data;
    }

    // View Switching
    function showApp() {
        authView.classList.remove('active');
        setTimeout(() => {
            authView.style.display = 'none';
            todoView.style.display = 'block';
            setTimeout(() => todoView.classList.add('active'), 10);
            loadTodos();
        }, 300);
    }

    function showAuth() {
        todoView.classList.remove('active');
        setTimeout(() => {
            todoView.style.display = 'none';
            authView.style.display = 'block';
            setTimeout(() => authView.classList.add('active'), 10);
        }, 300);
    }

    // Auth Handlers
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const btn = loginForm.querySelector('button');
        btn.innerHTML = '<span class="loader"></span> Loading...';
        btn.disabled = true;

        try {
            await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            userGreeting.textContent = `Hello, ${email.split('@')[0]}!`;
            showApp();
        } catch (err) {
            loginError.textContent = err.message;
        } finally {
            btn.innerHTML = 'Sign In';
            btn.disabled = false;
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const btn = registerForm.querySelector('button');
        btn.innerHTML = '<span class="loader"></span> Loading...';
        btn.disabled = true;

        try {
            await apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });
            tabLogin.click(); // Switch to login tab
            document.getElementById('login-email').value = email;
            loginError.textContent = 'Registration successful! Please login.';
            loginError.style.color = 'var(--success)';
        } catch (err) {
            registerError.textContent = err.message;
        } finally {
            btn.innerHTML = 'Sign Up';
            btn.disabled = false;
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            await apiCall('/auth/logout', { method: 'POST' });
            showAuth();
        } catch (err) {
            console.error(err);
            showAuth();
        }
    });

    // Todo Handlers
    let todos = [];

    async function loadTodos() {
        try {
            const data = await apiCall('/todos');
            todos = Array.isArray(data) ? data : [];
            renderTodos();
        } catch (err) {
            console.error('Failed to load todos', err);
        }
    }

    addTodoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('todo-title').value;
        const description = document.getElementById('todo-desc').value;
        const dueTime = document.getElementById('todo-time').value;

        try {
            await apiCall('/todos', {
                method: 'POST',
                body: JSON.stringify({ title, description, dueTime })
            });
            addTodoForm.reset();
            loadTodos();
        } catch (err) {
            console.error('Failed to add todo', err);
            alert(err.message);
        }
    });

    async function toggleTodoStatus(id, currentStatus) {
        try {
            const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
            const todo = todos.find(t => t.id === id);
            await apiCall(`/todos/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus, description: todo.description })
            });
            loadTodos();
        } catch (err) {
            console.error('Failed to update todo', err);
        }
    }

    async function deleteTodo(id) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await apiCall(`/todos/${id}`, {
                method: 'DELETE'
            });
            loadTodos();
        } catch (err) {
            console.error('Failed to delete todo', err);
        }
    }

    // Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    function renderTodos() {
        todoListEl.innerHTML = '';
        
        let filteredTodos = todos;
        if (currentFilter !== 'all') {
            filteredTodos = todos.filter(t => t.status === currentFilter);
        }

        if (filteredTodos.length === 0) {
            todoListEl.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 20px;">No tasks found.</p>`;
            return;
        }

        filteredTodos.forEach(todo => {
            const isCompleted = todo.status === 'completed';
            const li = document.createElement('li');
            li.className = `todo-item ${isCompleted ? 'completed' : ''}`;
            
            const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

            li.innerHTML = `
                <div class="todo-checkbox ${isCompleted ? 'checked' : ''}" data-id="${todo.id}">
                    ${checkIcon}
                </div>
                <div class="todo-content">
                    <div class="todo-title">${escapeHTML(todo.title)}</div>
                    ${todo.description ? `<div class="todo-desc">${escapeHTML(todo.description)}</div>` : ''}
                    ${todo.dueTime ? `<div class="todo-time">Due: ${formatDate(todo.dueTime)}</div>` : ''}
                </div>
                <button class="delete-btn" data-id="${todo.id}" title="Delete">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
            `;

            todoListEl.appendChild(li);

            // Add events
            const checkbox = li.querySelector('.todo-checkbox');
            checkbox.addEventListener('click', () => toggleTodoStatus(todo.id, todo.status || 'pending'));

            const delBtn = li.querySelector('.delete-btn');
            delBtn.addEventListener('click', () => deleteTodo(todo.id));
        });
    }

    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        if(isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    // Initial check
    apiCall('/todos')
        .then(data => {
            if (Array.isArray(data)) {
                todos = data;
                userGreeting.textContent = `Welcome back!`;
                showApp();
            } else {
                showAuth();
            }
        })
        .catch(err => {
            showAuth();
        });
});

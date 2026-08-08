document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const userControls = document.getElementById('user-controls');
    const resultContainer = document.getElementById('result-container');
    const randomBtn = document.getElementById('random-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const categoryPills = document.querySelectorAll('.category-filters .pill');

    // Khởi tạo ứng dụng
    checkAuth();

    // DOM Elements cho Navigation
    const navHome = document.getElementById('nav-home');
    const navFoods = document.getElementById('nav-foods');
    const heroSection = document.getElementById('hero-section');
    const searchBarWrapper = document.getElementById('search-bar-wrapper');
    const categorySection = document.getElementById('category-section');

    // Đã thay thế logic Khôi phục trang chủ ở dưới

    navFoods.addEventListener('click', (e) => {
        e.preventDefault();
        navFoods.classList.add('active');
        navHome.classList.remove('active');

        heroSection.style.display = 'none';
        searchBarWrapper.style.display = 'flex';

        categoryPills.forEach(p => p.classList.remove('active'));
        categoryPills[0].classList.add('active');
        if (searchInput) searchInput.value = '';

        loadAllFoods();
    });

    // --- 1. XỬ LÝ AUTHENTICATION (Đăng nhập/Đăng xuất) ---
    function checkAuth() {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (token && username) {
            // Đã đăng nhập
            userControls.innerHTML = `
                <div class="user-info">Xin chào, <span>${username}</span></div>
                <button class="btn-secondary" onclick="logout()">Đăng xuất</button>
            `;
        } else {
            // Khách
            userControls.innerHTML = `
                <div class="user-info">👤 Khách</div>
                <button class="btn-secondary" onclick="openModal('login-modal')">Đăng nhập</button>
                <button class="btn-primary" onclick="openModal('register-modal')">Đăng ký</button>
            `;
        }
    }

    window.logout = function () {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        checkAuth();
    };

    // --- 2. XỬ LÝ MODAL ---
    window.openModal = function (modalId) {
        document.getElementById(modalId).classList.add('show');
    };

    window.closeModal = function (modalId) {
        document.getElementById(modalId).classList.remove('show');
    };

    window.switchModal = function (closeId, openId) {
        closeModal(closeId);
        openModal(openId);
    };

    // Đóng modal khi bấm ra ngoài
    window.onclick = function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
        }
    };

    // --- 3. ĐĂNG NHẬP / ĐĂNG KÝ API ---
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = '';

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: username, userPassword: password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Lỗi đăng nhập');

            // Lưu token
            localStorage.setItem('token', data.token);
            // Decode token để lấy username (cách đơn giản)
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            localStorage.setItem('username', payload.username);

            closeModal('login-modal');
            checkAuth();
            alert('Đăng nhập thành công!');
        } catch (error) {
            errorDiv.textContent = error.message;
        }
    });

    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('register-error');
        errorDiv.textContent = '';

        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, userName: username, userPassword: password })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Lỗi đăng ký');

            alert('Đăng ký thành công! Hãy đăng nhập nhé.');
            switchModal('register-modal', 'login-modal');
        } catch (error) {
            errorDiv.textContent = error.message;
        }
    });

    // --- 4. TÌM KIẾM & PHÂN LOẠI MÓN ĂN ---
    async function loadAllFoods() {
        try {
            const res = await fetch('/api/foods');
            const data = await res.json();
            renderFoods(data);
        } catch (error) {
            console.error(error);
        }
    }

    // Tìm kiếm theo tên
    if (searchBtn) {
        searchBtn.addEventListener('click', async () => {
            const query = searchInput.value.trim();
            if (!query) return loadAllFoods();

            // Xóa trạng thái active của các pills
            categoryPills.forEach(p => p.classList.remove('active'));

            try {
                const res = await fetch(`/api/foods/name?name=${query}`);
                if (!res.ok) throw new Error('Không tìm thấy');
                const data = await res.json();
                renderFoods(data);
            } catch (error) {
                resultContainer.innerHTML = `<div class="empty-state">😢 Không tìm thấy món nào tên "${query}"</div>`;
            }
        });
    }

    // Lọc theo Category (Hỗ trợ chọn nhiều)
    categoryPills.forEach(pill => {
        pill.addEventListener('click', async () => {
            const tag = pill.getAttribute('data-tag');

            if (tag === 'all') {
                categoryPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            } else {
                const allPill = document.querySelector('.category-filters .pill[data-tag="all"]');
                if (allPill) allPill.classList.remove('active');

                pill.classList.toggle('active');

                const anyActive = document.querySelector('.category-filters .pill.active');
                if (!anyActive) {
                    if (allPill) allPill.classList.add('active');
                }
            }

            // Nếu đang ở tab Món ăn, load lại danh sách lưới ngay
            if (navFoods.classList.contains('active')) {
                if (searchInput) searchInput.value = '';

                const activePills = document.querySelectorAll('.category-filters .pill.active');
                const selectedTags = Array.from(activePills).map(p => p.getAttribute('data-tag'));

                if (selectedTags.includes('all') || selectedTags.length === 0) {
                    return loadAllFoods();
                }

                const tagsQuery = selectedTags.join(',');
                try {
                    const res = await fetch(`/api/foods/tag?tag=${encodeURIComponent(tagsQuery)}`);
                    if (!res.ok) throw new Error('Không có món');
                    const data = await res.json();
                    renderFoods(data);
                } catch (error) {
                    resultContainer.innerHTML = `<div class="empty-state">🤔 Không có món nào thuộc các danh mục này</div>`;
                }
            }
        });
    });

    // DOM Elements cho chức năng Random mới
    const initialRandomWrapper = document.getElementById('initial-random-wrapper');
    const initialHintText = document.getElementById('initial-hint-text');
    const randomResultCard = document.getElementById('random-result-card');
    const randomBtnAgain = document.getElementById('random-btn-again');

    // Hàm quay random chung
    async function performRandomSpin() {
        // Ẩn nút to ban đầu
        initialRandomWrapper.style.display = 'none';
        initialHintText.style.display = 'none';

        // Ẩn nút quay lại (nếu đang bấm từ nút quay lại)
        randomBtnAgain.style.display = 'none';

        // Hiển thị khung kết quả với thẻ bài xoay
        randomResultCard.style.display = 'block';
        randomResultCard.innerHTML = `
            <div class="spinning-card-container">
                <div class="spinning-card">
                    <i class="ph-bold ph-question"></i>
                    <h3>Đang bói món...</h3>
                </div>
            </div>
        `;

        // Cuộn nhẹ xuống để nhìn rõ
        randomResultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        try {
            const activePills = document.querySelectorAll('.category-filters .pill.active');
            const selectedTags = Array.from(activePills).map(p => p.getAttribute('data-tag')).filter(t => t !== 'all');
            const tagsQuery = selectedTags.length > 0 ? `?tags=${encodeURIComponent(selectedTags.join(','))}` : '';

            const res = await fetch(`/api/foods/random${tagsQuery}`);
            if (!res.ok) throw new Error('Không tìm thấy món phù hợp');
            const food = await res.json();

            setTimeout(() => {
                // Hiển thị món ăn
                const imageUrl = food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                randomResultCard.innerHTML = `
                    <div class="food-card" style="width: 100%;">
                        <img src="${imageUrl}" alt="${food.name}" class="food-image">
                        <div class="food-content">
                            <h2 class="food-title">${food.name}</h2>
                            <p class="food-desc">${food.description || 'Chưa có mô tả chi tiết.'}</p>
                            <div class="food-tag">#${food.tag || 'Món ngon'}</div>
                        </div>
                    </div>
                `;

                // Hiện nút Quay lại lần nữa
                randomBtnAgain.style.display = 'flex';

            }, 1500);

        } catch (error) {
            console.error(error);
            randomResultCard.innerHTML = `<div class="empty-state" style="padding: 2rem 1rem;">😢 Không có món nào phù hợp với bộ lọc!</div>`;
            randomBtnAgain.style.display = 'flex';
        }
    }

    if (randomBtn) {
        randomBtn.addEventListener('click', performRandomSpin);
    }

    if (randomBtnAgain) {
        randomBtnAgain.addEventListener('click', performRandomSpin);
    }

    // --- Khôi phục trang chủ (reset random) khi bấm Trang chủ ---
    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        navHome.classList.add('active');
        navFoods.classList.remove('active');

        heroSection.style.display = 'block';
        searchBarWrapper.style.display = 'none';

        // Khôi phục giao diện random mặc định
        initialRandomWrapper.style.display = 'flex';
        initialHintText.style.display = 'flex';
        randomResultCard.style.display = 'none';
        randomResultCard.innerHTML = '';
        randomBtnAgain.style.display = 'none';

        // Trả lại trạng thái mặc định category
        categoryPills.forEach(p => p.classList.remove('active'));
        categoryPills[0].classList.add('active');

        resultContainer.innerHTML = `
            <div class="empty-state-card" id="initial-empty-state">
                <i class="ph-fill ph-sparkle"></i>
                <p>Nhấn <span class="highlight">"Quay Random"</span> để xem món ăn gợi ý nhé!</p>
            </div>
        `;
    });

    // --- 5. RENDER GIAO DIỆN MÓN ĂN ---
    function renderFoods(foods) {
        resultContainer.innerHTML = ''; // Xóa kết quả cũ

        if (!foods || foods.length === 0) {
            resultContainer.innerHTML = `<div class="empty-state">Chưa có món ăn nào trong hệ thống!</div>`;
            return;
        }

        foods.forEach(food => {
            const card = document.createElement('div');
            card.className = 'food-card';

            const imageUrl = food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

            card.innerHTML = `
                <img src="${imageUrl}" alt="${food.name}" class="food-image">
                <div class="food-content">
                    <h2 class="food-title">${food.name}</h2>
                    <p class="food-desc">${food.description || 'Chưa có mô tả chi tiết.'}</p>
                    <div class="food-tag">#${food.tag || 'Món ngon'}</div>
                </div>
            `;
            resultContainer.appendChild(card);
        });
    }
});

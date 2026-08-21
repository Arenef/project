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

        document.getElementById('main-layout-grid').style.display = 'none';
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
                <button class="btn-secondary" id="user-favorites-btn" style="margin-right: 10px;">⭐ Đã lưu</button>
                <button class="btn-secondary" id="user-history-btn" style="margin-right: 10px;">📜 Lịch sử</button>
                <button class="btn-secondary" onclick="logout()">Đăng xuất</button>
            `;
            document.getElementById('user-history-btn').addEventListener('click', (e) => window.showHistory(e));
            document.getElementById('user-favorites-btn').addEventListener('click', (e) => window.showFavorites(e));
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

            let isFavorite = false;
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const favRes = await fetch('/api/foods/fav', { headers: { 'Authorization': `Bearer ${token}` } });
                    if (favRes.ok) {
                        const favData = await favRes.json();
                        if (favData.data) {
                            isFavorite = favData.data.some(f => f.id === food.id);
                        }
                    }
                } catch(e) { console.error('Lỗi check fav:', e); }
            }

            setTimeout(() => {
                // Hiển thị món ăn
                const imageUrl = food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

                randomResultCard.innerHTML = `
                    <div class="random-card-horizontal fade-in">
                        <img src="${imageUrl}" alt="${food.name}" class="food-image">
                        <div class="food-content">
                            <h2 class="food-title" style="font-size: 1.5rem; margin-bottom: 0.25rem">${food.name}</h2>
                            <p class="food-desc" style="margin-bottom: 1rem; color: var(--text-muted)">${food.description || 'Món ăn cực ngon đang chờ bạn thưởng thức.'}</p>
                            <div style="display:flex; gap: 0.5rem; margin-bottom: 1.5rem">
                                <span class="food-tag">#${food.tag || 'Món ngon'}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                <button class="btn-primary" style="padding: 0.8rem; font-size: 1rem;" onclick="pickFood(${food.id})">
                                    <i class="ph-bold ph-arrows-left-right"></i> Lụm món này 🤤
                                </button>
                                ${isFavorite 
                                    ? `<button class="btn-secondary btn-saved" style="padding: 0.8rem; font-size: 1rem; background-color: #fef08a; border-color: #facc15; color: #a16207;" onclick="removeFood(${food.id})"><i class="ph-fill ph-star"></i> Món này đã lưu</button>`
                                    : `<button class="btn-secondary btn-save" style="padding: 0.8rem; font-size: 1rem;" onclick="saveFood(${food.id})"><i class="ph-fill ph-star" style="color:#f59e0b"></i> Lưu món này</button>`
                                }
                            </div>
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

        document.getElementById('main-layout-grid').style.display = '';
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

        resultContainer.innerHTML = '';
    });

    // --- 5. RENDER GIAO DIỆN MÓN ĂN ---
    async function renderFoods(foods) {
        resultContainer.innerHTML = ''; // Xóa kết quả cũ

        if (!foods || foods.length === 0) {
            resultContainer.innerHTML = `<div class="empty-state">Chưa có món ăn nào trong hệ thống!</div>`;
            return;
        }

        // Lấy danh sách món đã lưu để hiển thị đúng trạng thái icon
        let savedIds = [];
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await fetch('/api/foods/fav', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok && data.data) {
                    savedIds = data.data.map(f => f.id);
                }
            } catch(e) { /* ignore */ }
        }

        foods.forEach(food => {
            const card = document.createElement('div');
            card.className = 'food-card';

            const imageUrl = food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
            const isSaved = savedIds.includes(food.id);

            card.innerHTML = `
                <div class="food-card-img-wrapper">
                    <img src="${imageUrl}" alt="${food.name}" class="food-image">
                    <button class="bookmark-btn ${isSaved ? 'bookmarked' : ''}" 
                            data-food-id="${food.id}" 
                            title="${isSaved ? 'Bỏ lưu' : 'Lưu món này'}"
                            onclick="toggleBookmark(this, ${food.id})">
                        <i class="${isSaved ? 'ph-fill' : 'ph'} ph-bookmark-simple"></i>
                    </button>
                </div>
                <div class="food-content">
                    <h2 class="food-title">${food.name}</h2>
                    <p class="food-desc">${food.description || 'Chưa có mô tả chi tiết.'}</p>
                    <div class="food-tag">#${food.tag || 'Món ngon'}</div>
                </div>
            `;
            resultContainer.appendChild(card);
        });
    }

    // --- 6. LOGIC LỊCH SỬ & LỤM MÓN ---
    window.showHistory = async function(e) {
        if (e) e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) return;

        navHome.classList.remove('active');
        navFoods.classList.remove('active');

        document.getElementById('main-layout-grid').style.display = 'none';
        searchBarWrapper.style.display = 'none';

        resultContainer.innerHTML = '<div class="empty-state">Đang tải lịch sử...</div>';

        try {
            const res = await fetch('/api/foods/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message || 'Lỗi lấy lịch sử');
            
            if (data.data && data.data.length > 0) {
                renderHistoryTable(data.data);
            } else {
                resultContainer.innerHTML = `<div class="empty-state-card" style="grid-column: 1 / -1;"><i class="ph-fill ph-ghost"></i><p>Bạn chưa lụm món nào cả! Quay Random để lụm ngay nhé 😢</p></div>`;
            }
        } catch (error) {
             resultContainer.innerHTML = `<div class="empty-state">😢 ${error.message}</div>`;
        }
    };

    function renderHistoryTable(foods) {
        resultContainer.innerHTML = ''; 

        if (!foods || foods.length === 0) {
            resultContainer.innerHTML = `<div class="empty-state-card" style="grid-column: 1 / -1;"><i class="ph-fill ph-ghost"></i><p>Bạn chưa lụm món nào cả! Quay Random để lụm ngay nhé 😢</p></div>`;
            return;
        }

        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'history-table-wrapper fade-in';
        
        let tbodyHTML = foods.map(food => {
            const date = new Date(food.history_created_at || food.created_at);
            const formattedDate = date.toLocaleString('vi-VN', { 
                day: '2-digit', month: '2-digit', year: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
            });
            return `
                <tr>
                    <td class="food-name-cell">${food.name}</td>
                    <td>${formattedDate}</td>
                </tr>
            `;
        }).join('');

        tableWrapper.innerHTML = `
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Tên Món Ăn</th>
                        <th>Thời Gian Lụm</th>
                    </tr>
                </thead>
                <tbody>
                    ${tbodyHTML}
                </tbody>
            </table>
        `;
        resultContainer.appendChild(tableWrapper);
    }

    window.pickFood = async function(foodId) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('🤤 Đã chốt món này! (Bạn đang là khách nên sẽ không lưu lịch sử)');
            return;
        }
        
        try {
            const res = await fetch(`/api/foods/${foodId}/history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message || 'Lỗi lưu lịch sử');
            
            alert('🤤 Đã lụm món này thành công!');
        } catch(err) {
            alert('Lỗi: ' + err.message);
        }
    };

    window.saveFood = async function(foodId) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('⭐ Yêu cầu đăng nhập để lưu món ăn!');
            openModal('login-modal');
            return;
        }
        
        try {
            const res = await fetch(`/api/foods/${foodId}/fav`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message || 'Lỗi khi lưu món');
            
            alert('⭐ Đã lưu món này vào danh sách yêu thích!');
            
            const btn = document.querySelector(`.btn-save[onclick="saveFood(${foodId})"]`);
            if (btn) {
                btn.outerHTML = `<button class="btn-secondary w-100 btn-saved" style="margin-top: 0.5rem; padding: 0.8rem; font-size: 1rem; background-color: #f59e0b; color: white;" onclick="removeFood(${foodId})">⭐ Món này đã lưu</button>`;
            }
        } catch(err) {
            alert('Lỗi: ' + err.message);
        }
    };

    window.removeFood = async function(foodId) {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        try {
            const res = await fetch(`/api/foods/${foodId}/fav`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message || 'Lỗi khi xóa món');
            
            alert('Đã xóa món này khỏi danh sách yêu thích!');
            
            const btn = document.querySelector(`.btn-saved[onclick="removeFood(${foodId})"]`);
            if (btn) {
                btn.outerHTML = `<button class="btn-secondary w-100 btn-save" style="margin-top: 0.5rem; padding: 0.8rem; font-size: 1rem;" onclick="saveFood(${foodId})">⭐ Lưu món này</button>`;
            }
            
            if (resultContainer.querySelector('.history-table')) {
                window.showFavorites();
            }
        } catch(err) {
            alert('Lỗi: ' + err.message);
        }
    };

    // --- TOGGLE BOOKMARK trên Food Card ---
    window.toggleBookmark = async function(btn, foodId) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Bạn cần đăng nhập để lưu món ăn!');
            openModal('login-modal');
            return;
        }

        const isBookmarked = btn.classList.contains('bookmarked');
        const icon = btn.querySelector('i');

        try {
            if (isBookmarked) {
                // Bỏ lưu
                const res = await fetch(`/api/foods/${foodId}/fav`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                btn.classList.remove('bookmarked');
                icon.className = 'ph ph-bookmark-simple';
                btn.title = 'Lưu món này';
            } else {
                // Lưu
                const res = await fetch(`/api/foods/${foodId}/fav`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                btn.classList.add('bookmarked');
                icon.className = 'ph-fill ph-bookmark-simple';
                btn.title = 'Bỏ lưu';

                // Hiệu ứng pop nhẹ
                btn.style.transform = 'scale(1.3)';
                setTimeout(() => btn.style.transform = '', 200);
            }
        } catch(err) {
            alert('Lỗi: ' + err.message);
        }
    };

    window.showFavorites = async function(e) {
        if (e) e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) return;

        navHome.classList.remove('active');
        navFoods.classList.remove('active');

        document.getElementById('main-layout-grid').style.display = 'none';
        searchBarWrapper.style.display = 'none';

        resultContainer.innerHTML = '<div class="empty-state">Đang tải danh sách đã lưu...</div>';

        try {
            const res = await fetch('/api/foods/fav', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message || 'Lỗi lấy danh sách yêu thích');
            
            if (data.data && data.data.length > 0) {
                renderFavoritesTable(data.data);
            } else {
                resultContainer.innerHTML = `<div class="empty-state-card" style="grid-column: 1 / -1;"><i class="ph-fill ph-star"></i><p>Bạn chưa lưu món nào cả!</p></div>`;
            }
        } catch (error) {
             resultContainer.innerHTML = `<div class="empty-state">😢 ${error.message}</div>`;
        }
    };

    function renderFavoritesTable(foods) {
        resultContainer.innerHTML = ''; 

        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'history-table-wrapper fade-in';
        
        let tbodyHTML = foods.map(food => {
            const date = new Date(food.created_at); // time they saved it or it was created
            const formattedDate = date.toLocaleString('vi-VN', { 
                day: '2-digit', month: '2-digit', year: 'numeric'
            });
            return `
                <tr>
                    <td class="food-name-cell">${food.name} <span style="color:#f59e0b; margin-left: 5px; cursor: pointer;" onclick="removeFood(${food.id})" title="Xóa khỏi danh sách">❌</span></td>
                    <td>${food.tag || ''}</td>
                </tr>
            `;
        }).join('');

        tableWrapper.innerHTML = `
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Tên Món Ăn</th>
                        <th>Danh Mục</th>
                    </tr>
                </thead>
                <tbody>
                    ${tbodyHTML}
                </tbody>
            </table>
        `;
        resultContainer.appendChild(tableWrapper);
    }

    // --- 7. BẢNG XẾP HẠNG ---
    window.fetchRanking = async function(type = 'day') {
        const tabs = document.querySelectorAll('.ranking-tabs .pill-sm');
        tabs.forEach(tab => tab.classList.remove('active'));
        
        const activeTab = document.getElementById(`rank-${type}`);
        if (activeTab) activeTab.classList.add('active');

        const container = document.getElementById('ranking-container');
        if (!container) return;
        
        container.innerHTML = '<div class="empty-state-card" style="width: 100%; text-align: center; color: var(--text-light);">Đang tải bảng xếp hạng...</div>';

        try {
            const res = await fetch(`/api/foods/frank?type=${type}`);
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message || 'Lỗi lấy bảng xếp hạng');

            if (!data.data || data.data.length === 0) {
                container.innerHTML = `<div class="empty-state-card" style="width: 100%; text-align: center; color: var(--text-light);">Chưa có món ăn nào được chọn trong khoảng thời gian này.</div>`;
                return;
            }

            const maxCount = data.data[0].total_count || 1;
            const top3 = data.data.slice(0, 3);
            
            container.innerHTML = top3.map((food, index) => {
                const imageUrl = food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                const medal = (index + 1);
                const percent = Math.min(100, Math.round((food.total_count / maxCount) * 100));
                
                return `
                    <div class="ranking-item">
                        <div class="ranking-medal">${medal}</div>
                        <img src="${imageUrl}" class="ranking-item-img" alt="${food.name}">
                        <div class="ranking-item-info">
                            <div class="ranking-item-name">${food.name}</div>
                            <div class="ranking-item-count"><i class="ph-fill ph-fork-knife" style="color:var(--text-muted)"></i> ${food.total_count} lần</div>
                            <div class="ranking-item-bar-bg">
                                <div class="ranking-item-bar" style="width: ${percent}%"></div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            container.innerHTML = `<div class="empty-state-card" style="width: 100%; text-align: center; color: var(--primary-color);">Lỗi: ${error.message}</div>`;
        }
    };

    // Load ranking lúc khởi tạo
    if (document.getElementById('ranking-container')) {
        fetchRanking('day');
    }
});

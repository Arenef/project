document.addEventListener('DOMContentLoaded', () => {
    const randomBtn = document.getElementById('random-btn');
    const resultContainer = document.getElementById('result-container');

    randomBtn.addEventListener('click', async () => {
        // 1. Hiệu ứng loading trên nút
        randomBtn.classList.add('loading');
        
        // Làm mờ content cũ (nếu có)
        const oldCard = document.querySelector('.food-card');
        if (oldCard) {
            oldCard.style.opacity = '0.5';
            oldCard.style.transform = 'scale(0.95)';
        }

        try {
            // 2. Gọi API để lấy món ăn ngẫu nhiên
            const response = await fetch('/api/foods/random');
            
            if (!response.ok) {
                throw new Error('Lỗi khi lấy dữ liệu từ server');
            }
            
            const food = await response.json();

            // Giả lập thời gian delay một chút xíu (500ms) để nhìn thấy loading cho giống app thật
            setTimeout(() => {
                // 3. Render Card
                renderFoodCard(food);
                // Tắt loading
                randomBtn.classList.remove('loading');
            }, 500);

        } catch (error) {
            console.error('Lỗi:', error);
            resultContainer.innerHTML = `
                <div class="empty-state" style="color: var(--primary-color); border-color: var(--primary-color);">
                    Oops! Có lỗi xảy ra. Hãy thử lại nhé. 🥲<br>
                    <small>${error.message}</small>
                </div>
            `;
            randomBtn.classList.remove('loading');
        }
    });

    function renderFoodCard(food) {
        // Xóa nội dung cũ
        resultContainer.innerHTML = '';

        // Tạo phần tử card
        const card = document.createElement('div');
        card.className = 'food-card';

        // Nếu món ăn chưa có ảnh, dùng một ảnh mặc định
        const imageUrl = food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

        card.innerHTML = `
            <img src="${imageUrl}" alt="${food.name}" class="food-image">
            <div class="food-content">
                <h2 class="food-title">${food.name}</h2>
                <p class="food-desc">${food.description || 'Chưa có mô tả chi tiết.'}</p>
                <div class="food-tag">#${food.tag || 'Món ngon'}</div>
            </div>
        `;

        // Đưa card vào container (sẽ tự động chạy animation popIn nhờ CSS)
        resultContainer.appendChild(card);
    }
});

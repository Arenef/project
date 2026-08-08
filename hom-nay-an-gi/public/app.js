document.addEventListener('DOMContentLoaded', () => {
    const randomBtn = document.getElementById('random-btn');
    
    // Featured Card Elements
    const fcTitle = document.getElementById('fc-title');
    const fcDesc = document.getElementById('fc-desc');
    const fcImage = document.getElementById('fc-image');
    const fcMeta = document.getElementById('fc-meta');
    const featuredCard = document.getElementById('featured-card');

    randomBtn.addEventListener('click', async () => {
        // 1. Hiệu ứng loading trên nút
        randomBtn.classList.add('loading');
        
        // Làm mờ content cũ (nếu có)
        if (featuredCard) {
            featuredCard.style.opacity = '0.7';
            featuredCard.style.transform = 'scale(0.98)';
            featuredCard.style.transition = 'all 0.3s ease';
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
                // 3. Cập nhật Featured Card
                fcTitle.textContent = `${food.name} 🍽️`;
                fcDesc.textContent = food.description || 'Chưa có mô tả chi tiết.';
                
                const imageUrl = food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                fcImage.src = imageUrl;
                fcImage.alt = food.name;
                
                fcMeta.innerHTML = `<i class="ph ph-lightbulb"></i> Gợi ý dựa trên: ${food.tag || 'Ngẫu nhiên'} <i class="ph ph-pencil-simple"></i>`;

                // Phục hồi hiệu ứng
                if (featuredCard) {
                    featuredCard.style.opacity = '1';
                    featuredCard.style.transform = 'scale(1)';
                }
                
                // Tắt loading
                randomBtn.classList.remove('loading');
            }, 500);

        } catch (error) {
            console.error('Lỗi:', error);
            alert(`Oops! Có lỗi xảy ra: ${error.message}`);
            
            if (featuredCard) {
                featuredCard.style.opacity = '1';
                featuredCard.style.transform = 'scale(1)';
            }
            randomBtn.classList.remove('loading');
        }
    });

    // Interactive UI for Category Pills (Visual only)
    const pills = document.querySelectorAll('.pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active', 'bg-orange-light'));
            pill.classList.add('active');
        });
    });

    // Interactive UI for Ranking Tabs (Visual only)
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});

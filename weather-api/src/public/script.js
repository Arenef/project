const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const errorDiv = document.getElementById('error');
const loadingDiv = document.getElementById('loading');

searchBtn.addEventListener('click', () => {
    fetchWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather(cityInput.value);
    }
});

async function fetchWeather(city) {
    if (!city.trim()) return;

    // Hiển thị trạng thái loading, ẩn thông tin cũ
    weatherInfo.classList.add('hidden');
    errorDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');

    try {
        const response = await fetch(`/api/weather/${city}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || 'Không tìm thấy thành phố này');
        }

        // Cập nhật giao diện
        document.getElementById('cityName').textContent = data.name || city;
        document.getElementById('temperature').textContent = Math.round(data.main.temp);
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('wind').textContent = `${data.wind.speed} m/s`;

        // Đổi trạng thái hiển thị
        loadingDiv.classList.add('hidden');
        weatherInfo.classList.remove('hidden');
    } catch (error) {
        loadingDiv.classList.add('hidden');
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    }
}

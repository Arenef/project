const weatherService = require('../service/weather.service');

const getWeather = async (req, res) => {
    try {
        // Vì route là /weather/:city nên ta phải dùng req.params.city thay vì req.body
        const city = req.params.city;

        if (!city) {
            return res.status(400).json('Tên thành phố không được để trống');
        }

        const data = await weatherService.getWeather(city);

        return res.status(200).json(data);
    }
    catch (error) {
        console.log('Lỗi', error.message);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getWeather
};

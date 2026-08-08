const foodService = require('../service/food.service');

const getFoodAll = async (req, res) => {
    try {
        const result = await foodService.getFoodAll();
        return res.status(200).json(result);
    }
    catch (error) {
        console.error('Error in getFoodAll Controller:', error.message);
        return res.status(500).json({ message: 'Lỗi server khi lấy danh sách món ăn' });
    }
}

const getFoodById = async (req, res) => {
    try {
        // req.params.id lấy từ URL có dạng /api/foods/:id (ví dụ: /api/foods/1)
        const id = req.params.id;
        const result = await foodService.getFoodById(id);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy món ăn' });
        }

        return res.status(200).json(result[0]); // Trả về phần tử đầu tiên
    }
    catch (error) {
        console.error('Error in getFoodById Controller:', error.message);
        return res.status(500).json({ message: 'Lỗi server' });
    }
}

const getFoodByName = async (req, res) => {
    try {
        // req.query.name lấy từ URL query string (ví dụ: /api/foods/search?name=pho)
        const name = req.query.name;
        const result = await foodService.getFoodByName(name);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy món ăn nào' });
        }

        return res.status(200).json(result);
    }
    catch (error) {
        console.error('Error in getFoodByName Controller:', error.message);
        return res.status(500).json({ message: 'Lỗi server' });
    }
}

const getFoodByTag = async (req, res) => {
    try {
        const tags = req.query.tag; // Có thể là chuỗi "Cơm,Ăn vặt"
        const result = await foodService.getFoodByTag(tags);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy món ăn nào với tag này' });
        }

        return res.status(200).json(result);
    }
    catch (error) {
        console.error('Error in getFoodByTag Controller:', error.message);
        return res.status(500).json({ message: 'Lỗi server' });
    }
}

const updateFood = async (req, res) => {
    try {
        const id = req.params.id; // Lấy ID từ URL (ví dụ: PUT /api/foods/1)
        const { name, description, tag, image_url } = req.body; // Dữ liệu cần update nằm trong body

        const result = await foodService.updateFood(id, name, description, tag, image_url);

        if (!result) {
            return res.status(404).json({ message: 'Không tìm thấy món ăn để cập nhật' });
        }

        return res.status(200).json(result);
    }
    catch (error) {
        console.error('Error in updateFood Controller:', error.message);
        return res.status(500).json({ message: 'Lỗi server khi cập nhật món ăn' });
    }
}

const deleteFood = async (req, res) => {
    try {
        const id = req.params.id; // Lấy ID từ URL (ví dụ: DELETE /api/foods/1)

        const result = await foodService.removeFood(id); // Sử dụng removeFood từ service

        if (!result) {
            return res.status(404).json({ message: 'Không tìm thấy món ăn để xóa' });
        }

        return res.status(200).json({ message: 'Xóa món ăn thành công' });
    }
    catch (error) {
        console.error('Error in deleteFood Controller:', error.message);
        return res.status(500).json({ message: 'Lỗi server khi xóa món ăn' });
    }
}

const createFood = async (req, res) => {
    try {
        const { name, description, tag, image_url } = req.body; // Dữ liệu tạo mới nằm trong body
        
        if (!name) {
            return res.status(400).json({ message: 'Tên món ăn không được để trống' });
        }

        const result = await foodService.createFood(name, description, tag, image_url);

        if (!result) {
            return res.status(400).json({ message: 'Không thể tạo món ăn' });
        }

        return res.status(201).json(result); // Trả về 201 Created khi tạo mới thành công
    }
    catch (error) {
        console.error('Error in createFood Controller:', error.message);
        return res.status(500).json({ message: 'Lỗi server khi tạo món ăn' });
    }
}

const getRandomFood = async (req, res) => {
    try {
        const tags = req.query.tags;
        const result = await foodService.getRandomFood(tags);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'Không có món ăn nào phù hợp' });
        }

        return res.status(200).json(result[0]); // Trả về 1 món ăn duy nhất
    }
    catch (error) {
        console.error('Error in getRandomFood Controller:', error.message);
        return res.status(500).json({ message: 'Lỗi server khi lấy món ăn ngẫu nhiên' });
    }
}

module.exports = {
    getFoodAll,
    getFoodById,
    getFoodByName,
    getFoodByTag,
    updateFood,
    deleteFood,
    createFood,
    getRandomFood
};
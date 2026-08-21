const { pool } = require('../config/database');

const getFoodAll = async () => {
    try {
        const [result] = await pool.query('SELECT * FROM foods');
        return result;
    }
    catch (error) {
        console.error('Error in getFoodAll Service:', error.message);
        throw new Error('Lỗi khi lấy danh sách món ăn từ cơ sở dữ liệu');
    }
}

const getFoodById = async (id) => {
    try {
        const [result] = await pool.query('SELECT * FROM foods WHERE id = ?', [id]);
        return result;
    }
    catch (error) {
        console.error('Error in getFoodById Service:', error.message);
        throw new Error('Lỗi khi lấy danh sách món ăn từ cơ sở dữ liệu');
    }
}

const getFoodByName = async (name) => {
    try {
        const [result] = await pool.query('SELECT * FROM foods WHERE name LIKE ?', [`%${name}%`]);
        return result;
    }
    catch (error) {
        console.error('Error in getFoodByName Service:', error.message);
        throw new Error('Lỗi khi tìm kiếm món ăn theo tên');
    }
}

const getFoodByTag = async (tags) => {
    try {
        if (!tags) {
            const [result] = await pool.query('SELECT * FROM foods');
            return result;
        }

        const tagList = tags.split(',').map(t => t.trim()).filter(t => t);
        if (tagList.length === 0) {
            const [result] = await pool.query('SELECT * FROM foods');
            return result;
        }

        const conditions = tagList.map(() => 'tag LIKE ?').join(' OR ');
        const values = tagList.map(t => `%${t}%`);

        const [result] = await pool.query(`SELECT * FROM foods WHERE ${conditions}`, values);
        return result;
    }
    catch (error) {
        console.log('Error in getFoodByTag Service:', error.message);
        throw new Error('Lỗi khi tìm kiếm món ăn theo nhãn');
    }
}

const createFood = async (name, description, tag, image_url) => {
    try {
        const [result] = await pool.query('INSERT INTO foods (name, description, tag, image_url) VALUES (?, ?, ?, ?)', [name, description, tag, image_url]);

        if (result.affectedRows === 0) {
            return null;
        }

        return {
            id: result.insertId,
            name: name,
            description: description,
            image_url: image_url,
            tag: tag,
        }
    }
    catch (error) {
        console.error('Error in createFood Service:', error.message);
        throw new Error('Lỗi khi tạo món ăn');
    }
}

const removeFood = async (id) => {
    try {
        const [result] = await pool.query('DELETE FROM foods WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    catch (error) {
        console.error('Error in removeFood Service:', error.message);
        throw new Error('Lỗi khi xóa món ăn');
    }
}

const updateFood = async (id, name, description, tag, image_url) => {
    try {
        const rows = await getFoodById(id);
        const food = rows[0];

        if (!food) {
            return null; // Không tìm thấy
        }

        if (!name) name = food.name;
        if (!description) description = food.description;
        if (!tag) tag = food.tag;
        if (!image_url) image_url = food.image_url;

        const [result] = await pool.query(
            'UPDATE foods SET name = ?, description = ?, tag = ?, image_url = ? WHERE id = ?',
            [name, description, tag, image_url, id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return {
            id: id,
            name: name,
            description: description,
            image_url: image_url,
            tag: tag,
        }
    }
    catch (error) {
        console.error('Error in updateFood Service:', error.message);
        throw new Error('Lỗi khi cập nhật món ăn');
    }
}

const getRandomFood = async (tags) => {
    try {
        if (!tags) {
            const [result] = await pool.query('SELECT * FROM foods ORDER BY RAND() LIMIT 1');
            return result;
        }

        const tagList = tags.split(',').map(t => t.trim()).filter(t => t);
        if (tagList.length === 0) {
            const [result] = await pool.query('SELECT * FROM foods ORDER BY RAND() LIMIT 1');
            return result;
        }

        const conditions = tagList.map(() => 'tag LIKE ?').join(' OR ');
        const values = tagList.map(t => `%${t}%`);

        const query = `SELECT * FROM foods WHERE ${conditions} ORDER BY RAND() LIMIT 1`;
        const [result] = await pool.query(query, values);
        return result;
    }
    catch (error) {
        console.error('Error in getRandomFood Service:', error.message);
        throw new Error('Lỗi khi lấy món ăn ngẫu nhiên');
    }
}

const addFoodToHistory = async (userId, foodId) => {
    try {
        const [result] = await pool.query('INSERT INTO histories (user_id, food_id) VALUES (?, ?)', [userId, foodId]);

        if (result.affectedRows === 0) {
            throw new Error('Lỗi không thể lưu món ăn vào lịch sử');
        }

        return {
            id: result.insertId,
            user_id: userId,
            food_id: foodId,
        }
    }
    catch (error) {
        console.log('Error in addFoodToHistory Service:', error.message);
        throw new Error('Lỗi từ MySQL: ' + error.message)
    }
}

const getFoodFromHistory = async (userId) => {
    try {
        const query = `
        SELECT f.*, h.id AS history_id, h.created_at AS history_created_at
        FROM foods AS f 
        JOIN histories AS h ON f.id = h.food_id
        WHERE h.user_id = ?
        ORDER BY h.created_at DESC
        `;
        const [result] = await pool.query(query, [userId]);
        return result;
    }
    catch (error) {
        console.log('Error in getFoodFromHistory Service:', error.message);
        throw new Error('Lỗi khi lấy lịch sử các món ăn');
    }
}

const addFoodToFavourites = async (userId, foodId) => {
    try {
        const [result] = await pool.query('INSERT INTO favourites (user_id, food_id) VALUES (?, ?)', [userId, foodId]);

        if (result.affectedRows === 0) {
            throw new Error('Lỗi không thêm món ăn vào món ăn yêu thích');
        }

        return result;
    }
    catch (error) {
        console.log('Error in addFoodToFavourites Service:', error.message);
        throw new Error('Lỗi khi thêm món ăn vào món ăn yêu thích');
    }
}

const updateFoodRanking = async (foodId) => {
    try {
        const query = `
            INSERT INTO food_rankings (food_id, ranking_date, selection_count) 
            VALUES (?, CURDATE(), 1)
            ON DUPLICATE KEY UPDATE selection_count = selection_count + 1
        `;

        const [result] = await pool.query(query, [foodId]);
        return result;
    }
    catch (error) {
        console.log('Error in updateFoodRanking Service:', error.message);
        throw new Error('Lỗi khi cập nhật bảng xếp hạng các món ăn');
    }
}

const getFoodRanking = async (type = 'day') => {
    try {
        let condition = '';

        // Dựa vào type để lọc theo ngày, tháng, năm hiện tại
        if (type === 'day') {
            condition = 'WHERE r.ranking_date = CURDATE()';
        }
        else if (type === 'week') {
            condition = 'WHERE WEEK(r.ranking_date) = WEEK(CURDATE())'
        }
        else if (type === 'month') {
            condition = 'WHERE MONTH(r.ranking_date) = MONTH(CURDATE()) AND YEAR(r.ranking_date) = YEAR(CURDATE())';
        } else if (type === 'year') {
            condition = 'WHERE YEAR(r.ranking_date) = YEAR(CURDATE())';
        }
        else {
            // Mặc định lấy theo ngày nếu type không hợp lệ
            condition = 'WHERE r.ranking_date = CURDATE()';
        }

        const query = `
            SELECT f.*, SUM(r.selection_count) AS total_count 
            FROM food_rankings r
            JOIN foods f ON r.food_id = f.id
            ${condition}
            GROUP BY r.food_id
            ORDER BY total_count DESC 
            LIMIT 10
        `;
        const [result] = await pool.query(query);
        return result;
    }
    catch (error) {
        console.log('Error in getFoodRanking Service:', error.message);
        throw new Error('Lỗi khi lấy dữ liệu xếp hạng các món ăn');
    }
}

const getFoodFromFavourites = async (userId) => {
    try {
        const query = `
        SELECT f.* 
        FROM favourites AS fv
        JOIN foods AS f ON fv.food_id = f.id
        WHERE fv.user_id = ?
        ORDER BY fv.created_at DESC
        `;
        const [result] = await pool.query(query, [userId]);
        return result;
    }
    catch (error) {
        console.log('Error in getFoodFromFavourites Service:', error.message);
        throw new Error('Lỗi khi lấy danh sách các món ăn yêu thích');
    }
}

const removeFoodInFavourites = async (userId, foodId) => {
    try {
        const query = `
        DELETE FROM favourites
        WHERE user_id = ? and food_id = ?
        `;
        const [result] = await pool.query(query, [userId, foodId]);
        return result.affectedRows > 0;
    }
    catch (error) {
        console.log('Error in removeFoodInFavourites Service:', error.message);
        throw new Error('Lỗi khi xóa món ăn khỏi danh sách món ăn yêu thích');
    }
}

module.exports = {
    getFoodAll,
    getFoodById,
    getFoodByName,
    getFoodByTag,
    createFood,
    updateFood,
    removeFood,
    getRandomFood,
    addFoodToHistory,
    getFoodFromHistory,
    addFoodToFavourites,
    getFoodFromFavourites,
    removeFoodInFavourites,
    getFoodRanking,
    updateFoodRanking
};

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

module.exports = {
    getFoodAll,
    getFoodById,
    getFoodByName,
    getFoodByTag,
    createFood,
    updateFood,
    removeFood,
    getRandomFood
};

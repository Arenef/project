const db = require('../config/database');

const getAll = async () => {
    try {
        const [result] = await db.query('SELECT * FROM blogs');
        return result;
    }
    catch (error) {
        console.log('Error:', error.message);
        throw error;
    }
};

const getById = async (id) => {
    try {
        const [result] = await db.query('SELECT * FROM blogs WHERE id = ?', [id]);
        return result;
    }
    catch (error) {
        console.log('Error:', error.message);
        throw error;
    }
};

const getByTitle = async (title) => {
    try {
        const [result] = await db.query('SELECT * FROM blogs WHERE title LIKE ? ', [`%${title}%`]);
        return result;
    }
    catch (error) {
        console.log('Error:', error.message);
        throw error;
    }
};

const getByTag = async (tag) => {
    try {
        const [result] = await db.query(`SELECT * FROM blogs WHERE tag LIKE ?`, [`%${tag}%`]);
        return result;
    }
    catch (error) {
        console.log('Error:', error.message);
        throw error;
    }
}

const createBlogs = async (title, content, category, tag) => {
    try {
        const [result] = await db.query('INSERT INTO blogs (title, content, category, tag) VALUES (?, ?, ?, ?)', [title, content, category, tag]);

        if (result.affectedRows === 0) {
            return null;
        }

        return {
            id: result.insertId,
            title: title,
            content: content,
            category: category,
            tag: tag
        };
    }
    catch (error) {
        console.log('Error:', error.message);
        throw error;
    }
};

const updateBlogs = async (id, title, content, category, tag) => {
    try {
        const [result] = await db.query('UPDATE blogs SET title = ?, content = ?, category = ?, tag = ? WHERE id = ?', [title, content, category, tag, id]);

        if (result.affectedRows === 0) {
            return null;
        }

        return {
            id: id,
            title: title,
            content: content,
            category: category,
            tag: tag
        };
    }
    catch (error) {
        console.log('Error:', error.message);
        throw error;
    }
};

const deleteBlogs = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM blogs WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    catch (error) {
        console.log('Error:', error.message);
        throw error;
    }
};

module.exports = {
    getAll,
    getById,
    getByTitle,
    getByTag,
    createBlogs,
    updateBlogs,
    deleteBlogs
}
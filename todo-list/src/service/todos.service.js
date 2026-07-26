const db = require('../config/database');

const getAll = async () => {
    const [todos] = await db.query("SELECT * FROM todo");
    return todos;
}

const getById = async (id) => {
    const [todo] = await db.query("SELECT * FROM todo WHERE id = ?", [id]);
    return todo;
}

const createTodo = async (title, description, dueTime) => {
    const [result] = await db.query("INSERT INTO todo (title, desciption, dueTime) VALUES (?, ?, ?)", [title, description, dueTime]);

    if (result.affectedRows === 0) {
        return null;
    }

    return {
        id: result.insertId,
        title,
        description,
        dueTime
    };
}

const deleteTodo = async (id) => {
    const [result] = await db.query("DELETE FROM todo WHERE id = ?", [id]);
    return result.affectedRows > 0;
}

const updateTodo = async (id, description, status) => {
    const [result] = await db.query("UPDATE todo SET desciption = ?, status = ? WHERE id = ?", [description, status, id]);

    if (result.affectedRows === 0) {
        return null;
    }

    return {
        id,
        description,
        status
    };
}

module.exports = {
    getAll,
    getById,
    createTodo,
    updateTodo,
    deleteTodo
};


const db = require('../config/database');

const getAll = async () => {
    const [todos] = await db.query("SELECT * FROM todos");
    return todos;
}

const getById = async (id) => {
    const [todo] = await db.query("SELECT * FROM todos WHERE id = ?", [id]);
    return todo;
}

const createTodo = async (title, description, dueTime) => {
    const [result] = await db.query("INSERT INTO todos (title, description, dueTime) VALUES (?, ?, ?)", [title, description, dueTime]);

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
    const [result] = await db.query("DELETE FROM todos WHERE id = ?", [id]);
    return result.affectedRows > 0;
}

const updateTodo = async (id, description, status) => {
    const [result] = await db.query("UPDATE todos SET description = ?, status = ? WHERE id = ?", [description, status, id]);

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


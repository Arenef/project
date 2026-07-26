const todoService = require("../service/todo.service");

const getAll = async (req, res, next) => {
    try {
        const todos = await todoService.getAll();

        return res.status(200).json(todos);
    }
    catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        const todoId = Number(req.params.id);
        if (isNaN(todoId)) {
            const error = new Error('Id phải là một chữ số');
            error.statusCode = 400;
            return next(error); // Bắt buộc dùng return để dừng hàm
        }

        const todo = await todoService.getById(todoId);

        if (!todo) {
            const error = new Error('Không tìm thấy nhiệm vụ');
            error.statusCode = 400;
            return next(error);
        }

        return res.status(200).json(todo);
    }
    catch (error) {
        next(error);
    }
}

const createTodo = async (req, res, next) => {
    try {
        const newTitle = req.body.title;

        if (!newTitle) {
            const error = new Error('Thiếu tiêu đề nhiệm vụ (title)');
            error.statusCode = 400;
            return next(error);
        }

        const result = await todoService.createTodo(newTitle, req.body.description, req.body.dueTime);

        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};

const updateTodo = async (req, res, next) => {
    try {
        const todoId = Number(req.params.id);

        if (isNaN(todoId)) {
            const error = new Error('Id phải là một chữ số');
            error.statusCode = 400;
            return next(error);
        }

        const result = await todoService.updateTodo(todoId, req.body.description, req.body.status);

        if (!result) {
            const error = new Error('Không tìm thấy nhiệm vụ trong danh sách');
            error.statusCode = 400;
            return next(error)
        }
        return res.status(200).json({ message: 'Cập nhật thành công', result });
    }
    catch (error) {
        next(error);
    }
};

const deleteTodo = async (req, res, next) => {
    try {
        const todoId = Number(req.params.id);

        if (isNaN(todoId)) {
            const error = new Error('Id phải là một chữ số');
            error.statusCode = 400;
            return next(error);
        }

        const result = await todoService.deleteTodo(todoId);

        if (result === false) {
            const error = new Error('Không có nhiệm vụ trong danh sách');
            error.statusCode = 400;
            return next(error);
        }

        return res.status(200).json('Đã xóa thành công');
    }
    catch (error) {
        next(error);
    }
}
module.exports = {
    getAll,
    getById,
    createTodo,
    updateTodo,
    deleteTodo
}
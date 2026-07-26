

let todos = [
    {
        id: 1,
        title: "Learn Express",
        completed: false
    },
    {
        id: 2,
        title: "Learn Express",
        completed: false
    }
];

const getAll = (req, res, next) => {
    try {
        return res.status(200).json(todos);
    }
    catch (err) {
        next(err);
    }
};

const getById = (req, res, next) => {
    try {
        const todoId = Number(req.params.id);
        if (isNaN(todoId)) {
            const error = new Error('Id phải là một chữ số');
            error.statusCode = 400;
            return next(error); // Bắt buộc dùng return để dừng hàm
        }

        const todo = todos.find(todo => todo.id === todoId);

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

const createTodo = (req, res, next) => {
    try {
        let newId = 1;

        if (todos.length !== 0) {
            newId = Number(todos[todos.length - 1].id) + 1;
        }

        const newTitle = req.body.title;

        if (!newTitle) {
            const error = new Error('Thiếu tiêu đề nhiệm vụ (title)');
            error.statusCode = 400;
            return next(error);
        }

        const newTodo = {
            id: newId,
            title: newTitle,
            completed: false
        }

        todos.push(newTodo);

        return res.status(200).json('Thêm thành công');

    }
    catch (error) {
        next(error);
    }
};

const updateTodo = (req, res, next) => {
    try {
        const todoId = Number(req.params.id);

        if (isNaN(todoId)) {
            const error = new Error('Id phải là một chữ số');
            error.statusCode = 400;
            return next(error);
        }

        const todo = todos.find(todo => todo.id === todoId);
        if (!todo) {
            const error = new Error('Không tìm thấy nhiệm vụ trong danh sách');
            error.statusCode = 400;
            return next(error);
        }

        const completed = req.body.completed;

        if (typeof completed !== 'boolean') {
            const error = new Error('Thiếu dữ liệu cập nhật hợp lệ (completed phải là boolean: true/false)');
            error.statusCode = 400;
            return next(error);
        }

        todo.completed = completed;

        // Nếu client có gửi title mới thì cập nhật luôn
        if (req.body.title) {
            todo.title = req.body.title;
        }

        return res.status(200).json({ message: 'Cập nhật thành công', todo });
    }
    catch (error) {
        next(error);
    }
};

const deleteTodo = (req, res, next) => {
    try {
        const todoId = Number(req.params.id);

        if (isNaN(todoId)) {
            const error = new Error('Id phải là một chữ số');
            error.statusCode = 400;
            return next(error);
        }

        const newTodos = todos.filter(todo => todo.id !== todoId);

        if (newTodos.length === todos.length) {
            const error = new Error('Không tìm thấy nhiệm vụ trong danh sách để xóa');
            error.statusCode = 400;
            return next(error);
        }

        todos = newTodos; // Gán lại mảng gốc sau khi đã xóa

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
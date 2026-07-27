const express = require('express');
const router = express.Router();
const todoController = require('../controller/todos.controller');
const requireLogin = require('../middleware/auth.middleware');

router.use(requireLogin);

router.get('/', todoController.getAll);
router.get('/:id', todoController.getById);
router.post('/', todoController.createTodo);
router.patch('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
const express = require('express');
const router = express.Router();
const todoController = require('../controller/todo.controller');

router.get('/', todoController.getAll);
router.get('/:id', todoController.getById);
router.post('/', todoController.createTodo);
router.patch('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
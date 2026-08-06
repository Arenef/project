const blogController = require('../controller/blog.controller');
const express = require('express');
const router = express.Router();

router.get('/', blogController.getAll);
router.get('/search', blogController.getByTitle);
router.get('/tags', blogController.getByTag);
router.get('/:id', blogController.getById);
router.post('/', blogController.createBlogs);
router.patch('/:id', blogController.updateBlogs);
router.delete('/:id', blogController.deleteBlogs);

module.exports = router;
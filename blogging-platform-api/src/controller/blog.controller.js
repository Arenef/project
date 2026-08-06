const blogService = require('../service/blog.service');

const getAll = async (req, res) => {
    try {
        const result = await blogService.getAll();
        return res.status(200).json(result);
    }
    catch (error) {
        console.log('Error:', error.message);
        throw error;
    }
};

const getById = async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(404).json('id phải là một số nguyên');
        }

        const result = await blogService.getById(id);

        if (!result) {
            return res.status(404).json('Không tìm thấy blog');
        }

        return res.status(200).json(result);
    }
    catch (error) {
        console.log('Error:', error.message);
        throw error;
    }
};

const getByTitle = async (req, res) => {
    try {
        const title = req.query.title;

        const result = await blogService.getByTitle(title);

        if (!result) {
            return res.status(404).json('Không tìm thấy blog');
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.log('Error:', error.message);
        throw error;
    }
}

const getByTag = async (req, res) => {
    try {
        const tags = req.query.tags;
        const result = await blogService.getByTag(tags);
        if (!result || result.length === 0) {
            return res.status(404).json('Không tìm thấy blog với tag này');
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.log(`Error:`, error.message);
        throw error;
    }
}

const createBlogs = async (req, res) => {
    try {
        const { title, content, category, tag } = req.body;

        if (!title || !content) {
            return res.status(400).json('Title và Content không được để trống');
        }

        const result = await blogService.createBlogs(title, content, category, tag);

        if (!result) {
            return res.status(400).json('Tạo blog không thành công');
        }
        return res.status(201).json(result);
    }
    catch (error) {
        console.log('Error:', error.message);
        throw error;
    }
};

const updateBlogs = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, content, category, tag } = req.body;

        if (isNaN(id)) {
            return res.status(404).json('Id phải là một số nguyên');
        }

        const result = await blogService.updateBlogs(id, title, content, category, tag);

        if (!result) {
            return res.status(400).json('Cập nhật không thành công');
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.log('Error:', error.message);
        throw error;
    }
};

const deleteBlogs = async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(404).json('Id phải là một số nguyên');
        }

        const result = await blogService.deleteBlogs(id);

        if (!result) {
            return res.status(404).json('Không tìm thấy blog');
        }
        return res.status(200).json('Xóa blog thành công');
    }
    catch (error) {
        console.log('Error:', error.message);
        throw error;
    }
}

module.exports = {
    getAll,
    getById,
    getByTitle,
    getByTag,
    createBlogs,
    updateBlogs,
    deleteBlogs
}
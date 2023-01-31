const express = require('express');
const router = express.Router();


// importing controls from controller
const { createBlog, updateBlog, deleteBlog, getAllBlogs } = require("../controllers/blog");
const { verifyToken } = require('../middlewares/auth');


// routing endpoints to middlewares
router.get('/user/getAll', verifyToken, getAllBlogs);
router.post('/user/create/blog', verifyToken, createBlog);
router.patch('/user/update/blog/:id', verifyToken, updateBlog);
router.delete('/user/delete/blog/:id', verifyToken, deleteBlog);

module.exports = router;
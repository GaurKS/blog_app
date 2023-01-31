const Blog = require("../models/blog");

exports.createBlog = async (req, res) => {
    try {
        const { title, description, imageUrl, tags } = req.body;
        const newBlog = await Blog.create({
            title: title,
            createdBy: req.user.id,
            description: description,
            imageUrl: imageUrl,
            tags: tags,
            email: req.user.email
        });

        newBlog.save((err, newBlog) => {
            if (err) {
                console.log('Error in saving Blog data in DB', err);
                return res.status(401).json({
                    status: 401,
                    error: 'Error in saving Blog data in DB, Try Again'
                });
            }
            return res.status(201).json({
                status: 201,
                id: newBlog._id,
                createdBy: newBlog.email,
                message: 'Blog uploaded successfully!'
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            status: 403,
            message: 'Something went wrong! Please try again',
            error: error
        });
    }
}

exports.updateBlog = async (req, res) => {
    try {
        Blog.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, doc) {
            if (err) {
                return res.status(403).json({
                    status: 403,
                    message: "No such blog exist! Please check",
                });
            }
            return res.status(200).json({
                status: 200,
                message: "Blog updated successfully!",
                blog: doc
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            status: 403,
            message: 'Something went wrong! Please try again',
            error: error
        });
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById({ _id: req.params.id });
        if (!blog) {
            return res.status(203).json({
                status: 203,
                message: "No such blog exist! Please check",
            });
        }
        await blog.remove();
        return res.status(200).json({
            status: 200,
            message: "Blog deleted successfully!"
        });
    } catch (err) {
        return res.status(400).json({
            status: 403,
            message: "Something went wrong :(",
            error: err,
        });
    }
}

exports.getAllBlogs = async (req, res) => {
    try {
        const itemsPerPage = 10;

        // Get the page number from the query string
        const page = req.query.page || 1;

        Blog.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .exec((err, blogs) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send(blogs);
                }
            });

    } catch (err) {

    }
}
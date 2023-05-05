import mongoose from "mongoose"
import Blog from "../models/Blog.js"
import User from "../models/User.js"

export const getAllBlogs = async (req, res) => {
    try {
        let blogs = await Blog.find({})
        if (!blogs) {
            return res.status(404).json({
                status: "failed",
                message: "Blogs Not Found!"
            })
        }
        res.status(200).json({
            status: "success",
            data: { blogs }
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

export const createBlog = async (req, res) => {
    const { title, description, image, user } = req.body
    try {
        const existingUser = await User.findById(user)
        if (!existingUser) {
            return res.status(404).json({
                status: "failed",
                message: "User Not Found"
            })
        }
        const session = await mongoose.startSession()
        session.startTransaction()
        let blog = await Blog.create([{
            title,
            description,
            image,
            user
        }], { session })
        existingUser.blogs.push(...blog)
        await User.findByIdAndUpdate(existingUser._id, existingUser, { runValidators: true })
        await session.commitTransaction()
        res.status(201).json({
            status: "success",
            data: { blog }
        })
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

export const updateBlog = async (req, res) => {
    const { id } = req.params
    try {
        let blog = await Blog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        if (!blog) {
            return res.status(400).json({
                status: "failed",
                message: "Unable to update"
            })
        }
        res.status(200).json({
            status: "success",
            data: { blog }
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

export const getBlogById = async (req, res) => {
    const { id } = req.params
    try {
        let blog = await Blog.findById(id)
        if (!blog) {
            return res.status(404).json({
                status: "failed",
                message: "Blog Not Found"
            })
        }
        res.status(200).json({
            status: "success",
            data: { blog }
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

export const deleteBlog = async (req, res) => {
    const { id } = req.params
    try {
        let blog = await Blog.findByIdAndRemove(id).populate("user")
        if (!blog) {
            return res.status(404).json({
                status: "failed",
                message: "Blog Not Found"
            })
        }
        await blog.user.blogs.pull(blog)
        await blog.user.save()
        res.status(204).json({
            status: "success"
        })
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

export const getBlogsForUser = async (req, res) => {
    const { id } = req.params
    try {
        let blogs = await User.findById(id).populate("blogs")
        if (!blogs) {
            return res.status(404).json({
                status: "failed",
                message: "No Blogs Found"
            })
        }
        res.status(200).json({
            status: "success",
            data: { blogs: blogs.blogs }
        })
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}
import express from "express"
import { createBlog, deleteBlog, getAllBlogs, getBlogById, getBlogsForUser, updateBlog } from "../controllers/blog-controllers.js"

const router = express.Router()

router.get("/", getAllBlogs)

router.get("/:id", getBlogById)

router.post("/add", createBlog)

router.put("/update/:id", updateBlog)

router.delete("/:id", deleteBlog)

router.get("/user/:id", getBlogsForUser)

export default router
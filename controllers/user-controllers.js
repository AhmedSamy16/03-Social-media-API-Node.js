import User from "../models/User.js"
import bcrypt from "bcryptjs"

export const getAllUsers = async (req, res) => {
    try {
        let users = await User.find()
        if (!users) {
            throw new Error("No Users Found")
        }
        res.status(200).json({
            status: "success",
            data: { users }
        })
    } catch (err) {
        res.status(404).json({
            status: "Failed",
            message: err.message
        })
    }
}

export const signup = async (req, res) => {
    let { name, email, password } = req.body
    try {
        let existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                status: "failed",
                message: "User already exists! Try login instead."
            })
        }
        const hashedPassword = bcrypt.hashSync(password)
        let user = await User.create({
            name,
            email,
            password: hashedPassword,
            blogs: []
        })
        res.status(201).json({
            status: "success",
            data: { user }
        })
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({
                status: "failed",
                message: "User Not Found!"
            })
        }

        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                status: "failed",
                message: "Incorrect Password!"
            })
        }
        res.status(200).json({
            status: "success",
            data: { user: existingUser }
        })
    } catch(err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}
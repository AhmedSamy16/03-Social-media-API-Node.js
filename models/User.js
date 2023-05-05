import mongoose from "mongoose";
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 6
    },
    blogs: [{
        type: mongoose.Types.ObjectId, 
        ref: "Blog", 
        required: [true, "Blogs are required"]
    }]
})

const User = mongoose.model("User", userSchema)

export default User
import { config } from "dotenv"
config()

import express from "express"
import mongoose from "mongoose"
import userRouter from "./routes/user-routes.js"
import blogRouter from "./routes/blog-routes.js"

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.use("/api/users", userRouter)
app.use("/api/blogs", blogRouter)

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("Connected To database...")
        app.listen(PORT, () => console.log(`Server running on port ${PORT}...`))
    })
    .catch((err) => console.log(err))
//here we will create multiple routes
import express from "express" //used to include the Express library in the project
import { loginUser,registerUser } from "../controllers/userController.js"

const userRouter = express.Router()
userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)

export default userRouter;








import express from "express"
import userRoute from "./features/user/userRoute.js"

const router = express.Router()
router.use("/users", userRoute)

export default router;
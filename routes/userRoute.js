const userController = require("../controllers/usersController")
const {Router} = require("express")

const userRouter = Router()

userRouter.post("/",userController.usersPost)
userRouter.get("/:email",userController.usersIdGet)

module.exports = userRouter
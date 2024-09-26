const userController = require("../controllers/usersController")
const {Router} = require("express")

const userRouter = Router()

userRouter.post("/",userController.usersPost)
userRouter.get("/:email",userController.usersIdGet)
userRouter.get("/:id/details", userController.usersDetailsGet)

module.exports = userRouter
const {Router} = require("express")
const webHookController = require("../controllers/webhooksController")
const webhooksRouter = Router()

webhooksRouter.post("/",webHookController.userPost)

module.exports = webhooksRouter
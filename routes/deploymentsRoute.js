const {Router} = require("express")
const deploymentsController = require("../controllers/deploymentsController")

const deploymentsRouter = Router()

deploymentsRouter.post('/', deploymentsController.deploymentsPost)

module.exports = deploymentsRouter
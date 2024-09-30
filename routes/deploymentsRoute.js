const {Router} = require("express")
const deploymentsController = require("../controllers/deploymentsController")

const deploymentsRouter = Router()

deploymentsRouter.post('/', deploymentsController.deploymentsPost)
deploymentsRouter.get('/:userId/:deploymentId', deploymentsController.deploymentsGetId)
deploymentsRouter.get('/:userId',deploymentsController.deploymentsGet)

module.exports = deploymentsRouter
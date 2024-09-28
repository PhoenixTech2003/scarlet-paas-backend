const {Schema, model } =require("mongoose")

const deploymentSchema = new Schema({
    app_name: {type:String, required:true}, 
    userId: {type:String, required: true},
    status: {type:String, required:true},
})

const Deployments = model("Deployments", deploymentSchema)

module.exports = Deployments
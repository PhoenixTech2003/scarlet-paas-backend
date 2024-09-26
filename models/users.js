const {Schema, model, Types} = require("mongoose")

const UsersSchema = new Schema({
    _id: {type:String, required:true},
    firstname: {type:String, required: true},
    lastname: {type:String, required: true},
    email: {type:String, required: true},
})

const Users = model('Users', UsersSchema)

module.exports = Users
const {Schema, model} = require("mongoose")

const UsersSchema = new Schema({
    firstname: {type:String, required: true},
    lastname: {type:String, required: true},
    email: {type:String, required: true},
})

const Users = model('Users', UsersSchema)

module.exports = Users
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

name:String,

role:{
type:String,
enum:["student","teacher","admin"],
default:"student"
}

})

module.exports = mongoose.model("User",userSchema)
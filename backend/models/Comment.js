const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({

postId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Post"
},

author:String,

text:String

},{
timestamps:true
})

module.exports = mongoose.model("Comment",CommentSchema)
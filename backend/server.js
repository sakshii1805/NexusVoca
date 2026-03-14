const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Post = require("./models/Post");
const Comment = require("./models/Comment");

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* DATABASE CONNECTION */
mongoose.connect("mongodb://127.0.0.1:27017/nexusvoca")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

/* LOGIN API */
/* LOGIN API */
app.post("/api/login",(req,res)=>{

const {username,password,email} = req.body;

if(username==="student" && password==="1234"){
res.json({
success:true,
user:{name:"Student",role:"student",email}
});
}

else if(username==="teacher" && password==="1234"){
res.json({
success:true,
user:{name:"Teacher",role:"teacher",email}
});
}

else if(username==="admin" && password==="1234"){
res.json({
success:true,
user:{name:"Admin",role:"admin",email}
});
}

else if(username==="sakshi" && password==="1234"){
res.json({
success:true,
user:{name:"Sakshi",role:"student",email}
});
}

else{
res.json({success:false});
}

});
/* GET POSTS */
app.get("/api/posts", async (req,res)=>{

try{

const posts = await Post.find().sort({createdAt:-1});

res.json(posts);

}
catch(err){
res.status(500).json({error:err.message});
}

});


/* LIKE POST */
app.post("/api/posts/like/:id", async (req,res)=>{

try{

const post = await Post.findById(req.params.id);

post.likes += 1;

await post.save();

res.json(post);

}
catch(err){
res.status(500).json({error:err.message});
}

});


/* ADD COMMENT */
app.post("/api/posts/:id/comment", async (req,res)=>{

try{

const comment = new Comment({
postId:req.params.id,
author:req.body.author,
text:req.body.text
})

await comment.save()

res.json(comment)

}
catch(err){
res.status(500).json({error:err.message})
}

});


/* GET COMMENTS */
app.get("/api/posts/:id/comments", async (req,res)=>{

try{

const comments = await Comment.find({
postId:req.params.id
}).sort({createdAt:-1})

res.json(comments)

}
catch(err){
res.status(500).json({error:err.message})
}

});


/* TEST ROUTE */
app.get("/",(req,res)=>{
res.send("Backend working");
});


/* START SERVER */
app.listen(5000,()=>{
console.log("Server running on port 5000");
});
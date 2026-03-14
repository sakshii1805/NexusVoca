const express = require("express");
const router = express.Router();

const Post = require("../models/Post");


/* GET ALL POSTS */
router.get("/", async (req,res)=>{

try{

const posts = await Post.find().sort({createdAt:-1});

res.json(posts);

}catch(err){

res.status(500).json({error:err.message});

}

});


/* CREATE POST */
router.post("/create", async (req,res)=>{

try{

const post = new Post({
author:req.body.author,
role:req.body.role,
text:req.body.text,
likes:0
});

await post.save();

res.json(post);

}catch(err){

res.status(500).json({error:err.message});

}

});


/* LIKE POST */
router.post("/like/:id", async (req,res)=>{

try{

const post = await Post.findById(req.params.id);

if(!post){
return res.status(404).json({message:"Post not found"});
}

post.likes += 1;

await post.save();

res.json(post);

}catch(err){

res.status(500).json({error:err.message});

}

});

module.exports = router;
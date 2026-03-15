import { useState } from "react";
import axios from "axios";

function PostComposer({ setPosts }) {

const [text,setText] = useState("");

const submitPost = async () => {

const user = JSON.parse(localStorage.getItem("user"));

if(!user){
alert("Please login first");
return;
}

if(text.trim()===""){
alert("Write something before posting");
return;
}

try{

const res = await axios.post("http://localhost:5000/api/posts",{
author:user.name,
role:user.role,
text:text
});

setPosts(prev => [res.data, ...prev]);

setText("");

}catch(err){

console.log(err);
alert("Post failed");

}

};

return(

<div className="composer">

<textarea
placeholder="What's happening on campus?"
value={text}
onChange={(e)=>setText(e.target.value)}
/>

<button className="postBtn" onClick={submitPost}>
Post
</button>

</div>

);

}

export default PostComposer;
import React, { useState } from "react";

function CreatePost() {

const [text,setText] = useState("");

const submitPost = async () => {

if(text.trim() === ""){
alert("Write something first");
return;
}

try{

await fetch("http://localhost:5000/api/posts/create",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
author:"Student",
role:"student",
text:text
})
});

setText("");

window.location.reload();

}catch(err){

console.log(err);
alert("Failed to create post");

}

}

return(

<div className="card">

<textarea
placeholder="What's happening on campus?"
value={text}
onChange={(e)=>setText(e.target.value)}
/>

<br/>

<button onClick={submitPost}>
Post
</button>

</div>

)

}

export default CreatePost;


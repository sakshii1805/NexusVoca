import axios from "axios"
import { useState } from "react"

import CommentBox from "./CommentBox"
import CommentList from "./CommentList"

function Post({post}){

const [showComments,setShowComments] = useState(false)

const likePost = async ()=>{

await axios.post(`http://localhost:5000/api/posts/like/${post._id}`)
window.location.reload()

}

const authorName = post.author || "Unknown"

return(

<div className="post">

<div className="postHeader">

<div className="avatar">
{authorName.charAt(0)}
</div>

<div className="postUser">

<span className="username">
{authorName}
</span>

<span className={`badge ${post.role || "student"}`}>
{post.role || "student"}
</span>

</div>

</div>

<p className="postText">

{post.text.split(" ").map((word,index)=>{

if(word.startsWith("#")){
return(
<span
key={index}
className="hashtag"
onClick={()=>window.location.href=`/tag/${word.substring(1)}`}
>
{word}{" "}
</span>
)
}

return word + " "

})}

</p>

<div className="postActions">

<span onClick={()=>setShowComments(!showComments)}>
💬 Comment
</span>

<span>🔁</span>

<span onClick={likePost}>
❤️ {post.likes || 0}
</span>

</div>

{showComments && (

<div className="commentSection">

<CommentList postId={post._id}/>
<CommentBox postId={post._id}/>

</div>

)}

</div>

)

}

export default Post
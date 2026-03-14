import { useState } from "react"
import axios from "axios"

function CommentBox({postId}){

const [text,setText] = useState("")

const submitComment = async ()=>{

const user = JSON.parse(localStorage.getItem("user"))

await axios.post(`http://localhost:5000/api/posts/${postId}/comment`,{
author:user.name,
text:text
})

setText("")
window.location.reload()

}

return(

<div className="commentBox">

<input
type="text"
placeholder="Write a comment..."
value={text}
onChange={(e)=>setText(e.target.value)}
/>

<button onClick={submitComment}>
Post
</button>

</div>

)

}

export default CommentBox
import { useState } from "react"
import axios from "axios"

function PostComposer(){

const [text,setText] = useState("")

const submitPost = async () => {

const user = JSON.parse(localStorage.getItem("user"))

try{

await axios.post("http://localhost:5000/api/posts",{
author:user.name,
role:user.role,
text:text
})

setText("")
window.location.reload()

}catch(err){

console.log(err)

}

}

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

)

}

export default PostComposer
import { useEffect, useState } from "react"
import axios from "axios"

import PostComposer from "./PostComposer"
import Post from "./Post"

function Feed(){

const [posts,setPosts] = useState([])

useEffect(()=>{

axios.get("http://localhost:5000/api/posts")
.then(res=>{
setPosts(res.data)
})
.catch(err=>{
console.log("Error loading posts:",err)
})

},[])

return(

<div className="feed">

<h2 style={{padding:"15px"}}>Campus Feed</h2>

<PostComposer/>

{posts.length === 0 && (
<p style={{padding:"20px",color:"gray"}}>
No posts yet
</p>
)}

{posts.map(p => (
<Post key={p._id} post={p}/>
))}

</div>

)

}

export default Feed
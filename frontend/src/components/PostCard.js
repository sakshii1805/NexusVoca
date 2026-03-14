import axios from "axios"

function PostCard({post}){

const likePost = async()=>{

try{

await axios.post(
`http://localhost:5000/api/posts/like/${post._id}`
)

window.location.reload()

}catch(err){

console.log(err)

}

}

return(

<div className="post">

<h4>

{post.author}

<span className={`badge ${post.role}`}>

{post.role}

</span>

</h4>

<p>{post.text}</p>

{post.mediaType==="image" &&
<img src={`http://localhost:5000/uploads/${post.media}`} alt="" width="100%"/>}

{post.mediaType==="video" &&
<video controls src={`http://localhost:5000/uploads/${post.media}`} width="100%"/>}

<button onClick={likePost}>
❤️ {post.likes}
</button>

</div>

)

}

export default PostCard
import {useEffect,useState} from "react"
import axios from "axios"

function CommentList({postId}){

const [comments,setComments] = useState([])

useEffect(()=>{

axios.get(`http://localhost:5000/api/posts/${postId}/comments`)
.then(res=>setComments(res.data))

},[postId])

return(

<div className="commentList">

{comments.map(c=>(
<div key={c._id} className="commentItem">

<div className="commentAvatar">
{c.author.charAt(0)}
</div>

<div className="commentContent">

<span className="commentAuthor">
{c.author}
</span>

<p className="commentText">
{c.text}
</p>

</div>

</div>
))}

</div>

)

}

export default CommentList
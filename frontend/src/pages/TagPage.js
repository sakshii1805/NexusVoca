import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Post from "../components/Post";

function TagPage(){

const { tag } = useParams();
const [posts,setPosts] = useState([]);

useEffect(()=>{

axios.get("http://localhost:5000/api/posts")
.then(res=>{

const filtered = res.data.filter(p =>
p.text && p.text.includes(`#${tag}`)
);

setPosts(filtered);

});

},[tag]);

return(

<div className="feed">

<h2>Posts for #{tag}</h2>

{posts.length === 0 && (
<p>No posts found for this hashtag</p>
)}

{posts.map(p => (
<Post key={p._id} post={p}/>
))}

</div>

);

}

export default TagPage;
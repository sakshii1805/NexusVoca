import { useEffect, useState } from "react";
import axios from "axios";

import PostComposer from "./PostComposer";
import Post from "./Post";
import Trending from "./Trending";

function Feed(){

const [posts,setPosts] = useState([]);
const [selectedTag,setSelectedTag] = useState(null);

useEffect(()=>{

axios.get("http://localhost:5000/api/posts")
.then(res=>{

const exampleAnnouncement = {
_id:"announcement1",
author:"Admin",
text:"📢 Mid semester exams will start from March 25. Please check the timetable.",
type:"announcement"
};

// sample posts so hashtags always show something
const demoPosts = [
{
_id:"demo1",
author:"Student",
text:"#event Cultural fest happening tomorrow!"
},
{
_id:"demo2",
author:"Student",
text:"#exam Mid semester preparation discussion."
},
{
_id:"demo3",
author:"Student",
text:"#library New books available in library."
},
{
_id:"demo4",
author:"Student",
text:"#placement Infosys recruitment drive next week."
},
{
_id:"demo5",
author:"Student",
text:"#hostel Hostel maintenance scheduled tonight."
}
];

setPosts([exampleAnnouncement, ...demoPosts, ...res.data]);

})
.catch(err=>{
console.log("Error loading posts:",err)
})

},[])

return(

<div className="feed">

<h2 style={{padding:"15px"}}>Campus Feed</h2>

<PostComposer setPosts={setPosts}/>

{selectedTag && (
<div style={{padding:"10px",fontWeight:"600"}}>
Showing posts for {selectedTag}
<button
style={{marginLeft:"10px"}}
onClick={()=>setSelectedTag(null)}
>
Clear
</button>
</div>
)}

{posts.length === 0 && (
<p style={{padding:"20px",color:"gray"}}>
No posts yet
</p>
)}

{posts
.filter(p => !selectedTag || (p.text && p.text.includes(selectedTag)))
.map(p => (
<Post key={p._id} post={p}/>
))}


</div>

)

}

export default Feed;
import { useEffect, useState } from "react";

function Trending({ posts = [], onTagClick }) {

const [topics,setTopics] = useState([]);

// default tags created ONCE
const defaultTags = {
"#event":54,
"#exam":89,
"#library":52,
"#placement":32,
"#hostel":1
};

useEffect(()=>{

let map = {...defaultTags};

// count hashtags from posts
posts.forEach(post => {

if(!post.text) return;

const tags = post.text.match(/#\w+/g) || [];

tags.forEach(tag => {

const key = tag.toLowerCase();

map[key] = (map[key] || 0) + 1;

});

});

// convert object to array
let trendArray = Object.keys(map).map(tag => ({
name: tag,
count: map[tag]
}));

// sort by popularity
trendArray.sort((a,b)=> b.count - a.count);

setTopics(trendArray);

},[posts]);

return(

<div className="trending">

<h3>Trending</h3>

{topics.map((t,index)=>(
<div className="trendCard" key={index}>

<span
className="trendTag"
onClick={()=>onTagClick && onTagClick(t.name)}
>
{t.name}
</span>

<span className="trendCount">
{t.count} posts
</span>

</div>
))}

</div>

);

}

export default Trending;
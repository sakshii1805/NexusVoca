import React, { useEffect, useState } from "react";

function RightPanel(){

const [announcements,setAnnouncements] = useState([]);

useEffect(()=>{

fetch("http://localhost:5000/api/announcements")
.then(res=>res.json())
.then(data=>setAnnouncements(data))
.catch(err=>console.log(err));

},[]);

return(

<div className="rightPanel">

<h3>Campus Announcements</h3>

{announcements.length===0 && (
<p>No announcements yet</p>
)}

{announcements.map((a)=>(
<div key={a._id} className="announcement">

<p><b>Admin</b></p>
<p>{a.text}</p>

</div>
))}

</div>

)

}

export default RightPanel;
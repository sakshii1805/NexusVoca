import React, { useEffect, useState } from "react";

function Announcements(){

const [announcements,setAnnouncements] = useState([]);
const [loading,setLoading] = useState(true);

useEffect(()=>{

fetch("http://localhost:5000/api/announcements")

.then(res => res.json())

.then(data => {
setAnnouncements(data);
setLoading(false);
})

.catch(err => {
console.log(err);
setLoading(false);
});

},[]);

if(loading){
return <p>Loading announcements...</p>;
}

return(

<div className="updates-box">

<h3>College Announcements</h3>

{announcements.length === 0 && (
<p>No announcements yet</p>
)}

{announcements.map((a)=>(
<div key={a._id} className="update-item">

<strong>Admin</strong>

<p>{a.text}</p>

</div>
))}

</div>

);

}

export default Announcements;
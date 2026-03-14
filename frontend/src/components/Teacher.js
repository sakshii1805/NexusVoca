import React, { useState } from "react";

function Teacher(){

const [announcement,setAnnouncement] = useState("");

const postAnnouncement = async () => {

if(announcement.trim()===""){
alert("Write an announcement first");
return;
}

try{

const res = await fetch("http://localhost:5000/api/announcements",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({text:announcement})
});

const data = await res.json();

alert(data.message || "Announcement posted");

setAnnouncement("");

}catch(err){

console.log(err);
alert("Failed to post announcement");

}

};

return(

<div style={{textAlign:"center", marginTop:"100px"}}>

<h2>Teacher Panel</h2>

<textarea
rows="5"
cols="40"
placeholder="Write announcement..."
value={announcement}
onChange={(e)=>setAnnouncement(e.target.value)}
/>

<br/><br/>

<button onClick={postAnnouncement}>
Post Announcement
</button>

</div>

);

}

export default Teacher;
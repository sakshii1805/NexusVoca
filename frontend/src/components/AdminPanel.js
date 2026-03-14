import React, { useState } from "react";

function AdminPanel(){

const [text,setText] = useState("");

const handleSubmit = async (e) => {

e.preventDefault();

try{

await fetch("http://localhost:5000/api/announcements",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({text})
});

alert("Announcement posted");

setText("");

}catch(err){

console.log(err);
alert("Failed to post announcement");

}

};

return(

<div style={{textAlign:"center",marginTop:"50px"}}>

<h2>Teacher Announcement Panel</h2>

<form onSubmit={handleSubmit}>

<input
type="text"
placeholder="Enter announcement"
value={text}
onChange={(e)=>setText(e.target.value)}
style={{padding:"10px",width:"300px"}}
/>

<br/><br/>

<button type="submit" style={{padding:"10px 20px"}}>
Post Announcement
</button>

</form>

</div>

);

}

export default AdminPanel;
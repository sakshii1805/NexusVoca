import React, { useState } from "react";

function Complaint() {

const [text, setText] = useState("");

const submitComplaint = async () => {

if(text.trim() === ""){
alert("Please write a complaint first");
return;
}

try{

const res = await fetch("http://localhost:5000/api/complaint",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({ message: text })
});

const data = await res.json();

alert(data.message || "Complaint submitted");

setText("");

}catch(err){

console.log(err);
alert("Failed to submit complaint");

}

};

return(

<div style={{textAlign:"center", marginTop:"100px"}}>

<h2>Submit Complaint</h2>

<textarea
rows="5"
cols="40"
placeholder="Write your complaint..."
value={text}
onChange={(e)=>setText(e.target.value)}
/>

<br/><br/>

<button onClick={submitComplaint}>
Submit
</button>

</div>

);

}

export default Complaint;
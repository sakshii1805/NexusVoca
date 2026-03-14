import React from "react";

function Posts(){

 const posts=[
   {
     name:"Vishnu K",
     role:"Student",
     text:"Can we get the Wi-Fi fixed in Block C?"
   },
   {
     name:"Dr. Ramesh",
     role:"Teacher",
     text:"Data Structures assignment due Friday."
   }
 ]

 return(
   <div>

     {posts.map((p,i)=>(
       <div key={i} className="card">

         <strong>{p.name}</strong>
         <span> • {p.role}</span>

         <p>{p.text}</p>

       </div>
     ))}

   </div>
 )
}

export default Posts;
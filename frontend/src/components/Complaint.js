import { FaUserCircle, FaHeart, FaComment } from "react-icons/fa";

function Complaint(){

const complaints = [
{
user:"Rahul",
text:"Library AC is not working properly. It becomes very hot during afternoon lectures.",
time:"2h"
},
{
user:"Sneha",
text:"The canteen food quality has dropped recently. Please check hygiene.",
time:"4h"
},
{
user:"Arjun",
text:"WiFi in Block B is extremely slow during classes.",
time:"6h"
}
];

return(

<div className="complaintPage">

<h2 className="complaintTitle">Student Complaints</h2>

{complaints.map((c,index)=>(

<div className="complaintCard" key={index}>

<div className="complaintHeader">

<FaUserCircle className="complaintAvatar"/>

<div>
<b>{c.user}</b>
<p className="complaintTime">{c.time} ago</p>
</div>

</div>

<p className="complaintText">{c.text}</p>

<div className="complaintActions">

<div>
<FaHeart className="actionIcon"/> Like
</div>

<div>
<FaComment className="actionIcon"/> Comment
</div>

</div>

</div>

))}

</div>

)

}

export default Complaint;
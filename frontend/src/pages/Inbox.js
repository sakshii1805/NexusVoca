import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";

function Inbox(){

const navigate = useNavigate();

const users = [
{ id:1, name:"Rahul", msg:"Hey bro", time:"2m" },
{ id:2, name:"Priya", msg:"Check announcement", time:"10m" },
{ id:3, name:"Admin", msg:"Complaint received", time:"1h" },
{ id:4, name:"Riya", msg:"Are you coming?", time:"3h" }
];

return(

<div className="inboxPage">

{/* Header */}

<div className="inboxHeader">
<h2>Messages</h2>
<FaPen className="composeIcon"/>
</div>

{/* Search */}

<input
className="searchBar"
placeholder="Search messages"
/>

{/* Active users row */}

<div className="activeUsers">

{users.map(user=>(
<div key={user.id} className="activeUser">
<div className="userCircle">{user.name.charAt(0)}</div>
<span>{user.name}</span>
</div>
))}

</div>

{/* Chat list */}

<div className="chatList">

{users.map(user=>(
<div
key={user.id}
className="chatRow"
onClick={()=>navigate(`/chat/${user.name}`)}
>

<div className="chatAvatar">
{user.name.charAt(0)}
</div>

<div className="chatInfo">
<b>{user.name}</b>
<p>{user.msg}</p>
</div>

<span className="chatTime">{user.time}</span>

</div>
))}

</div>

</div>

)

}

export default Inbox
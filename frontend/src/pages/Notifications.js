import { FaUserCircle } from "react-icons/fa";

function Notifications(){

const notifications = [
{user:"Rahul", action:"liked your post", time:"2m"},
{user:"Riya", action:"commented on your complaint", time:"10m"},
{user:"Admin", action:"posted a new announcement", time:"1h"},
{user:"Sneha", action:"started following you", time:"2h"},
];

return(

<div className="notificationsPage">

<h2 className="notifTitle">Notifications</h2>

{notifications.map((n,index)=>(
<div className="notificationCard" key={index}>

<FaUserCircle className="notifAvatar"/>

<div className="notifText">

<p>
<b>{n.user}</b> {n.action}
</p>

<span>{n.time} ago</span>

</div>

</div>
))}

</div>

)

}

export default Notifications;
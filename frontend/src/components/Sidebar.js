import { FaHome, FaExclamationCircle, FaBell, FaEnvelope, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

function Sidebar(){

return(

<div className="sidebar">

<Link className="sidebarItem" to="/dashboard">
<FaHome className="sideIcon"/>
<span>Home</span>
</Link>

<Link className="sidebarItem" to="/complaint">
<FaExclamationCircle className="sideIcon"/>
<span>Complaints</span>
</Link>

<Link className="sidebarItem" to="/announcements">
<FaBell className="sideIcon"/>
<span>Announcements</span>
</Link>

<Link className="sidebarItem" to="/inbox">
<FaEnvelope className="sideIcon"/>
<span>Inbox</span>
</Link>

<Link className="sidebarItem" to="/profile">
<FaUser className="sideIcon"/>
<span>Profile</span>
</Link>

</div>

)

}

export default Sidebar;
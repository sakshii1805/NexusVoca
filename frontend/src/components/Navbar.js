import { FaSearch, FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar(){

const navigate = useNavigate();
const [showSearch,setShowSearch] = useState(false);

return(

<div className="navbar">

<div className="logo">
    {showSearch && (
<input 
className="navSearch"
placeholder="Search students..."
/>
)}

<div className="logoCircle">NV</div>
<b>Nexus Voca</b>

</div>

<div className="navIcons">

<FaSearch
className="icon"
onClick={()=>navigate("/search")}
/>

<FaBell 
className="icon"
onClick={() => navigate("/notifications")}
/>

<FaEnvelope
className="icon"
onClick={()=>navigate("/inbox")}
/>

<FaUserCircle
className="icon"
onClick={() => navigate("/profile")}
/>

</div>

</div>

)

}

export default Navbar
import { FaSearch, FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa"

function Navbar(){

return(

<div className="navbar">

<div className="logo">

<div className="logoCircle">NV</div>
<b>Nexus Voca</b>

</div>

<div className="navIcons">

<FaSearch className="icon"/>
<FaBell className="icon"/>
<FaEnvelope className="icon"/>
<FaUserCircle className="icon"/>

</div>

</div>

)

}

export default Navbar
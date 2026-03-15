import { FaUserCircle } from "react-icons/fa";

function Profile(){

const user = JSON.parse(localStorage.getItem("user")) || {
name:"Student",
role:"student"
};

return(

<div className="profilePage">

{/* Profile Header */}

<div className="profileTop">

<FaUserCircle className="profileIcon"/>

<div className="profileDetails">

<h2>{user.name}</h2>
<p className="role">{user.role}</p>

<div className="profileStats">

<div>
<b>12</b>
<span>Posts</span>
</div>

<div>
<b>5</b>
<span>Complaints</span>
</div>

<div>
<b>32</b>
<span>Likes</span>
</div>

</div>

</div>

</div>


{/* About Section */}

<div className="profileSection">

<h3>About</h3>

<p>
Student of Computer Science passionate about improving campus
communication and solving student issues.
</p>

</div>


{/* Contact Info */}

<div className="profileSection">

<h3>Contact Information</h3>

<p><b>Email:</b> student@nexusvoca.com</p>
<p><b>Phone:</b> 9876543210</p>
<p><b>Date of Birth:</b> 12 Jan 2004</p>
<p><b>Department:</b> Computer Science</p>

</div>

</div>

)

}

export default Profile;
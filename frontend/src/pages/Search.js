import { useState } from "react";
import { FaSearch } from "react-icons/fa";

function Search(){

const [query,setQuery] = useState("");

const users = [
"Rahul",
"Riya",
"Arjun",
"Priya",
"Aditya",
"Sneha",
"Rohit"
];

const filtered = users.filter(user =>
user.toLowerCase().includes(query.toLowerCase())
);

return(

<div className="searchPage">

<div className="searchHeader">

<FaSearch className="searchIcon"/>

<input
placeholder="Search students..."
value={query}
onChange={(e)=>setQuery(e.target.value)}
/>

</div>

<div className="searchResults">

{filtered.map((user,index)=>(
<div className="searchUser" key={index}>
<div className="userAvatar"></div>
<span>{user}</span>
</div>
))}

</div>

</div>

)

}

export default Search;
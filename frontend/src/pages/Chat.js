import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaPhone, FaVideo, FaImage, FaMicrophone } from "react-icons/fa";

function Chat(){

const { name } = useParams();

const [message,setMessage] = useState("");

const [messages,setMessages] = useState([
{ text:"Hey! Did you see the announcement?", sender:"other"},
{ text:"Yeah I just saw it.", sender:"me"},
{ text:"Are you coming to college tomorrow?", sender:"other"},
{ text:"Yes 👍", sender:"me"}
]);

const sendMessage = () => {

if(message.trim()==="") return;

setMessages([
...messages,
{ text:message, sender:"me"}
]);

setMessage("");

};

return(

<div className="chatPage">

{/* Header */}

<div className="chatHeader">

<span>{name}</span>

<div className="chatActions">
<FaPhone className="icon"/>
<FaVideo className="icon"/>
</div>

</div>

{/* Messages */}

<div className="chatMessages">

{messages.map((msg,index)=>(
<div
key={index}
className={`message ${msg.sender==="me" ? "me" : "other"}`}
>
{msg.text}
</div>
))}

</div>

{/* Input */}

<div className="chatInput">

<FaImage className="icon"/>
<FaMicrophone className="icon"/>

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder="Message..."
/>

<button onClick={sendMessage}>Send</button>

</div>

</div>

)

}

export default Chat;
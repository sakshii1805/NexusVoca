import { FaBullhorn } from "react-icons/fa";

function Announcements(){

const announcements = [
{
title:"Holiday Notice",
text:"College will remain closed tomorrow due to heavy rain.",
time:"1h"
},
{
title:"Exam Schedule",
text:"Mid semester exams will start from 25th March.",
time:"3h"
},
{
title:"Workshop",
text:"AI & Machine Learning workshop on Friday in Seminar Hall.",
time:"1d"
}
];

return(

<div className="announcementPage">

<h2 className="announcementTitle">Announcements</h2>

{announcements.map((a,index)=>(

<div className="announcementCard" key={index}>

<div className="announcementHeader">

<FaBullhorn className="announcementIcon"/>

<div className="announcementMeta">
  <div className="announcementTopRow">
    <b>{a.title}</b>
    <span className="badge admin">Admin</span>
  </div>
  <p className="announcementTime">{a.time} ago</p>
</div>

</div>

<p className="announcementText">{a.text}</p>

</div>

))}

</div>

)

}

export default Announcements;
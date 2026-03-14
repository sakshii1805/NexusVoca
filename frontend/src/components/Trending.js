function Trending(){

const trends = [
{tag:"#ExamSchedule", posts:128},
{tag:"#CampusFest2026", posts:95},
{tag:"#LibraryHours", posts:42},
{tag:"#PlacementDrive", posts:67}
]

return(

<div className="trending">

<h4>Trending on Campus</h4>

{trends.map((t,i)=>(
<div key={i} className="trendItem">

<b>{t.tag}</b>
<br/>
<small>{t.posts} posts</small>

</div>
))}

</div>

)

}

export default Trending
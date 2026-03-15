import { FaUsers, FaComments, FaBookOpen, FaLaptopCode, FaFlask, FaPalette } from "react-icons/fa";

const groups = [
  { icon: <FaLaptopCode />, name: "Tech & Coding",      members: 142, desc: "Discuss projects, hackathons, and coding tips." },
  { icon: <FaFlask />,      name: "Science Club",        members: 87,  desc: "Research, experiments, and science events." },
  { icon: <FaBookOpen />,   name: "Study Groups",        members: 203, desc: "Find study partners and share notes." },
  { icon: <FaPalette />,    name: "Arts & Culture",      members: 64,  desc: "Creative projects, fests, and cultural events." },
  { icon: <FaComments />,   name: "Campus Discussions",  members: 310, desc: "General campus talk, polls, and opinions." },
  { icon: <FaUsers />,      name: "Placement Prep",      members: 178, desc: "Interview tips, drives, and resume help." },
];

function Community() {
  return (
    <div className="communityPage">

      <h2 className="communityTitle">Community</h2>
      <p className="communitySub">Join groups, connect with peers, and stay involved.</p>

      <div className="communityGrid">
        {groups.map((g, i) => (
          <div className="communityCard" key={i}>
            <div className="communityIcon">{g.icon}</div>
            <div className="communityInfo">
              <h3>{g.name}</h3>
              <p>{g.desc}</p>
              <span>{g.members} members</span>
            </div>
            <button className="joinBtn">Join</button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Community;
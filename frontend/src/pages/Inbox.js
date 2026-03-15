import { useState } from "react";
import { FaSearch, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const conversations = [
  { id: 1, name: "Rahul Kumar", role: "Student", preview: "Hey, are you coming to the fest tomorrow?",    time: "2m",  unread: 2, online: true  },
  { id: 2, name: "Dr. Ramesh",  role: "Teacher", preview: "Please submit your assignment by Friday.",       time: "15m", unread: 1, online: true  },
  { id: 3, name: "Priya",       role: "Student", preview: "Check the announcement about internals.",        time: "1h",  unread: 0, online: false },
  { id: 4, name: "Admin",       role: "Admin",   preview: "Your complaint has been received and reviewed.", time: "2h",  unread: 0, online: true  },
  { id: 5, name: "Riya",        role: "Student", preview: "Did you see the new library hours?",            time: "5h",  unread: 0, online: false },
  { id: 6, name: "Arjun",       role: "Student", preview: "Let's form a study group for the exam.",        time: "1d",  unread: 0, online: false },
];

function Inbox() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.preview.toLowerCase().includes(query.toLowerCase())
  );

  const roleColor = (role) => {
    if (role === "Teacher") return "teacher";
    if (role === "Admin")   return "admin";
    return "student";
  };

  return (
    <div className="inboxPage">

      <div className="inboxHeader">
        <h2>Messages</h2>
        <FaPen className="composeIcon" title="New message" />
      </div>

      <div className="inboxSearch">
        <FaSearch className="inboxSearchIcon" />
        <input
          placeholder="Search messages..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="inboxList">
        {filtered.length === 0 && (
          <p className="inboxEmpty">No conversations found.</p>
        )}

        {filtered.map(c => (
          <div
            key={c.id}
            className={`inboxRow ${c.unread > 0 ? "inboxRow--unread" : ""}`}
            onClick={() => navigate(`/chat/${c.name}`)}
          >
            {/* Avatar with online dot */}
            <div className="inboxAvatarWrap">
              <div className="inboxAvatar">{c.name.charAt(0)}</div>
              <span className={`onlineDot ${c.online ? "online" : "offline"}`} />
            </div>

            <div className="inboxInfo">
              <div className="inboxMeta">
                <span className="inboxName">{c.name}</span>
                <span className={`badge ${roleColor(c.role)}`}>{c.role}</span>
              </div>
              <p className="inboxPreview">
                {c.online ? "🟢 Active now • " : ""}{c.preview}
              </p>
            </div>

            <div className="inboxRight">
              <span className="inboxTime">{c.time}</span>
              {c.unread > 0 && <span className="inboxBadge">{c.unread}</span>}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Inbox;
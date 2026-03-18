import { useEffect, useState } from "react";
import axios from "axios";
import { FaBullhorn, FaPlus, FaTimes } from "react-icons/fa";

const API = "http://localhost:5000";

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showForm, setShowForm]           = useState(false);
  const [title, setTitle]                 = useState("");
  const [text, setText]                   = useState("");
  const [submitting, setSubmitting]       = useState(false);

  const user    = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";

  useEffect(() => { loadAnnouncements(); }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/announcements`);
      setAnnouncements(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const submitAnnouncement = async () => {
    if (!title.trim() || !text.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/api/announcements`, {
        title: title.trim(),
        text: text.trim(),
        author: user.name,
      });
      setAnnouncements(prev => [res.data, ...prev]);
      setTitle(""); setText(""); setShowForm(false);
    } catch (err) { console.log(err); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="announcementPage">
      <div className="announcementPageHeader">
        <div>
          <h2 className="announcementTitle">Announcements</h2>
          <p className="announcementPageSub">Stay updated with campus news.</p>
        </div>
        {isAdmin && (
          <button className="addAnnouncementBtn" onClick={() => setShowForm(!showForm)}>
            {showForm ? <FaTimes /> : <FaPlus />}
            {showForm ? " Cancel" : " New"}
          </button>
        )}
      </div>

      {/* admin compose form */}
      {isAdmin && showForm && (
        <div className="announcementComposer">
          <input
            className="announcementInput"
            placeholder="Announcement title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="announcementTextarea"
            placeholder="Write the announcement..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
          />
          <button className="postBtn" onClick={submitAnnouncement} disabled={submitting || !title.trim() || !text.trim()}>
            {submitting ? "Posting..." : "Post Announcement"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="announcementEmpty">Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="announcementEmpty">No announcements yet.</div>
      ) : (
        announcements.map((a, i) => (
          <div className="announcementCard" key={a._id || i}>
            <div className="announcementHeader">
              <FaBullhorn className="announcementIcon" />
              <div className="announcementMeta">
                <div className="announcementTopRow">
                  <b>{a.title}</b>
                  <span className="badge admin">Admin</span>
                </div>
                <p className="announcementTime">{a.createdAt ? timeAgo(a.createdAt) : "Just now"}</p>
              </div>
            </div>
            <p className="announcementText">{a.text}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Announcements;
import { useState, useEffect } from "react";
import axios from "axios";
import { FaWifi, FaUtensils, FaBook, FaSnowflake, FaBuilding,
         FaExclamationCircle, FaTrash, FaRegHeart, FaPaperPlane } from "react-icons/fa";

const API = "http://localhost:5000";

const CATEGORIES = [
  { label: "All",       value: "all",       icon: null },
  { label: "WiFi",      value: "network",   icon: <FaWifi /> },
  { label: "Canteen",   value: "mess",      icon: <FaUtensils /> },
  { label: "Library",   value: "library",   icon: <FaBook /> },
  { label: "Classroom", value: "classroom", icon: <FaSnowflake /> },
  { label: "Hostel",    value: "hostel",    icon: <FaBuilding /> },
  { label: "Other",     value: "other",     icon: <FaExclamationCircle /> },
];

function getAuthHeaders() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return {};
  return { "x-user-role": user.role, "x-user-email": user.email };
}

function StatusBadge({ status }) {
  const s = String(status || "reported").toLowerCase();
  return <span className={`statusBadge statusBadge--${s}`}>{s.replace("_", " ")}</span>;
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ════════════════════════════════
   CAMPUS ISSUES TAB
════════════════════════════════ */
function IssuesTab({ user }) {
  const [issues, setIssues]           = useState([]);
  const [filterCategory, setFilter]   = useState("all");
  const [loading, setLoading]         = useState(true);
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation]       = useState("");
  const [category, setCategory]       = useState("");
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => { loadIssues(); }, []);

  const loadIssues = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/issues`);
      setIssues(res.data || []);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const submitIssue = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/api/issues`,
        { title: title.trim(), description: description.trim(), location: location.trim(), category: category || undefined },
        { headers: getAuthHeaders() }
      );
      setIssues(prev => [res.data, ...prev].sort((a, b) => (b.votes || 0) - (a.votes || 0)));
      setTitle(""); setDescription(""); setLocation(""); setCategory("");
    } catch (err) { console.log(err); }
    finally { setSubmitting(false); }
  };

  const vote = async (id) => {
    try {
      const res = await axios.post(`${API}/api/issues/${id}/vote`);
      setIssues(prev => prev.map(i => i._id === id ? res.data : i).sort((a, b) => (b.votes || 0) - (a.votes || 0)));
    } catch (err) { console.log(err); }
  };

  const visible = filterCategory === "all" ? issues : issues.filter(i => i.category === filterCategory);

  return (
    <div>
      {/* form — students and teachers only */}
      {user && (user.role === "student" || user.role === "teacher") && (
        <form className="issueForm" onSubmit={submitIssue}>
          <div className="issueFormGrid">
            <div className="field">
              <label>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Water problem in Hostel Block B" />
            </div>
            <div className="field">
              <label>Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Hostel Block B" />
            </div>
            <div className="field">
              <label>Category (optional)</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Auto-detect</option>
                <option value="hostel">Hostel</option>
                <option value="mess">Mess / Canteen</option>
                <option value="classroom">Classroom</option>
                <option value="network">WiFi / Network</option>
                <option value="library">Library</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue clearly..." />
          </div>
          <div className="issueFormFooter">
            <div className="anonNote">🔒 Anonymous — your identity is not shown to other students.</div>
            <button className="postBtn" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Issue"}
            </button>
          </div>
        </form>
      )}

      {/* filters */}
      <div className="complaintFilters">
        {CATEGORIES.map(cat => (
          <button key={cat.value}
            className={`filterChip${filterCategory === cat.value ? " filterChip--active" : ""}`}
            onClick={() => setFilter(cat.value)}>
            {cat.icon && <span style={{ fontSize: 11 }}>{cat.icon}</span>}
            {cat.label}
          </button>
        ))}
      </div>

      {/* list */}
      {loading ? <div className="complaintEmpty">Loading issues...</div>
        : visible.length === 0 ? <div className="complaintEmpty">No issues found.</div>
        : visible.map(issue => (
          <div className="issueCard" key={issue._id}>
            <div className="issueTop">
              <div className="issueTitleWrap">
                <div className="issueTitleRow">
                  <h3 className="issueTitle">{issue.title}</h3>
                  <StatusBadge status={issue.status} />
                </div>
                <div className="issueMeta">
                  <span className={`catPill catPill--${String(issue.category || "").toLowerCase()}`}>
                    {issue.category || "other"}
                  </span>
                  <span className="dot">•</span>
                  <span>{issue.location}</span>
                </div>
              </div>
              <div className="voteBox">
                <div className="voteCount">{issue.votes || 0}</div>
                <button className="voteBtn" onClick={() => vote(issue._id)}>▲ Vote</button>
              </div>
            </div>
            <p className="issueDesc">{issue.description}</p>
          </div>
        ))
      }
    </div>
  );
}

/* ════════════════════════════════
   COMPLAINTS TAB
════════════════════════════════ */
function ComplaintsTab({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [activeFilter, setFilter]   = useState("all");
  const [text, setText]             = useState("");
  const [category, setCategory]     = useState("other");
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const canPost = user && (user.role === "student" || user.role === "teacher");

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/complaints`);
      setComplaints(res.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/api/complaints`, {
        author: user.name, role: user.role, text: text.trim(), category,
      });
      setComplaints(prev => [res.data, ...prev]);
      setText(""); setCategory("other");
    } catch (err) { console.log(err); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/complaints/${id}`, {
        data: { username: user.name, role: user.role },
      });
      setComplaints(prev => prev.filter(c => c._id !== id));
    } catch (err) { console.log(err); }
  };

  const handleLike = async (id) => {
    try {
      const res = await axios.post(`${API}/api/complaints/like/${id}`);
      setComplaints(prev => prev.map(c => c._id === id ? res.data : c));
    } catch (err) { console.log(err); }
  };

  const filtered = activeFilter === "all" ? complaints
    : complaints.filter(c => c.category === activeFilter);

  return (
    <div>
      {canPost && (
        <div className="complaintComposer">
          <div className="composerTop">
            <div className="composerAvatar">{user.name?.charAt(0).toUpperCase()}</div>
            <textarea className="composerTextarea"
              placeholder="What's your complaint? Describe it clearly..."
              value={text} onChange={e => setText(e.target.value)} rows={3} />
          </div>
          <div className="composerBottom">
            <select className="composerSelect" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.filter(c => c.value !== "all").map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <button className="composerBtn" onClick={handleSubmit} disabled={submitting || !text.trim()}>
              {submitting ? "Posting..." : <><FaPaperPlane style={{ fontSize: 13 }} /> Post</>}
            </button>
          </div>
        </div>
      )}

      <div className="complaintFilters">
        {CATEGORIES.map(cat => (
          <button key={cat.value}
            className={`filterChip${activeFilter === cat.value ? " filterChip--active" : ""}`}
            onClick={() => setFilter(cat.value)}>
            {cat.icon && <span style={{ fontSize: 11 }}>{cat.icon}</span>}
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? <div className="complaintEmpty">Loading complaints...</div>
        : filtered.length === 0 ? <div className="complaintEmpty">No complaints yet.</div>
        : filtered.map(c => (
          <div className="complaintCard" key={c._id}>
            <div className="cCardTop">
              <div className="cCardLeft">
                <div className="cCardAvatar">{c.author?.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="cCardMeta">
                    <span className="cCardName">{c.author}</span>
                    <span className={`badge ${c.role}`}>{c.role}</span>
                  </div>
                  <span className="cCardTime">{timeAgo(c.createdAt)}</span>
                </div>
              </div>
              <div className="cCardRight">
                <span className="cCategoryBadge">{c.category}</span>
                {(user?.role === "admin" || user?.name === c.author) && (
                  <button className="cDeleteBtn" onClick={() => handleDelete(c._id)}>
                    <FaTrash style={{ fontSize: 12 }} />
                  </button>
                )}
              </div>
            </div>
            <p className="cCardText">{c.text}</p>
            <div className="cCardActions">
              <button className="cActionBtn" onClick={() => handleLike(c._id)}>
                <FaRegHeart style={{ fontSize: 13 }} /> {c.likes || 0}
              </button>
            </div>
          </div>
        ))
      }
    </div>
  );
}

/* ════════════════════════════════
   MAIN COMPONENT
════════════════════════════════ */
function Complaint() {
  const [tab, setTab] = useState("issues");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="complaintPage">
      <div className="complaintHeader">
        <h2 className="complaintTitle">Report & Complaints</h2>
        <p className="complaintSub">Raise issues and complaints to help improve campus life.</p>
      </div>

      {/* tabs */}
      <div className="rcTabs">
        <button className={`rcTab${tab === "issues" ? " rcTab--active" : ""}`} onClick={() => setTab("issues")}>
          🏫 Campus Issues
        </button>
        <button className={`rcTab${tab === "complaints" ? " rcTab--active" : ""}`} onClick={() => setTab("complaints")}>
          📢 Complaints
        </button>
      </div>

      {tab === "issues"
        ? <IssuesTab user={user} />
        : <ComplaintsTab user={user} />
      }
    </div>
  );
}

export default Complaint;
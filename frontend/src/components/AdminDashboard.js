import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { FaTrash, FaBullhorn, FaBan, FaCheck, FaTimes, FaUsers, FaNewspaper, FaExclamationTriangle, FaFlag } from "react-icons/fa";

const API = "http://localhost:5000";

function getAuthHeaders() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return {};
  return { "x-user-role": user.role, "x-user-email": user.email };
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

/* ════ TAB: ANALYTICS ════ */
function AnalyticsTab({ analytics, issues, loading, onRefresh, onStatusUpdate }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const topIssues = useMemo(() => analytics?.topIssues || [], [analytics]);

  useEffect(() => {
    if (!analytics || !chartRef.current) return;
    const data = analytics.issuesByCategory || {};
    const labels = ["hostel","mess","classroom","network"].map(x => x.charAt(0).toUpperCase()+x.slice(1));
    const values = ["hostel","mess","classroom","network"].map(k => data[k] || 0);
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: { labels, datasets: [{ data: values, backgroundColor: ["#2563EB","#F97316","#10B981","#8B5CF6"], borderColor: ["#fff","#fff","#fff","#fff"], borderWidth: 2 }] },
      options: { plugins: { legend: { position: "bottom" } }, cutout: "65%" },
    });
  }, [analytics]);

  return (
    <div>
      <div className="adminGrid">
        <div className="adminCard"><div className="adminCardLabel">Total Issues</div><div className="adminCardValue">{analytics?.totalIssues ?? 0}</div></div>
        <div className="adminCard"><div className="adminCardLabel">Hostel</div><div className="adminCardValue">{analytics?.issuesByCategory?.hostel || 0}</div></div>
        <div className="adminCard"><div className="adminCardLabel">Mess</div><div className="adminCardValue">{analytics?.issuesByCategory?.mess || 0}</div></div>
        <div className="adminCard"><div className="adminCardLabel">Network</div><div className="adminCardValue">{analytics?.issuesByCategory?.network || 0}</div></div>
      </div>
      <div className="adminPanels">
        <div className="adminPanel"><div className="adminPanelTitle">Issues by Category</div><div className="chartWrap"><canvas ref={chartRef}/></div></div>
        <div className="adminPanel"><div className="adminPanelTitle">Top Issues</div><div className="topList">
          {topIssues.length === 0 && <div className="emptyState">No issues yet.</div>}
          {topIssues.map(t => <div className="topRow" key={t._id}><div className="topTitle">{t.title}</div><div className="topVotes">{t.votes} votes</div></div>)}
        </div></div>
      </div>
      <div className="adminPanel" style={{marginTop:14}}>
        <div className="adminPanelTitle">Issue Management</div>
        {loading && <div className="emptyState">Loading…</div>}
        {!loading && issues.length === 0 && <div className="emptyState">No issues found.</div>}
        {!loading && issues.length > 0 && (
          <div className="tableWrap"><table className="adminTable">
            <thead><tr><th>Title</th><th>Category</th><th>Location</th><th>Votes</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>{issues.map(i => (
              <tr key={i._id}>
                <td className="cellTitle">{i.title}</td>
                <td>{i.category}</td><td>{i.location}</td><td>{i.votes||0}</td><td>{i.status}</td>
                <td><select defaultValue={i.status} onChange={e => onStatusUpdate(i._id, e.target.value)}>
                  <option value="reported">reported</option>
                  <option value="in_progress">in_progress</option>
                  <option value="resolved">resolved</option>
                </select></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}

/* ════ TAB: ANNOUNCEMENTS ════ */
function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText]   = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => { loadAnnouncements(); }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/announcements`);
      setAnnouncements(res.data.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)));
    } catch(err){console.log(err);}
    finally{setLoading(false);}
  };

  const post = async () => {
    if (!title.trim() || !text.trim()) return;
    try {
      const res = await axios.post(`${API}/api/announcements`, { title: title.trim(), text: text.trim(), author: user.name });
      setAnnouncements(prev => [res.data, ...prev]);
      setTitle(""); setText("");
    } catch(err){console.log(err);}
  };

  return (
    <div>
      <div className="adminPanel" style={{marginBottom:14}}>
        <div className="adminPanelTitle">Post Announcement</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <input className="announcementInput" placeholder="Title..." value={title} onChange={e=>setTitle(e.target.value)}/>
          <textarea className="announcementTextarea" placeholder="Write announcement..." value={text} onChange={e=>setText(e.target.value)} rows={3}/>
          <button className="btnPrimary" style={{alignSelf:"flex-end"}} onClick={post} disabled={!title.trim()||!text.trim()}>
            <FaBullhorn style={{marginRight:6}}/>Post
          </button>
        </div>
      </div>
      <div className="adminPanel">
        <div className="adminPanelTitle">All Announcements</div>
        {loading ? <div className="emptyState">Loading...</div>
          : announcements.length === 0 ? <div className="emptyState">No announcements yet.</div>
          : announcements.map((a,i) => (
            <div key={a._id||i} style={{padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
              <div style={{fontWeight:700,fontSize:14}}>{a.title}</div>
              <div style={{fontSize:13,color:"var(--text-sub)",margin:"4px 0"}}>{a.text}</div>
              <div style={{fontSize:11,color:"var(--text-muted)"}}>{a.createdAt ? timeAgo(a.createdAt) : ""}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ════ TAB: USERS ════ */
function UsersTab() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState("");
  const [warned, setWarned]   = useState({});

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/users`, { headers: getAuthHeaders() });
      setUsers(res.data);
    } catch(err){console.log(err);}
    finally{setLoading(false);}
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await axios.delete(`${API}/api/admin/users/${id}`, { headers: getAuthHeaders() });
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch(err){console.log(err);}
  };

  const warnUser = (id) => {
    setWarned(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setWarned(prev => ({ ...prev, [id]: false })), 3000);
  };

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(query.toLowerCase()) ||
    u.email?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="adminPanel">
      <div className="adminPanelTitle">Manage Users</div>
      <input className="announcementInput" placeholder="Search users..." value={query} onChange={e=>setQuery(e.target.value)} style={{marginBottom:12}}/>
      {loading ? <div className="emptyState">Loading...</div>
        : filtered.length === 0 ? <div className="emptyState">No users found.</div>
        : <div className="tableWrap"><table className="adminTable">
            <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Dept</th><th>Actions</th></tr></thead>
            <tbody>{filtered.map(u => (
              <tr key={u._id}>
                <td className="cellTitle">{u.username}</td>
                <td style={{fontSize:12}}>{u.email}</td>
                <td><span className={`badge ${u.role}`}>{u.role}</span></td>
                <td style={{fontSize:12}}>{u.department || "—"}</td>
                <td>
                  <div style={{display:"flex",gap:6}}>
                    <button className="adminActionBtn adminActionBtn--warn" onClick={() => warnUser(u._id)} title="Warn user">
                      {warned[u._id] ? <FaCheck/> : <FaBan/>}
                    </button>
                    <button className="adminActionBtn adminActionBtn--delete" onClick={() => deleteUser(u._id)} title="Delete user">
                      <FaTrash/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table></div>
      }
    </div>
  );
}

/* ════ TAB: COMPLAINTS ════ */
function ComplaintsTab() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => { loadComplaints(); }, []);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/complaints`);
      setComplaints(res.data);
    } catch(err){console.log(err);}
    finally{setLoading(false);}
  };

  const deleteComplaint = async (id) => {
    try {
      await axios.delete(`${API}/api/complaints/${id}`, { data: { username: "admin", role: "admin" } });
      setComplaints(prev => prev.filter(c => c._id !== id));
    } catch(err){console.log(err);}
  };

  return (
    <div className="adminPanel">
      <div className="adminPanelTitle">All Complaints</div>
      {loading ? <div className="emptyState">Loading...</div>
        : complaints.length === 0 ? <div className="emptyState">No complaints.</div>
        : complaints.map(c => (
          <div key={c._id} style={{padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{c.author} <span className={`badge ${c.role}`}>{c.role}</span></div>
                <div style={{fontSize:13,color:"var(--text-sub)",margin:"4px 0"}}>{c.text}</div>
                <div style={{fontSize:11,color:"var(--text-muted)"}}>{c.category} • {timeAgo(c.createdAt)}</div>
              </div>
              <button className="adminActionBtn adminActionBtn--delete" onClick={() => deleteComplaint(c._id)}>
                <FaTrash/>
              </button>
            </div>
          </div>
        ))
      }
    </div>
  );
}

/* ════ TAB: POSTS ════ */
function PostsTab() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/posts`);
      setPosts(res.data);
    } catch(err){console.log(err);}
    finally{setLoading(false);}
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`${API}/api/posts/${id}`);
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch(err){console.log(err);}
  };

  return (
    <div className="adminPanel">
      <div className="adminPanelTitle">All Posts</div>
      {loading ? <div className="emptyState">Loading...</div>
        : posts.length === 0 ? <div className="emptyState">No posts.</div>
        : posts.map(p => (
          <div key={p._id} style={{padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{p.author} <span className={`badge ${p.role}`}>{p.role}</span></div>
                <div style={{fontSize:13,color:"var(--text-sub)",margin:"4px 0"}}>{p.text?.substring(0,120)}{p.text?.length>120?"...":""}</div>
                <div style={{fontSize:11,color:"var(--text-muted)"}}>{timeAgo(p.createdAt)} • ❤️ {p.likes||0}</div>
              </div>
              <button className="adminActionBtn adminActionBtn--delete" onClick={() => deletePost(p._id)}>
                <FaTrash/>
              </button>
            </div>
          </div>
        ))
      }
    </div>
  );
}

/* ════ TAB: REPORTS ════ */
function ReportsTab() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/reports`, { headers: getAuthHeaders() });
      setReports(res.data);
    } catch(err){ console.log(err); }
    finally { setLoading(false); }
  };

  const resolve = async (id) => {
    try {
      await axios.post(`${API}/api/admin/reports/${id}/resolve`, {}, { headers: getAuthHeaders() });
      setReports(prev => prev.filter(r => r._id !== id));
    } catch(err){ console.log(err); }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`${API}/api/admin/reports/${id}/delete-post`, { headers: getAuthHeaders() });
      setReports(prev => prev.filter(r => r._id !== id));
    } catch(err){ console.log(err); }
  };

  return (
    <div className="adminPanel">
      <div className="adminPanelTitle">Reported Content</div>
      {loading ? <div className="emptyState">Loading...</div>
        : reports.length === 0 ? <div className="emptyState">No pending reports.</div>
        : reports.map(r => (
          <div key={r._id} style={{padding:"12px 0", borderBottom:"1px solid var(--border)"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
              <div>
                <div style={{fontWeight:700, fontSize:14}}>
                  {r.type === "post" ? "Post" : "User"} reported by {r.reporter}
                </div>
                <div style={{fontSize:13, color:"var(--text-sub)", margin:"4px 0"}}>
                  Reason: {r.reason}
                </div>
                {r.targetName && (
                  <div style={{fontSize:12, color:"var(--text-muted)"}}>"{r.targetName}"</div>
                )}
                <div style={{fontSize:11, color:"var(--text-muted)", marginTop:4}}>
                  {timeAgo(r.createdAt)}
                </div>
              </div>
              <div style={{display:"flex", gap:6}}>
                {r.type === "post" && (
                  <button className="adminActionBtn adminActionBtn--delete" onClick={() => deletePost(r._id)} title="Delete post">
                    <FaTrash/>
                  </button>
                )}
                <button className="adminActionBtn" onClick={() => resolve(r._id)} title="Dismiss"
                  style={{background:"#10b981", color:"#fff", border:"none"}}>
                  <FaCheck/>
                </button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

/* ════ MAIN ════ */
function AdminDashboard() {
  const [tab, setTab]           = useState("analytics");
  const [issues, setIssues]     = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]   = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [issuesRes, analyticsRes] = await Promise.all([
        axios.get(`${API}/api/issues`),
        axios.get(`${API}/api/admin/analytics`, { headers: getAuthHeaders() }),
      ]);
      setIssues(issuesRes.data || []);
      setAnalytics(analyticsRes.data || null);
    } catch(err){ console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const updateStatus = async (issueId, status) => {
    try {
      const res = await axios.put(`${API}/api/issues/${issueId}/status`, { status }, { headers: getAuthHeaders() });
      setIssues(prev => prev.map(i => i._id === issueId ? res.data : i));
      const analyticsRes = await axios.get(`${API}/api/admin/analytics`, { headers: getAuthHeaders() });
      setAnalytics(analyticsRes.data || null);
    } catch(err){ console.log(err); }
  };

  const TABS = [
    { key: "analytics",     label: "Analytics",     icon: <FaExclamationTriangle/> },
    { key: "announcements", label: "Announcements", icon: <FaBullhorn/> },
    { key: "users",         label: "Users",         icon: <FaUsers/> },
    { key: "complaints",    label: "Complaints",    icon: <FaExclamationTriangle/> },
    { key: "posts",         label: "Posts",         icon: <FaNewspaper/> },
    { key: "reports",       label: "Reports",       icon: <FaFlag/> },
  ];

  return (
    <div className="adminPage">
      <div className="adminHeader">
        <div>
          <h2 className="adminTitle">Admin Dashboard</h2>
          <p className="adminSub">Manage your campus platform.</p>
        </div>
        <button className="btnSecondary" onClick={loadAll} disabled={loading}>Refresh</button>
      </div>

      <div className="adminTabs">
        {TABS.map(t => (
          <button key={t.key} className={`adminTab${tab===t.key?" adminTab--active":""}`} onClick={() => setTab(t.key)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "analytics"     && <AnalyticsTab analytics={analytics} issues={issues} loading={loading} onRefresh={loadAll} onStatusUpdate={updateStatus}/>}
      {tab === "announcements" && <AnnouncementsTab/>}
      {tab === "users"         && <UsersTab/>}
      {tab === "complaints"    && <ComplaintsTab/>}
      {tab === "posts"         && <PostsTab/>}
      {tab === "reports"       && <ReportsTab/>}
    </div>
  );
}

export default AdminDashboard;
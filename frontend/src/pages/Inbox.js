import { useState, useEffect, useCallback } from "react";
import { FaSearch, FaPen, FaTimes, FaUsers, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000";

function Inbox() {
  const [conversations, setConversations] = useState([]);
  const [query, setQuery]                 = useState("");
  const [loading, setLoading]             = useState(true);
  const [showNew, setShowNew]             = useState(false);
  const [newType, setNewType]             = useState("dm");
  const [searchQ, setSearchQ]             = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [groupName, setGroupName]         = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [unreadMap, setUnreadMap]         = useState({});

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loadConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/chat/conversations/${user.name}`);
      setConversations(res.data);
      // compute unread per conversation
      const map = {};
      await Promise.all(res.data.map(async (c) => {
        const msgs = await axios.get(`${API}/api/chat/messages/${c._id}`);
        map[c._id] = msgs.data.filter(m => m.sender !== user.name && !m.readBy.includes(user.name)).length;
      }));
      setUnreadMap(map);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  }, [user?.name]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const searchUsers = async (q) => {
    setSearchQ(q);
    if (!q.trim()) { setSearchResults([]); return; }
    try {
      const res = await axios.get(`${API}/api/chat/users/search?q=${q}`);
      setSearchResults(res.data.filter(u => u.username !== user.name));
    } catch (err) { console.log(err); }
  };

  const startDM = async (targetUsername) => {
    try {
      const res = await axios.post(`${API}/api/chat/conversations/dm`, {
        userA: user.name, userB: targetUsername,
      });
      setShowNew(false);
      navigate(`/chat/${res.data._id}`);
    } catch (err) { console.log(err); }
  };

  const toggleUser = (u) => {
    setSelectedUsers(prev =>
      prev.find(x => x.username === u.username)
        ? prev.filter(x => x.username !== u.username)
        : [...prev, u]
    );
  };

  const createGroup = async () => {
    if (!groupName.trim() || selectedUsers.length < 1) return;
    try {
      const res = await axios.post(`${API}/api/chat/conversations/group`, {
        name: groupName.trim(),
        members: [user.name, ...selectedUsers.map(u => u.username)],
        createdBy: user.name,
      });
      setShowNew(false);
      setGroupName(""); setSelectedUsers([]);
      navigate(`/chat/${res.data._id}`);
    } catch (err) { console.log(err); }
  };

  const getConvoName = (c) => {
    if (c.type === "group") return c.name;
    return c.members.find(m => m !== user.name) || "Unknown";
  };

  const filtered = conversations.filter(c =>
    getConvoName(c).toLowerCase().includes(query.toLowerCase()) ||
    (c.lastMessage || "").toLowerCase().includes(query.toLowerCase())
  );

  const timeAgo = (date) => {
    if (!date) return "";
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60)    return `${diff}s`;
    if (diff < 3600)  return `${Math.floor(diff/60)}m`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h`;
    return `${Math.floor(diff/86400)}d`;
  };

  return (
    <div className="inboxPage">
      <div className="inboxHeader">
        <h2>Messages</h2>
        <button className="inboxNewBtn" onClick={() => setShowNew(!showNew)} title="New message">
          {showNew ? <FaTimes /> : <FaPen />}
        </button>
      </div>

      {/* ── NEW CHAT PANEL ── */}
      {showNew && (
        <div className="newChatPanel">
          <div className="newChatTabs">
            <button className={`newChatTab${newType === "dm" ? " active" : ""}`} onClick={() => setNewType("dm")}>
              <FaUser style={{fontSize:11}}/> Direct Message
            </button>
            <button className={`newChatTab${newType === "group" ? " active" : ""}`} onClick={() => setNewType("group")}>
              <FaUsers style={{fontSize:11}}/> Group Chat
            </button>
          </div>

          {newType === "group" && (
            <input className="newChatInput" placeholder="Group name..."
              value={groupName} onChange={e => setGroupName(e.target.value)} />
          )}

          <div className="newChatSearch">
            <FaSearch style={{color:"var(--text-muted)", fontSize:13}} />
            <input placeholder="Search users..." value={searchQ} onChange={e => searchUsers(e.target.value)} />
          </div>

          {selectedUsers.length > 0 && (
            <div className="selectedUsers">
              {selectedUsers.map(u => (
                <span key={u.username} className="selectedChip">
                  {u.username} <button onClick={() => toggleUser(u)}>×</button>
                </span>
              ))}
            </div>
          )}

          <div className="newChatResults">
            {searchResults.map(u => (
              <div key={u.username} className="newChatUser"
                onClick={() => newType === "dm" ? startDM(u.username) : toggleUser(u)}>
                <div className="inboxAvatar" style={{width:32,height:32,fontSize:13}}>
                  {u.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:13}}>{u.username}</div>
                  <div style={{fontSize:11,color:"var(--text-muted)"}}>{u.role}</div>
                </div>
                {newType === "group" && selectedUsers.find(x => x.username === u.username) && (
                  <span style={{marginLeft:"auto",color:"var(--primary)",fontSize:13}}>✓</span>
                )}
              </div>
            ))}
          </div>

          {newType === "group" && selectedUsers.length > 0 && (
            <button className="createGroupBtn" onClick={createGroup}>
              Create Group ({selectedUsers.length + 1} members)
            </button>
          )}
        </div>
      )}

      {/* ── SEARCH ── */}
      <div className="inboxSearch">
        <FaSearch className="inboxSearchIcon" />
        <input placeholder="Search messages..." value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      {/* ── LIST ── */}
      <div className="inboxList">
        {loading && <p className="inboxEmpty">Loading...</p>}
        {!loading && filtered.length === 0 && <p className="inboxEmpty">No conversations yet. Start one! 👆</p>}

        {filtered.map(c => {
          const unread = unreadMap[c._id] || 0;
          const convoName = getConvoName(c);
          return (
            <div key={c._id}
              className={`inboxRow${unread > 0 ? " inboxRow--unread" : ""}`}
              onClick={() => navigate(`/chat/${c._id}`)}>
              <div className="inboxAvatarWrap">
                <div className="inboxAvatar">
                  {c.type === "group" ? <FaUsers style={{fontSize:16}}/> : convoName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="inboxInfo">
                <div className="inboxMeta">
                  <span className="inboxName">{convoName}</span>
                  {c.type === "group" && <span className="badge student">Group</span>}
                </div>
                <p className="inboxPreview">{c.lastMessage || "No messages yet"}</p>
              </div>
              <div className="inboxRight">
                <span className="inboxTime">{timeAgo(c.lastTime)}</span>
                {unread > 0 && <span className="inboxBadge">{unread}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inbox;
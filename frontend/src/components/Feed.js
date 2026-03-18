import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Post from "./Post";

const API = "http://localhost:5000";

function AnnouncementWidget() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/announcements`)
      .then(res => setAnnouncements(res.data.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,3)))
      .catch(err => console.log(err));
  }, []);

  if (announcements.length === 0) return null;

  return (
    <div className="announcementWidget">
      <div className="announcementWidgetHeader">
        <span className="announcementWidgetIcon">📢</span>
        <span className="announcementWidgetTitle">Latest Announcements</span>
      </div>
      {announcements.map((a, i) => (
        <div key={a._id || i} className="announcementWidgetItem">
          <div className="announcementWidgetName">{a.title}</div>
          <div className="announcementWidgetText">{a.text}</div>
        </div>
      ))}
    </div>
  );
}

function Feed() {
  const [posts, setPosts]         = useState([]);
  const [text, setText]           = useState("");
  const [media, setMedia]         = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const [isAnon, setIsAnon]       = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loadData = useCallback(async () => {
    setFetching(true);
    try {
      const [postsRes, settingsRes, blockedRes] = await Promise.all([
        axios.get(`${API}/api/posts`),
        axios.get(`${API}/api/users/settings/${user.name}`),
        axios.get(`${API}/api/users/blocked/${user.name}`),
      ]);
      setPosts(postsRes.data);
      setIsAnon(settingsRes.data.anonymousByDefault);
      setBlockedUsers(blockedRes.data);
    } catch(err){ console.log(err); }
    finally { setFetching(false); }
  }, [user?.name]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const type = file.type.startsWith("video") ? "video"
               : file.type.startsWith("audio") ? "audio" : "image";
    setMedia(file); setMediaType(type);
  };

  const submitPost = async () => {
    if (!text.trim() && !media) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("author", isAnon ? "Anonymous" : user.name);
      formData.append("role",   isAnon ? "student" : user.role);
      formData.append("text",   text.trim());
      formData.append("isAnonymous", isAnon);
      if (media) formData.append("media", media);
      const res = await axios.post(`${API}/api/posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPosts(prev => [res.data, ...prev]);
      setText(""); setMedia(null); setMediaType("");
    } catch(err){ console.log(err); }
    finally { setLoading(false); }
  };

  const handleDelete = (id) => setPosts(prev => prev.filter(p => p._id !== id));

  const visiblePosts = posts.filter(p => !blockedUsers.includes(p.author));

  return (
    <div className="feed">
      <h2>Campus Feed</h2>

      <AnnouncementWidget />

      {/* ── COMPOSER ── */}
      <div className="composer">
        <textarea
          placeholder={isAnon ? "Posting anonymously..." : "What's happening on campus?"}
          value={text}
          onChange={e => setText(e.target.value)}
        />

        {media && (
          <div className="mediaPreview">
            {mediaType === "image" && <img src={URL.createObjectURL(media)} alt="preview"/>}
            {mediaType === "video" && <video src={URL.createObjectURL(media)} controls/>}
            {mediaType === "audio" && <audio src={URL.createObjectURL(media)} controls/>}
            <button className="removeMedia" onClick={() => { setMedia(null); setMediaType(""); }}>✕</button>
          </div>
        )}

        <div className="composerActions">
          <div className="composerLeft">
            <div className="mediaButtons">
              <label className="mediaBtn" title="Upload image">🖼️<input type="file" accept="image/*" onChange={handleMedia} hidden/></label>
              <label className="mediaBtn" title="Upload video">🎥<input type="file" accept="video/*" onChange={handleMedia} hidden/></label>
              <label className="mediaBtn" title="Upload audio">🎙️<input type="file" accept="audio/*" onChange={handleMedia} hidden/></label>
            </div>
            {/* per-post anon toggle */}
            <button
              className={`anonToggleBtn${isAnon ? " anonToggleBtn--on" : ""}`}
              onClick={() => setIsAnon(!isAnon)}
              title={isAnon ? "Posting anonymously" : "Post anonymously"}
            >
              {isAnon ? "🕵️ Anonymous" : "👤 Public"}
            </button>
          </div>
          <button className="postBtn" onClick={submitPost} disabled={loading || (!text.trim() && !media)}>
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* ── POSTS ── */}
      {fetching ? (
        <div className="feedLoading">Loading posts...</div>
      ) : visiblePosts.length === 0 ? (
        <div className="feedEmpty">No posts yet. Be the first to post!</div>
      ) : (
        visiblePosts.map(post => (
          <Post key={post._id} post={post} onDelete={handleDelete} blockedUsers={blockedUsers} setBlockedUsers={setBlockedUsers}/>
        ))
      )}
    </div>
  );
}

export default Feed;
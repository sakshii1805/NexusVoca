import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUsers, FaSync, FaPaperPlane, FaImage, FaMicrophone } from "react-icons/fa";
import axios from "axios";

const API = "http://localhost:5000";

function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages]         = useState([]);
  const [text, setText]                 = useState("");
  const [loading, setLoading]           = useState(true);
  const [sending, setSending]           = useState(false);
  const [showMembers, setShowMembers]   = useState(false);
  const messagesEndRef = useRef(null);

  const loadMessages = useCallback(async () => {
    try {
      const [convoRes, msgsRes] = await Promise.all([
        axios.get(`${API}/api/chat/conversations/${user.name}`),
        axios.get(`${API}/api/chat/messages/${id}`),
      ]);
      const found = convoRes.data.find(c => c._id === id);
      setConversation(found || null);
      setMessages(msgsRes.data);
      // mark as read
      await axios.post(`${API}/api/chat/messages/read/${id}`, { username: user.name });
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  }, [id, user?.name]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await axios.post(`${API}/api/chat/messages`, {
        conversationId: id,
        sender: user.name,
        senderRole: user.role,
        text: text.trim(),
      });
      setMessages(prev => [...prev, res.data]);
      setText("");
    } catch (err) { console.log(err); }
    finally { setSending(false); }
  };

  const getConvoName = () => {
    if (!conversation) return "Chat";
    if (conversation.type === "group") return conversation.name;
    return conversation.members?.find(m => m !== user.name) || "Chat";
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString();
  };

  // group messages by date
  const grouped = messages.reduce((acc, msg) => {
    const dateKey = formatDate(msg.createdAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  return (
    <div className="chatPage">
      {/* ── HEADER ── */}
      <div className="chatHeader">
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <button className="chatBackBtn" onClick={() => navigate("/inbox")}>
            <FaArrowLeft />
          </button>
          <div className="chatHeaderAvatar">
            {conversation?.type === "group"
              ? <FaUsers style={{fontSize:16}}/>
              : getConvoName().charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="chatHeaderName">{getConvoName()}</div>
            {conversation?.type === "group" && (
              <div className="chatHeaderSub">{conversation?.members?.length} members</div>
            )}
          </div>
        </div>

        <div className="chatActions">
          <button className="chatActionBtn" onClick={loadMessages} title="Refresh">
            <FaSync style={{fontSize:14}}/>
          </button>
          {conversation?.type === "group" && (
            <button className="chatActionBtn" onClick={() => setShowMembers(!showMembers)} title="Members">
              <FaUsers style={{fontSize:14}}/>
            </button>
          )}
        </div>
      </div>

      {/* ── MEMBERS PANEL ── */}
      {showMembers && conversation?.type === "group" && (
        <div className="chatMembersPanel">
          <div className="chatMembersTitle">Members ({conversation.members.length})</div>
          {conversation.members.map(m => (
            <div key={m} className="chatMember">
              <div className="chatMemberAvatar">{m.charAt(0).toUpperCase()}</div>
              <span>{m}</span>
              {m === conversation.createdBy && <span className="chatCreatorBadge">creator</span>}
            </div>
          ))}
        </div>
      )}

      {/* ── MESSAGES ── */}
      <div className="chatMessages">
        {loading && <div className="chatLoading">Loading messages...</div>}
        {!loading && messages.length === 0 && (
          <div className="chatEmpty">No messages yet. Say hello! 👋</div>
        )}

        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className="chatDateDivider"><span>{date}</span></div>
            {msgs.map((msg, i) => {
              const isMe = msg.sender === user.name;
              return (
                <div key={msg._id || i} className={`chatBubbleWrap ${isMe ? "me" : "other"}`}>
                  {!isMe && conversation?.type === "group" && (
                    <div className="chatSenderName">{msg.sender}</div>
                  )}
                  <div className={`message ${isMe ? "me" : "other"}`}>
                    {msg.text}
                    <span className="msgTime">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ── INPUT ── */}
      <div className="chatInput">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} disabled={sending || !text.trim()} className="chatSendBtn">
          <FaPaperPlane style={{fontSize:14}}/>
        </button>
      </div>
    </div>
  );
}

export default Chat;
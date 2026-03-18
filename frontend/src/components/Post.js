import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaShareAlt, FaEllipsisH, FaBan, FaFlag } from "react-icons/fa";
import axios from "axios";
import CommentBox from "./CommentBox";
import CommentList from "./CommentList";
import ReportModal from "./ReportModal";

const API = "http://localhost:5000";

function Post({ post, onDelete, blockedUsers = [], setBlockedUsers }) {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes]       = useState(post?.likes || 0);
  const [liked, setLiked]       = useState(false);
  const [reposted, setReposted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [blocked, setBlocked]   = useState(false);
  const navigate = useNavigate();

  if (!post) return null;

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const isOwner     = currentUser && currentUser.name === post.author;
  const isAnonymous = post.isAnonymous || post.author === "Anonymous";
  const canBlock    = !isOwner && !isAnonymous;

  const likePost = async () => {
    if (liked) return;
    try { await axios.post(`${API}/api/posts/like/${post._id}`); } catch(err){ console.log(err); }
    setLikes(prev => prev + 1); setLiked(true);
  };

  const deletePost = async () => {
    if (!window.confirm("Delete this post?")) return;
    try { await axios.delete(`${API}/api/posts/${post._id}`); } catch(err){ console.log(err); }
    if (onDelete) onDelete(post._id);
  };

  const blockUser = async () => {
    try {
      await axios.post(`${API}/api/users/block`, { username: currentUser.name, blockTarget: post.author });
      setBlocked(true);
      setBlockedUsers(prev => [...prev, post.author]);
      setShowMenu(false);
    } catch(err){ console.log(err); }
  };

  const sharePost = () => {
    if (reposted) return;
    setReposted(true);
    navigator.clipboard?.writeText(window.location.origin + "/dashboard").catch(() => {});
  };

  const renderText = (text) =>
    String(text || "").split(" ").map((word, i) =>
      word.startsWith("#") ? (
        <span key={i} className="hashtag" onClick={() => navigate(`/tag/${word.substring(1)}`)}>
          {word}{" "}
        </span>
      ) : word + " "
    );

  if (blocked) return null;

  return (
    <div className="post">
      <div className="postHeader">
        <div className="avatar" style={isAnonymous ? {background:"#94a3b8"} : {}}>
          {isAnonymous ? "?" : (post.author || "?").charAt(0)}
        </div>
        <div className="postUser">
          <span className="username">{isAnonymous ? "Anonymous" : post.author}</span>
          {!isAnonymous && <span className={`badge ${post.role || "student"}`}>{post.role || "student"}</span>}
          {isAnonymous && <span className="anonBadge">🕵️ Anonymous</span>}
        </div>
        <div className="postMenuWrap">
          {isOwner && (
            <button className="deleteBtn" onClick={deletePost} title="Delete post"><FaTrash/></button>
          )}
          {!isOwner && (
            <div style={{position:"relative"}}>
              <button className="postMenuBtn" onClick={() => setShowMenu(!showMenu)}><FaEllipsisH/></button>
              {showMenu && (
                <div className="postMenu">
                  <button className="postMenuItem" onClick={() => { setShowReport(true); setShowMenu(false); }}>
                    <FaFlag style={{fontSize:12}}/> Report post
                  </button>
                  {canBlock && (
                    <button className="postMenuItem postMenuItem--danger" onClick={blockUser}>
                      <FaBan style={{fontSize:12}}/> Block {post.author}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {post.text && <p className="postText">{renderText(post.text)}</p>}

      {post.mediaUrl && post.mediaType === "image" && <img className="postMedia" src={`${API}${post.mediaUrl}`} alt="post"/>}
      {post.mediaUrl && post.mediaType === "video" && <video className="postMedia" src={`${API}${post.mediaUrl}`} controls/>}
      {post.mediaUrl && post.mediaType === "audio" && <audio className="postAudio" src={`${API}${post.mediaUrl}`} controls/>}

      <div className="postActions">
        <span onClick={() => setShowComments(!showComments)}>💬 Comment</span>
        <span onClick={sharePost} style={{color: reposted ? "var(--primary)" : ""}}>
          <FaShareAlt style={{marginRight:4}}/>{reposted ? "Shared!" : "Share"}
        </span>
        <span onClick={likePost} style={{color: liked ? "#e53935" : ""}}>
          {liked ? "❤️" : "🤍"} {likes}
        </span>
      </div>

      {showComments && (
        <div className="commentSection">
          <CommentList postId={post._id}/>
          <CommentBox postId={post._id}/>
        </div>
      )}

      {showReport && (
        <ReportModal
          type="post"
          targetId={post._id}
          targetName={post.text?.substring(0,40)}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}

export default Post;
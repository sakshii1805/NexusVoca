import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaShareAlt } from "react-icons/fa";

import CommentBox from "./CommentBox";
import CommentList from "./CommentList";

function Post({ post, onDelete }) {

  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isOwner = currentUser && currentUser.name === post.author;

  const likePost = async () => {
    try {
      await axios.post(`http://localhost:5000/api/posts/like/${post._id}`);
    } catch(err) {
      console.log(err);
    }
    setLikes(prev => prev + 1);
    setLiked(true);
  };

  const deletePost = async () => {
    if(!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${post._id}`);
      if(onDelete) onDelete(post._id);
    } catch(err) {
      console.log(err);
      // still remove from UI
      if(onDelete) onDelete(post._id);
    }
  };

  const sharePost = () => {
    if(reposted) return;
    setReposted(true);
    alert(`Post shared! "` + post.text.substring(0, 50) + `..."`);
  };

  const authorName = post.author || "Unknown";

  return (
    <div className="post">

      <div className="postHeader">
        <div className="avatar">{authorName.charAt(0)}</div>
        <div className="postUser">
          <span className="username">{authorName}</span>
          <span className={`badge ${post.role || "student"}`}>
            {post.role || "student"}
          </span>
        </div>

        {/* Delete button - only for post owner */}
        {isOwner && (
          <button className="deleteBtn" onClick={deletePost} title="Delete post">
            <FaTrash />
          </button>
        )}
      </div>

      <p className="postText">
        {post.text.split(" ").map((word, index) => {
          if(word.startsWith("#")){
            return(
              <span
                key={index}
                className="hashtag"
                onClick={() => navigate(`/tag/${word.substring(1)}`)}
              >
                {word}{" "}
              </span>
            );
          }
          return word + " ";
        })}
      </p>

      <div className="postActions">
        <span onClick={() => setShowComments(!showComments)}>💬 Comment</span>

        <span
          onClick={sharePost}
          style={{ color: reposted ? "var(--primary)" : "" }}
          title={reposted ? "Shared!" : "Share post"}
        >
          <FaShareAlt style={{ marginRight: 4 }} />
          {reposted ? "Shared" : "Share"}
        </span>

        <span onClick={likePost} style={{ color: liked ? "#e53935" : "" }}>
          {liked ? "❤️" : "🤍"} {likes}
        </span>
      </div>

      {showComments && (
        <div className="commentSection">
          <CommentList postId={post._id} />
          <CommentBox postId={post._id} />
        </div>
      )}

    </div>
  );
}

export default Post;
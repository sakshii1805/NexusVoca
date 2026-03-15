import { useEffect, useState } from "react";
import axios from "axios";

import PostComposer from "./PostComposer";
import Post from "./Post";

const exampleAnnouncement = {
  _id: "000000000000000000000001",
  author: "Admin",
  role: "admin",
  text: "📢 Mid semester exams will start from March 25. Please check the timetable.",
  likes: 0
};

function Feed() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/posts")
      .then(res => setPosts([exampleAnnouncement, ...res.data]))
      .catch(err => console.log("Error loading posts:", err));
  }, []);

  const handleDelete = (deletedId) => {
    setPosts(prev => prev.filter(p => p._id !== deletedId));
  };

  return (
    <div className="feed">

      <h2>Campus Feed</h2>

      <PostComposer setPosts={setPosts} />

      {posts.length === 0 && (
        <p style={{ padding: "20px", color: "gray" }}>No posts yet. Be the first to post!</p>
      )}

      {posts.map(p => (
        <Post key={p._id} post={p} onDelete={handleDelete} />
      ))}

    </div>
  );
}

export default Feed;
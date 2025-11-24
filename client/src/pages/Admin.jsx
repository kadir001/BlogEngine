import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Admin() {
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    const res = await api.get("/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const deletePost = async (id) => {
    await api.delete(`/posts/${id}`);
    loadPosts();
  };

  return (
    <div className="container mt-5">
      <h2>Admin Panel</h2>
      {posts.map((post) => (
        <div key={post.id} className="card mb-3 p-3">
          <h5>{post.title}</h5>
          <p>{post.content}</p>
          <small>By {post.author}</small>
          <br />
          <button className="btn btn-danger btn-sm mt-2" onClick={() => deletePost(post.id)}>
            Delete Post
          </button>
        </div>
      ))}
    </div>
  );
}

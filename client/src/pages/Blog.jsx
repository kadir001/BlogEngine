import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentText, setCommentText] = useState("");

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  // Load posts from backend
  const loadPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts", err);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!title || !content) return;
    try {
      await api.post("/posts", { title, content });
      setTitle("");
      setContent("");
      loadPosts();
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      loadPosts();
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  const handleEdit = async (post) => {
    const newTitle = prompt("Edit title", post.title);
    const newContent = prompt("Edit content", post.content);
    if (!newTitle || !newContent) return;
    try {
      await api.put(`/posts/${post.id}`, { title: newTitle, content: newContent });
      loadPosts();
    } catch (err) {
      console.error("Failed to edit post", err);
    }
  };

  const handleLike = async (id) => {
    try {
      await api.post(`/likes/${id}`);
      loadPosts();
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText) return;
    try {
      await api.post(`/comments/${postId}`, { content: commentText });
      setCommentText("");
      loadPosts();
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const formatDate = (datetime) => {
    if (!datetime) return "";
    const d = new Date(datetime.replace(" ", "T"));
    return d.toLocaleString("nl-NL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mt-4">
      <h2>Blog Posts</h2>

      {/* New Post */}
      <div className="card mb-4 p-3">
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleCreatePost}>
          Create Post
        </button>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} className="card mb-3 p-3">
          <h5>{post.title}</h5>
          <p>{post.content}</p>
          <small>
            By {post.author} | {formatDate(post.created_at)}
          </small>

          <div className="mt-2">
            <button className="btn btn-outline-success btn-sm me-2" onClick={() => handleLike(post.id)}>
              👍 Like ({post.likes ?? 0})
            </button>

            {/* Edit: alleen admin of auteur */}
            {(role === "admin" || post.author_id == userId) && (
              <button className="btn btn-outline-warning btn-sm me-2" onClick={() => handleEdit(post)}>
                Edit
              </button>
            )}

            {/* Delete: alleen admin of auteur */}
            {(role === "admin" || post.author_id == userId) && (
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(post.id)}>
                Delete
              </button>
            )}
          </div>

          {/* Comments */}
          <div className="mt-3">
            <h6>Comments:</h6>
            {post.comments?.map((c) => (
              <div key={c.id} className="ms-3 mb-1">
                <small>
                  <strong>{c.author}</strong>: {c.content} | {formatDate(c.created_at)}
                </small>
              </div>
            ))}

            <div className="mt-2 d-flex">
              <input
                className="form-control me-2"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className="btn btn-primary btn-sm" onClick={() => handleComment(post.id)}>
                Comment
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

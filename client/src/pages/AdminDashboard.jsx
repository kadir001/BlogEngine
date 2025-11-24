// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";

export default function AdminDashboard({ auth }) {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  const fetchUsers = () => {
    fetch("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${auth.user.token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  const fetchPosts = () => {
    fetch("http://localhost:5000/api/blog")
      .then(res => res.json())
      .then(data => setPosts(data));
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  const deleteUser = (id) => {
    fetch("http://localhost:5000/api/users/" + id, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.user.token}` }
    }).then(() => fetchUsers());
  };

  const deletePost = (id) => {
    fetch("http://localhost:5000/api/blog/" + id, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.user.token}` }
    }).then(() => fetchPosts());
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <Card className="p-4 mb-4">
        <h4>Users</h4>
        {users.map(u => (
          <Card key={u.id} className="p-3 mb-2">
            {u.username} — {u.role}
            <Button 
              className="ms-3" 
              size="sm" 
              variant="danger"
              onClick={() => deleteUser(u.id)}
            >
              Delete
            </Button>
          </Card>
        ))}
      </Card>

      <Card className="p-4">
        <h4>Blog Posts</h4>
        {posts.map(p => (
          <Card key={p.id} className="p-3 mb-2">
            <b>{p.author}</b>: {p.content}
            <Button 
              className="ms-3" 
              size="sm" 
              variant="danger"
              onClick={() => deletePost(p.id)}
            >
              Delete
            </Button>
          </Card>
        ))}
      </Card>
    </div>
  );
}

// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";

export default function Home({ auth }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/blog")
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const addPost = async () => {
    const res = await fetch("http://localhost:5000/api/blog", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.user?.token}`
      },
      body: JSON.stringify({ author, content }),
    });

    const post = await res.json();
    setPosts([post, ...posts]);
  };

  return (
    <div>
      <Card className="p-4 mb-4">
        <h3>Blog</h3>

        {auth.user && (
          <>
            <Form.Group className="mb-3">
              <Form.Control placeholder="Name" onChange={e => setAuthor(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control 
                as="textarea" 
                placeholder="Write something..." 
                onChange={e => setContent(e.target.value)} 
              />
            </Form.Group>

            <Button onClick={addPost}>Post</Button>
          </>
        )}
      </Card>

      {posts.map(post => (
        <Card key={post.id} className="p-3 mb-3">
          <h5>{post.author}</h5>
          <p>{post.content}</p>
          <small>{post.created_at}</small>
        </Card>
      ))}
    </div>
  );
}

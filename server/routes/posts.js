import express from "express";
import auth from "../middleware/auth.js";
import { openDb } from "../db.js";

const router = express.Router();

// GET /posts
router.get("/", async (req, res) => {
  try {
    const db = await openDb();
    const posts = await db.all(`
      SELECT p.id, p.title, p.content, p.created_at, u.username AS author, u.id AS author_id,
      IFNULL(l.likes_count, 0) AS likes
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS likes_count
        FROM likes
        GROUP BY post_id
      ) l ON p.id = l.post_id
      ORDER BY p.created_at DESC
    `);

    for (let post of posts) {
      const comments = await db.all(`
        SELECT c.id, c.content, c.created_at, u.username AS author
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC
      `, [post.id]);
      post.comments = comments;
    }

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// POST /posts
router.post("/", auth, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const db = await openDb();
    const result = await db.run(
      "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
      [title, content, userId]
    );
    const post = await db.get(
      "SELECT p.id, p.title, p.content, p.created_at, u.username AS author, u.id AS author_id FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?",
      [result.lastID]
    );
    post.comments = [];
    post.likes = 0;
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// PUT /posts/:id
router.put("/:id", auth, async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const db = await openDb();
    const post = await db.get("SELECT * FROM posts WHERE id = ?", [id]);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (role !== "admin" && post.user_id !== userId)
      return res.status(403).json({ message: "Not authorized" });

    await db.run("UPDATE posts SET title = ?, content = ? WHERE id = ?", [title, content, id]);
    res.json({ message: "Post updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to edit post" });
  }
});

// DELETE /posts/:id
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const db = await openDb();
    const post = await db.get("SELECT * FROM posts WHERE id = ?", [id]);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (role !== "admin" && post.user_id !== userId)
      return res.status(403).json({ message: "Not authorized" });

    await db.run("DELETE FROM posts WHERE id = ?", [id]);
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

// POST /likes/:id
router.post("/likes/:id", auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const db = await openDb();
    const existing = await db.get("SELECT * FROM likes WHERE post_id = ? AND user_id = ?", [id, userId]);
    if (existing) return res.status(400).json({ message: "Already liked" });

    await db.run("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", [id, userId]);
    res.json({ message: "Post liked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to like post" });
  }
});

// POST /comments/:id
router.post("/comments/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const db = await openDb();
    await db.run("INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)", [id, userId, content]);
    res.json({ message: "Comment added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

export default router;

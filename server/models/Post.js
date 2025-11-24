import { openDb } from "../db/database.js";

export async function createPost(title, content, authorId) {
  const db = await openDb();
  return db.run(
    "INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)",
    [title, content, authorId]
  );
}

export async function getPosts() {
  const db = await openDb();
  return db.all("SELECT posts.*, users.username as author FROM posts JOIN users ON posts.author_id = users.id");
}

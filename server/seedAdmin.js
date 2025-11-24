import { openDb } from "./db.js";
import bcrypt from "bcrypt";

async function setupAndSeed() {
  const db = await openDb();

  // --- Tabellen aanmaken ---
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user'
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      content TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER,
      user_id INTEGER,
      content TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(post_id) REFERENCES posts(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER,
      user_id INTEGER,
      UNIQUE(post_id, user_id),
      FOREIGN KEY(post_id) REFERENCES posts(id)
    )
  `);

  // --- Admin user ---
  const adminHash = await bcrypt.hash("admin123", 10);
  await db.run(
    "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
    ["admin", adminHash, "admin"]
  );

  // --- Voorbeeld gebruikers ---
  const user1Hash = await bcrypt.hash("user123", 10);
  const user2Hash = await bcrypt.hash("user456", 10);

  await db.run(
    "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
    ["user1", user1Hash, "user"]
  );
  await db.run(
    "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
    ["user2", user2Hash, "user"]
  );

  // --- Voorbeeld posts ---
  const admin = await db.get("SELECT id FROM users WHERE username = ?", ["admin"]);
  const user1 = await db.get("SELECT id FROM users WHERE username = ?", ["user1"]);
  const user2 = await db.get("SELECT id FROM users WHERE username = ?", ["user2"]);

  const post1 = await db.run(
    "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
    ["Welkom op de blog!", "Dit is de eerste post van admin.", admin.id]
  );
  const post2 = await db.run(
    "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
    ["Hallo wereld", "Dit is een post van user1.", user1.id]
  );
  const post3 = await db.run(
    "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
    ["React leren", "User2 deelt tips over React.", user2.id]
  );

  // --- Voorbeeld comments ---
  await db.run(
    "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
    [post1.lastID, user1.id, "Leuke post!"]
  );
  await db.run(
    "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
    [post2.lastID, admin.id, "Welkom user1!"]
  );

  // --- Voorbeeld likes ---
  await db.run(
    "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
    [post1.lastID, user2.id]
  );
  await db.run(
    "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
    [post2.lastID, user2.id]
  );
  await db.run(
    "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
    [post3.lastID, admin.id]
  );

  console.log("Database setup complete! Admin, users, posts, comments en likes zijn aangemaakt.");
  console.log("Admin login: username=admin, password=admin123");
  console.log("Users: user1/user123, user2/user456");

  process.exit(0);
}

setupAndSeed();

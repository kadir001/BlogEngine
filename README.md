# A Blog Application

A full-stack blog platform built with:

- **React (Vite)**
- **Express.js**
- **SQLite**
- **JWT Authentication**
- **User & Admin roles**
- **Posts, comments, likes**
- **Bootstrap responsive design**

---

## 🚀 Features

### 🔐 Authentication
- User registration & login  
- JSON Web Tokens (JWT)  
- Role-based access:
  - **Admin**: edit/delete all posts  
  - **Users**: manage their own posts  

### 📝 Blog System
- Create posts  
- Edit posts (role-dependent)  
- Delete posts (role-dependent)
- Add comments  
- Like posts  
- Timestamps for posts & comments  

### 💾 Backend
- Express.js REST API  
- SQLite database file  
- Automatic table creation  
- Includes admin seeding script  (node seedAdmin.js!)

### 🎨 Frontend
- React (Vite)
- Axios API layer
- Bootstrap 5 UI
- Protected routes

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/kadir001/BlogEngine.git
cd <your-repo>

⚙️ Backend Setup

Go into the server folder:

cd server
npm install

#1. Seed database + admin user
node seed.js


#This will:

Create required tables

Create default admin account:

username: admin

password: admin123

2. Start backend server
node server.js


#Backend runs on:

http://localhost:5000

💻 Frontend Setup

#Go into the client folder:

cd client
npm install
npm run dev


#Frontend runs on:

http://localhost:5173

🔑 Default Admin Account
Username	Password	Role
admin	admin123	Admin
📁 Project Structure
/
├── client/        # React frontend
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── server/        # Express backend
│   ├── routes/
│   ├── middleware/
│   ├── db.js
│   ├── seedAdmin.js
│   └── server.js
│
└── README.md

📝 Notes

- SQLite file (database.sqlite) is automatically generated in /server.

- Remember to adjust API base URL in client/src/api/axios.js if deploying.

❤️ Contributing

Feel free to fork the project and create pull requests.

📜 License

This project is open-source and free to use.

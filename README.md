<div align="center">

# 🌐 Social Media Engine — Feed, Media & Friendship Subsystem
### *Assignment 16 — Advanced Social Graph, Cloud Multer Storage & In-Memory Redis Caching*

[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Express 5](https://img.shields.io/badge/Framework-Express%205-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![Redis](https://img.shields.io/badge/Cache-Redis%20ioredis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Multer](https://img.shields.io/badge/Media-Multer%20Engine-orange?style=flat-square)](#media-processing)
[![MongoDB](https://img.shields.io/badge/Database-Mongoose%209-13aa52?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

<p align="center">
Extending the core platform into a complete social network featuring multi-file image uploads, interactive post feeds, nested comments, bidirectional friend request lifecycles, user blocking mechanics, and high-throughput Redis caching.
</p>

---

</div>

## 🌟 Feature Highlights

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Assignment 16 Ecosystem                         │
├───────────────────┬───────────────────┬────────────────────────────────┤
│   📸 Media & Feed │   👥 Social Graph │   ⚡ Performance & Security    │
│   • 20 Attachments│   • Friend Request│   • Redis Fast Key-Value Cache │
│   • Like/Unlike   │   • Accept/Reject │   • Role-Based Authorization   │
│   • Nested Comment│   • Block/Unblock │   • Zod Schema Guardrails      │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### 1. 🖼️ Post & Media Pipeline
- **Multi-File Uploads**: Native Multer integration accepting up to 20 image attachments per publication.
- **Feed Interaction**: Real-time toggle like/unlike mechanism preventing duplicate reactions.
- **Deep Commenting**: Discussion threads on posts with full edit and delete lifecycle protections.

### 2. 🤝 Friendship & Social Graph
- **Request Workflows**: Asynchronous friend request initiation, listing pending invitations, and mutual friend acceptance.
- **Safety & Moderation**: Instant user block and unblock functionality enforcing boundaries across post visibility and messaging.

### 3. 🚀 High-Speed Redis Integration
- Employs `ioredis` to manage session invalidations, fast-access key lookups, and distributed cache invalidation strategies to minimize database pressure.

---

## 📋 Comprehensive API Route Reference

### 📰 Posts & Comments (`/api/v1/post`)

| Method | Route | Description | Attachments |
| :--- | :--- | :--- | :---: |
| `POST` | `/` | Create a new post with text & imagery | Up to 20 images (`attachments`) |
| `GET` | `/` | Retrieve paginated public posts feed | — |
| `GET` | `/:postId` | Get detailed post content and comments | — |
| `PATCH` | `/:postId/update` | Modify post copy or replace attachments | Supported |
| `DELETE`| `/:postId/delete` | Soft/hard delete post (Author only) | — |
| `PATCH` | `/:postId/like` | Toggle like or unlike on target post | — |
| `POST` | `/:postId/comment`| Post a new comment on a specific post | — |
| `PATCH` | `/comment/:commentId` | Edit existing comment | — |
| `DELETE`| `/comment/:commentId` | Remove existing comment | — |

### 👥 User & Friendship System (`/api/v1/user`)

| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/friend-request/:userId` | Send connection invitation to target user |
| `GET` | `/friend-request` | List all incoming connection requests |
| `PATCH` | `/friend-request/:requestId/accept` | Accept pending friend request |
| `DELETE`| `/friend-request/:requestId/reject` | Decline incoming friend request |
| `DELETE`| `/friend/:userId` | Remove user from friends roster |
| `PATCH` | `/block/:userId` | Block user (revokes connections & access) |
| `PATCH` | `/unblock/:userId` | Unblock user to restore profile interactions |

---

## 📂 Project Structure

```bash
Assignment-16/
├── src/
│   ├── config/              # Environment resolution & typed configs
│   ├── DB/                  # Mongoose schemas & Redis client instances
│   │   ├── Models/          # User, Post, Comment, and FriendRequest models
│   │   ├── connection.ts    # MongoDB connection pool
│   │   └── redis.service.ts # Redis cache get/set/del abstraction
│   ├── Middlewares/         # Auth, Role authorization, & Zod validation
│   ├── Modules/
│   │   ├── Auth/            # Authentication & tokens
│   │   ├── Post/            # Post publishing, like, and comment services
│   │   └── User/            # Friendship, blocklist, and profile controllers
│   ├── Utils/               # Multer filters, crypto, mailers, & responses
│   ├── app.controller.ts    # Application bootstrap & middleware pipeline
│   └── index.ts             # Process entry point
└── uploads/                 # Local media storage directory
```

---

## ⚙️ Setup & Execution

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally or on Atlas
- Redis server active (`redis-server`)

### 2. Configure Environment
Create `config/dev.env`:
```env
PORT=3000
APPLICATION_NAME=SocialMediaAppV2
DB_URI=mongodb://127.0.0.1:27017/social_media_v2
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_SECRET=super_secret_jwt_key
ENCRYPTION_KEY=32_character_aes_secret_key
SALT_ROUNDS=10
```

### 3. Launch Development Server
```bash
npm install
npm run dev
```

---

<div align="center">

### 👨‍💻 Created & Maintained By

<br/>

**Jason Hany**  
*Backend Systems & Software Engineer*

[![Portfolio](https://img.shields.io/badge/Status-Active%20Development-success?style=for-the-badge)](#)

<sub>Designed with modular enterprise patterns, high-concurrency storage, and robust security protocols.</sub>

</div>

# 🏬 Store‑Rating Web App

[Live Demo](https://storerating.netlify.app)

A full‑stack **React + Firebase** application that lets users rate stores while admins manage users, stores, and ratings from a dedicated dashboard.


## ✨ Features
| Role | Capabilities |
|------|--------------|
| **System Administrator** | • Create / edit / delete users (Admin, Store‑Owner, Normal) <br>• Add stores while assigning a Store‑Owner <br>• Dashboard cards: total users, stores, ratings <br>• Filter and sort on name/email/address/role <br>• Secure, role‑based routes |
| **Store Owner** | • Personal dashboard with average rating, latest reviews <br>• Read‑only list of users who rated their store |
| **Normal User** | • Public registration & login (Firebase Auth) <br>• Browse stores, leave/update ratings |

---

## 🛠 Tech Stack
- **React 18 + TypeScript**
- **Tailwind CSS** for UI
- **Firebase**
  - Authentication
  - Cloud Firestore
  - (optional) Cloud Functions for admin‑only user creation
- **React‑Hook‑Form + Zod** validation
- **Lucide‑React** icons
- **Vite** build tool

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/Hrishikeshkukade/Store-Rating.git
cd Store-Rating

# 2. Install
npm install  # or pnpm i

# 3. Dev server
npm run dev



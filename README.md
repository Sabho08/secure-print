# 🛡️ SecurePrint: Zero-Footprint Air-Printing Platform

Welcome to the SecurePrint repository. This project consists of three integrated components designed for a seamless, memory-only file printing experience.

---

## 🏗️ Project Architecture

1.  **🏢 Shopkeeper App (Flutter)**: A desktop/mobile dashboard for shopkeepers to manage their printing queue and receive live file streams. Located in the root (`test_out`).
2.  **📱 Customer App (React/Vite)**: A modern, WeTransfer-style web app for customers to connect to a terminal and stream files. Located in `/New folder`.
3.  **🚀 Relay Server (Node.js)**: A high-performance Socket.io bridge that pipes file bytes directly between apps without persistent storage. Located in `/relay-server`.

---

## 🚀 How to Run (Development)

### 1. Start the Relay Server (Backend)
```bash
cd relay-server
npm install
node server.js
```
*Port will be active on http://localhost:3000*

### 2. Start the Customer App (Frontend)
```bash
cd "New folder"
npm install
npm run dev
```

### 3. Start the Shopkeeper App (Flutter)
```bash
# In the root (c:\Users\SAHIL\test_out)
flutter pub get
flutter run -d windows
```

---

## 🌩️ Supabase Setup (Database & Auth)
This project uses **Supabase** for user profiles and print metadata. 
1.  Initialize your Supabase project.
2.  Run the SQL schema provided in [supabase_setup_guide.md](file:///C:/Users/SAHIL/.gemini/antigravity/brain/538f74d5-c78f-42f8-ae29-b176e6e16a8b/supabase_setup_guide.md).
3.  Update the `kSupabaseUrl` and `kSupabaseAnonKey` in:
    *   Flutter: `lib/shared.dart`
    *   React: `src/utils/supabase.ts`

---

## 🛠️ Security Architecture
*   **Zero-Footprint**: File bytes stay in the memory of the apps and relay server. They are **never** written to a hard disk except for a temporary cache on the printer device which is wiped after the print success.
*   **Encrypted Streaming**: Data is pushed via secure WebSocket tunnels.
*   **Auth Protected**: Only registered and logged-in users can initiate a print job.

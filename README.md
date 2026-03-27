# 🛡️ SecurePrint: Zero-Footprint Air-Printing Platform

Welcome to the SecurePrint repository. This project consists of three integrated components designed for a seamless, memory-only file printing experience.

---

## 🏗️ Project Architecture

1.  **🏢 Shopkeeper App (Flutter)**: A desktop/mobile dashboard for shopkeepers to manage their printing queue and receive live file streams. Located in the **root** of this repo.
2.  **📱 Customer App (React/Vite)**: A modern web app for customers to connect to a terminal and stream files. Located in `/web_app`.
3.  **🚀 Relay Server (Node.js)**: A high-performance Socket.io bridge that pipes file bytes directly between apps without persistent storage. Located in `/relay-server`.

---

## ⚙️ Prerequisites

- **Flutter SDK** ≥ 3.11.x → [Install Flutter](https://docs.flutter.dev/get-started/install)
- **Node.js** ≥ 18.x → [Install Node.js](https://nodejs.org/)
- **Dart** ≥ 3.11.x (comes with Flutter)

---

## 🚀 How to Run (Development)

### 1. Start the Relay Server (Backend)
```bash
cd relay-server
npm install
node server.js
```
*Server runs on http://localhost:3000*

---

### 2. Start the Customer App (Frontend)
```bash
cd web_app
npm install
npm run dev
```
*Vite dev server runs on http://localhost:5173*

---

### 3. Start the Shopkeeper App (Flutter)
```bash
# From the root of the repo
flutter pub get
flutter run -d windows   # or -d chrome, -d android, -d <deviceId>
```

> **Tip:** Run `flutter devices` to see all available devices.

---

## 🌩️ Supabase Setup (Database & Auth)
This project uses **Supabase** for user auth and print metadata.

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your `URL` and `anon key`
3. Update credentials in:
   - **Flutter** → `lib/shared.dart` (`kSupabaseUrl`, `kSupabaseAnonKey`)
   - **React** → `web_app/src/utils/supabase.ts`

---

## 🛠️ Security Architecture
- **Zero-Footprint**: File bytes are streamed through memory only — **never** written to any disk on the relay server.
- **Encrypted Streaming**: Data is pushed via secure WebSocket tunnels.
- **Auth Protected**: Only registered, logged-in shopkeepers can access the dashboard.

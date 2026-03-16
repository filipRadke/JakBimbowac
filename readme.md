# 🚀 Running the App (Docker)

This project consists of:
- **Backend**: Express + TypeScript
- **Frontend**: React + Vite
- **Dockerized** using Docker Compose

There are **two modes**:
- **Development mode** (hot reload)
- **Production mode** (optimized build)

---

## 🧰 Prerequisites

Dev mode:
- **Docker** ≥ 20.x
- **Docker Compose** ≥ v2

Verify:
```bash
docker --version
docker compose version
```

---

## 🏭 Production Mode
```bash
docker compose up --build
```

## 🔥 Development Mode (Hot Reload)
```bash
docker compose -f docker-compose.dev.yml up --build
```

---

## ⛔ Stop containers
```bash
docker compose down
```

## 🧹 Cleanup (optional)
Remove containers, images, and volumes
```bash
docker compose down --rmi all --volumes
```

---

# 🌐 Access the app

| Service         | URL                   |
|-----------------|-----------------------|
| Frontend (Vite) | http://localhost:5173 |
| Backend API     | http://localhost:3000 |
| Database Web UI | http://localhost:7474 |


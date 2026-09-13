# CivicFix — Smart Public Issue Reporting & Resolution Platform



## Structure
```
civicfix/
├── frontend/     React + Vite + Tailwind + Clerk
├── backend/      Express + Mongoose + Clerk backend + Cloudinary
├── ai-service/   FastAPI mock AI (replaceable by YOLO)
```

## Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)
- Clerk account (publishable + secret key)
- Cloudinary account

## Setup & Run

### 1. AI Service
```bash
cd ai-service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Backend
```bash
cd backend
cp ../.env.example .env    # then fill in real values
npm install
npm run seed                # seeds departments + demo complaints
npm run dev                 # runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
cp ../.env.example .env    # keep only VITE_ vars, fill in Clerk key
npm install
npm run dev                 # runs on http://localhost:5173
```

### Promote a demo user to Admin
1. Sign up in the app once via Clerk.
2. Copy your Clerk User ID (Clerk dashboard → Users).
3. Set `ADMIN_CLERK_USER_ID=<that id>` in `backend/.env`.
4. Restart the backend — it auto-promotes that user to `admin` on boot.

### Docker (optional)
```bash
docker-compose up --build
```

## Environment Variables

**frontend/.env**
```
VITE_CLERK_PUBLISHABLE_KEY=
VITE_API_URL=
```

**backend/.env**
```
PORT=5000
MONGODB_URI=
CLERK_SECRET_KEY=
AI_SERVICE_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
DEMO_CLERK_USER_ID=
ADMIN_CLERK_USER_ID=
```

## Notes
- The AI service uses a lightweight OpenCV heuristic as a stand-in for a trained YOLO model — swap `ai-service/services/mock_detector.py` for real inference later; the `/predict` contract stays the same.
- Roles are never trusted from the frontend — the backend looks up the authenticated Clerk user's role in MongoDB on every protected request.

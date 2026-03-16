# 🏥 MediChain AI

**Blockchain-Based Secure Medical Record System with AI Disease Prediction**

## 📁 Project Structure

```
medichain/
├── package.json              # Dependencies & scripts
├── .env.example              # Environment variables template
├── README.md
│
├── server/                   # Node.js / Express Backend
│   ├── index.js              # Entry point — starts server on port 3000
│   ├── models/
│   │   ├── Block.js          # Block class (SHA-256 hashing, mining)
│   │   ├── Blockchain.js     # Chain singleton (validation, add/get blocks)
│   │   └── Patient.js        # In-memory patient store (swap for DB)
│   ├── routes/
│   │   ├── patients.js       # GET/POST/PUT/DELETE /api/patients
│   │   ├── blockchain.js     # GET/POST /api/blockchain
│   │   ├── ai.js             # POST /api/ai/predict (Claude API)
│   │   └── records.js        # GET /api/records/stats|patient/:id
│   ├── middleware/
│   │   ├── errorHandler.js   # Global error handler
│   │   └── logger.js         # Request logger
│   └── utils/
│       └── hashHelper.js     # SHA-256 utility functions
│
└── client/                   # Frontend (served as static files)
    ├── index.html            # SPA shell — loads all JS/CSS
    ├── styles/
    │   ├── main.css          # Variables, nav, layout, typography
    │   └── components.css    # Cards, panels, tables, charts
    └── js/
        ├── api.js            # API client (all fetch calls)
        ├── patients.js       # Patients page render + logic
        ├── blockchain.js     # Blockchain page render + logic
        ├── ai.js             # AI prediction page + Claude calls
        └── app.js            # Router, dashboard, init
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 3. Start server
npm start          # production
npm run dev        # development (auto-restart)

# 4. Open browser
open http://localhost:3000
```

## 🔌 API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/patients               | List all patients        |
| GET    | /api/patients/:id           | Get single patient       |
| POST   | /api/patients               | Create new patient       |
| PUT    | /api/patients/:id           | Update patient           |
| DELETE | /api/patients/:id           | Delete patient           |
| GET    | /api/blockchain             | Full chain               |
| GET    | /api/blockchain/stats       | Chain metadata           |
| GET    | /api/blockchain/validate    | Integrity check          |
| POST   | /api/blockchain/mine        | Add new block            |
| POST   | /api/ai/predict             | AI disease prediction    |
| GET    | /api/records/stats          | Dashboard stats          |
| GET    | /api/records/patient/:id    | Records for a patient    |

## 🛠 Tech Stack

- **Backend**: Node.js + Express
- **Blockchain**: Custom SHA-256 proof-of-work
- **AI**: Anthropic Claude API (claude-sonnet-4)
- **Frontend**: Vanilla JS (modular) + CSS custom properties
- **Security**: Helmet, CORS, rate limiting

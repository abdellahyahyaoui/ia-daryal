# Daryal - AI Vehicle Diagnostic Platform

## Overview
Daryal is an AI-powered vehicle diagnostic application that helps users diagnose car, motorcycle, scooter, and electric vehicle issues. The app uses OpenAI's API to provide intelligent diagnostics based on user input.

## Project Architecture

### Frontend (daryal/)
- **Framework**: React 18 with Create React App
- **Styling**: SCSS, TailwindCSS
- **3D Graphics**: Three.js with @react-three/fiber and @react-three/drei
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Backend (backend/)
- **Framework**: Flask with Flask-CORS
- **AI Integration**: OpenAI API
- **Environment**: Python 3.11

## Project Structure
```
├── daryal/              # React frontend
│   ├── public/          # Static assets (3D models, images)
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   └── App.jsx      # Main app
│   └── package.json
├── backend/             # Flask backend
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── app.py           # Flask application
│   └── config.py        # Configuration
└── replit.md
```

## Running the Application

### Frontend
The React app runs on port 5000:
```bash
cd daryal && npm start
```

### Backend
The Flask API runs on port 8000 (localhost):
```bash
cd backend && python app.py
```

## Environment Variables
- `OPENAI_API_KEY`: Required for AI diagnostics (set in Secrets)

## Recent Changes
- 2024-12-27: Initial Replit setup
  - Configured React frontend to run on port 5000 with host 0.0.0.0
  - Configured backend to run on port 8000 on localhost
  - Updated CORS settings for Replit environment
  - Made OpenAI API key optional for startup

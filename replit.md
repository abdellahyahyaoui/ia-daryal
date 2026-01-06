# Daryal - AI Vehicle Diagnostic Assistant

## Overview
Daryal is an AI-powered vehicle diagnostic assistant application built with React. It provides intelligent diagnostics for various vehicle types including cars, motorcycles, electric vehicles, and scooters.

## Project Structure
```
├── daryal/                  # React frontend application
│   ├── public/              # Static assets and GLB 3D models
│   ├── src/
│   │   ├── api/             # API client for backend communication
│   │   ├── components/      # React components
│   │   │   ├── car-model/   # 3D car model component
│   │   │   ├── chat/        # Chat interface components
│   │   │   ├── CodeInterpreterForm/ # OBD code interpreter
│   │   │   ├── ElectricCarForm/     # Electric car diagnostics
│   │   │   ├── ElectricMotorcycleForm/ # Electric motorcycle
│   │   │   ├── ElectricScooterForm/ # Electric scooter
│   │   │   ├── MotorcycleForm/      # Motorcycle diagnostics
│   │   │   ├── OrbeaForm/           # Orbea bicycle diagnostics
│   │   │   ├── robot/       # 3D robot mascot (WebGL)
│   │   │   └── ...          # Other UI components
│   │   └── utils/           # Utility functions
│   └── package.json
├── backend/                 # Flask backend (uses external Render hosting)
│   ├── routes/              # API routes
│   ├── utils/               # Backend utilities
│   ├── app.py               # Flask application entry
│   └── requirements.txt     # Python dependencies
└── package.json
```

## Tech Stack
- **Frontend**: React 18, React Router, Three.js (@react-three/fiber, @react-three/drei)
- **Styling**: SCSS, Tailwind CSS
- **3D Graphics**: WebGL via Three.js for robot mascot
- **Backend API**: External Flask API hosted on Render (ia-daryal-3.onrender.com)
- **Mobile**: Capacitor for Android builds

## Running the Application

### Development
The frontend runs on port 5000 with the command:
```bash
cd daryal && npm start
```

### Environment
- Frontend binds to `0.0.0.0:5000`
- Host check is disabled for Replit proxy compatibility
- Backend API calls go to external Render service

## Features
- AI-powered vehicle diagnostics
- Support for multiple vehicle types (cars, motorcycles, e-bikes, scooters)
- OBD-II code interpretation
- Interactive 3D robot mascot
- Spanish language interface

## Deployment
- **Type**: Static site deployment
- **Build command**: `cd daryal && npm run build`
- **Output directory**: `daryal/build`

## Recent Changes
- 2026-01-06: Initial Replit setup
  - Configured frontend workflow for port 5000
  - Added WebGL error handling for environments without GPU
  - Created stub components for Lamp and Fondo
  - Simplified API configuration to use external Render backend

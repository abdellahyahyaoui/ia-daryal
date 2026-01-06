# Daryal - Vehicle Diagnosis App

## Overview
Daryal is a React-based vehicle diagnosis application that helps users diagnose issues with various vehicle types including motorcycles, electric cars, electric motorcycles, electric scooters, and Orbea bikes. The app features an AI-powered chat interface for diagnostics.

## Project Structure
```
daryal/               # Main React application
├── public/           # Static assets
│   ├── planosGLb/   # GLB files and photos
├── src/
│   ├── api/         # API integrations (OpenAI)
│   ├── components/  # React components
│   │   ├── CodeInterpreterForm/
│   │   ├── ElectricCarForm/
│   │   ├── ElectricMotorcycleForm/
│   │   ├── ElectricScooterForm/
│   │   ├── MotorcycleForm/
│   │   ├── OrbeaForm/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── navbar/
│   │   └── robot/
│   ├── hooks/       # Custom React hooks
│   ├── utils/       # Utility functions
│   └── styles/      # Global styles
```

## Tech Stack
- React 18 with React Router v6
- Create React App (react-scripts)
- SASS for styling
- Tailwind CSS
- Three.js with @react-three/fiber and @react-three/drei for 3D elements
- Framer Motion for animations
- Firebase for backend services
- OpenAI for AI-powered diagnostics

## Running the Application
The app runs on port 5000 using the "Frontend" workflow:
```
cd daryal && npm start
```

## Configuration
Environment variables are set in `daryal/.env`:
- PORT=5000
- HOST=0.0.0.0
- DANGEROUSLY_DISABLE_HOST_CHECK=true (required for Replit proxy)

## Recent Changes
- 2026-01-06: Initial import and configuration for Replit environment

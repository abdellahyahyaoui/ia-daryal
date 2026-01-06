# Daryal - Diagnostic Expert Application

## Overview
Daryal is a Spanish-language diagnostic expert application built with React. It features a chat interface where users can interact with an AI diagnostic assistant. The application supports various vehicle types including cars, motorcycles, electric vehicles, and scooters.

## Project Structure
```
daryal/
├── public/           # Static assets, GLB models, images
├── src/
│   ├── api/          # API integrations (OpenAI)
│   ├── components/   # React components
│   │   ├── chat/     # Chat functionality
│   │   ├── layout/   # Layout components (Sidebar, ChatLayout)
│   │   ├── VehicleForm/    # Vehicle diagnostic forms
│   │   ├── MotorcycleForm/ # Motorcycle diagnostics
│   │   ├── ElectricCarForm/ # Electric car diagnostics
│   │   └── ...       # Other component folders
│   ├── hooks/        # Custom React hooks
│   ├── styles/       # Global styles
│   └── utils/        # Utility functions
├── package.json      # Dependencies
└── tailwind.config.js # Tailwind CSS configuration
```

## Technology Stack
- React 18.3.1 (Create React App)
- React Router DOM 6.27
- Three.js with @react-three/fiber and @react-three/drei
- Tailwind CSS 3.4
- OpenAI API integration
- Firebase
- Framer Motion for animations
- SASS for styling

## Running the Application
The application runs on port 5000 with:
```bash
cd daryal && PORT=5000 npm start
```

## Key Features
- AI-powered diagnostic chat interface
- Vehicle diagnostic forms for different vehicle types
- 3D model viewing capabilities
- Media capture functionality
- PDF export utilities
- Firebase integration

## Recent Changes
- January 6, 2026: Project imported to Replit environment
  - Installed npm dependencies
  - Configured workflow to run on port 5000
  - Verified application is working

## User Preferences
(To be updated based on user feedback)

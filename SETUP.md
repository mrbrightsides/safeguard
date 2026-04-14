# Setup Guide: SafeGuard EWS

This guide will help you get SafeGuard up and running on your local machine for development and testing.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Firebase CLI**: (Optional, for rules deployment) `npm install -g firebase-tools`

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/mrbrightsides/safeguard.git
cd safeguard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your API keys. You can use `.env.example` as a template.

```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (Optional if using firebase-applet-config.json)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Configuration
Ensure you have a `firebase-applet-config.json` in the root directory if you are using the automated Firebase setup.

### 5. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

## 🧪 Linting & Formatting

To check for code quality issues:

```bash
npm run lint
```

## 🛠️ Troubleshooting

- **Vite Port Conflict**: SafeGuard is configured to run on port 3000. Ensure no other service is using this port.
- **Firebase Permissions**: If you encounter "Permission Denied" errors, ensure your `firestore.rules` are deployed to your Firebase project.
- **Gemini API Errors**: Ensure your API key is valid and has access to the `gemini-2.0-flash` model.

---

## 🛡️ Prompt Opinion Integration

### 1. Register Agent
Use the following URL to register SafeGuard in the Prompt Opinion dashboard:
`https://server-safeguard.onrender.com/.well-known/agent-card.json`

### 2. Enable SHARP
Ensure the **FHIR Context Extension** is enabled in the agent settings to allow SafeGuard to consume patient data.

### 3. Test A2A
In the Prompt Opinion Launchpad, use the `@SafeGuard` mention to trigger clinical analysis:
`@SafeGuard analyze patient Edward Balistreri. DASS-21: 28, SRQ-20: 15.`

## 🏗️ Deployment

SafeGuard is optimized for deployment on **Render**:
- **Build Command**: `npm run build`
- **Start Command**: `npm run start` (runs `node server.ts`)
- **Environment Variables**: Ensure `GEMINI_API_KEY` is set in the Render dashboard.

---

Developed for the **Prompt Opinion Hackathon 2026**.


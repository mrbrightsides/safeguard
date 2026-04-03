# SafeGuard: Safespace AI/ML Prognostic & Health Economic Evaluation

<div align="center">

[![HSIL Hackathon 2026](https://img.shields.io/badge/HSIL_Hackathon-2026-red?style=for-the-badge)](https://hsil.id/)
[![AI-Powered](https://img.shields.io/badge/AI--Powered-Teal?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Accessibility-First](https://img.shields.io/badge/Accessibility--First-Blue?style=for-the-badge&logo=accessibility&logoColor=white)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

SafeGuard is an enterprise-grade psychosocial health surveillance system that integrates advanced **Safespace AI/ML** prognostic models with robust **Health Economic Evaluation (HEE)**. Designed for large organizations and healthcare providers, it monitors, detects, and mitigates mental health burdens using WHO-standard ROI modeling and ICD-10 clinical frameworks.

## 🛡️ The SAFE Framework
SafeGuard operates on the **SAFE** mnemonic to ensure comprehensive mental health surveillance:
- **S**ense: Real-time biometric and digital anamnesis data collection.
- **A**nalyze: AI-driven risk stratification and prognostic modeling.
- **F**lag: Automated alerting for Level 0-L2 clinical risks.
- **E**ngage: Personalized wellness roadmaps and clinical escalation.

---

## 🚀 Key Features

### 1. **Safespace AI/ML Prognostic Model**
*   **Hierarchical Risk Stratification**: Automated triaging from **Level 0 (Psychiatric Emergency/Suicidal)** to **Level 3 (Prognostic/Functioning)**.
*   **Prognostic Surveillance**: 90-day predictive modeling for absenteeism, presenteeism, and relapse risk based on psychosocial stressors (L3).
*   **AI-Driven Insights**: Real-time analysis of burnout resilience and occupational functioning.

### 2. **Health Economic Evaluation (HEE)**
*   **WHO-Standard ROI Modeling**: Visualizes the **1:4 Return on Investment** (ROI) for mental health interventions (US$1 Trillion global burden context).
*   **INA-CBG Claim Mapping**: Integration of Indonesian Case-Based Groups (INA-CBG) for mean claim analysis (e.g., Rp12.4M/admission) and medication cost tracking.
*   **Cost of Inaction vs. Intervention**: Robust comparative analytics to justify wellness budget allocation for management and stakeholders.

### 3. **Clinical & Statistical Interoperability**
*   **ICD-10 Chapter V Mapping**: Burden clusters categorized by WHO ICD-10 codes (F30-F39 Mood, F40-F48 Anxiety/Stress, etc.) for standardized reporting.
*   **Community Medicine Utilization Review**: Doughnut-based analytics for facility distribution (Puskesmas, RSUD) and medication utilization (Antidepressants, Anxiolytics).

### 4. **Personalized Prevention Roadmap**
*   **Dual-Mode Interface**: Specialized roadmaps for **Worker Mode** (Occupational Health) and **Patient Mode** (Clinical Prevention).
*   **L3 Prognostic Predictors**: Monitoring of workplace conflict, peer support quality, and psychosocial stressors.
*   **Personal ROI**: Individualized estimates of annual healthcare savings and productivity value in IDR.

### 5. **Digital Anamnesis & Biometric Sync**
*   **DASS-21 & SRQ-20 Integration**: Comprehensive psychosocial self-assessment for AI-driven risk detection.
*   **Live Biometric Surveillance**: Real-time BPM and HRV (Heart Rate Variability) sync via Bluetooth simulation to monitor autonomic nervous system regulation.

### 6. **Inclusive Design (Accessibility-First)**
*   **Adaptive UI Engine**: Toggleable **Accessibility Mode** with high-contrast (B&W) interface and simplified layouts.
*   **AI Voice Summary (TTS)**: Real-time audio briefing of health risks and population status for low-vision users.
*   **Tremor-Resistant Interaction**: Extra-large touch targets (p-8/80px) and simplified navigation for users with motor disabilities (Parkinson/Amputation).
*   **Universal Iconography**: Zero-text dependency mode using intuitive icons for low-literacy populations.

### 7. **Mental Emergency Response Protocol (MERP)**
*   **L0 SOS Trigger**: Floating emergency button with immediate GPS-linked escalation.
*   **Automated Dispatch**: Real-time connection to refinery medical teams and first responders.
*   **Voice-Guided Protocol**: Audio instructions for users in crisis until help arrives.

---

## 🎯 Why SafeGuard Matters

- Psychosocial hazards are invisible → not measured → not managed
- Traditional systems are reactive → SafeGuard is predictive
- One incident can cost billions → prevention costs <1%

SafeGuard bridges the gap between clinical insight and economic decision-making.

---

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS 4.0 (Utility-first CSS)
*   **Animations**: Motion (formerly Framer Motion)
*   **Data Visualization**: Recharts (Area, Bar, Pie, Doughnut)
*   **PDF Generation**: jsPDF (Strategic Whitepaper Export)
*   **Accessibility**: Web Speech API (TTS), WCAG 2.2 Compliance

---

## 🛡️ Security & Privacy
SafeGuard is built on privacy-first principles. All individual data is anonymized in aggregate reports, and Level 0/1 escalations follow strict HIPAA/GDPR-compliant protocols to ensure employee and patient confidentiality.

---

## 🗺️ Roadmap
- [ ] **Full Wearable API Integration**: Real-time data from Apple Watch, Garmin, and Fitbit.
- [ ] **Manager/Jury Dashboard**: Advanced view for stakeholders with deep-dive ROI simulation tools.
- [ ] **AI Chatbot Counselor**: 24/7 initial support and crisis triaging using LLMs.
- [ ] **Multi-language Support**: Full localization for global enterprise deployment.

---

## 📡 API Documentation (v1)

SafeGuard provides a robust set of APIs for integration with external health systems and corporate dashboards.

👉 **Live Interactive Docs**: [https://safeguard-hsil.vercel.app/api-docs](https://safeguard-hsil.vercel.app/api-docs)

### Core Endpoints:
- `POST /api/v1/risk-detect`: Automated psychosocial risk stratification (L0-L3).
- `GET /api/v1/economic-forecast`: ROI calculations and INA-CBG claim estimates.
- `GET /api/v1/icd-clusters`: ICD-10 Chapter V burden distribution data.

## 🚀 Technical Architecture Upgrade

The platform has been optimized for **Vercel Serverless** deployment:
- **Frontend**: React + Vite (Served via Vercel Edge).
- **Backend**: Node.js Express (Deployed as Serverless Functions in `/api`).
- **Swagger UI**: OAS 3.0 with CDN-backed assets (jsDelivr) for high availability.
- **Environment Awareness**: Automatic switching between Local (Port 3000) and Production (Vercel) contexts.

---

Developed for the **HSIL Hackathon 2026**.

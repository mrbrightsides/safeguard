# SafeGuard: Safespace AI/ML Prognostic & Health Economic Evaluation

SafeGuard is an enterprise-grade psychosocial health surveillance system that integrates advanced **Safespace AI/ML** prognostic models with robust **Health Economic Evaluation (HEE)**. Designed for large organizations and healthcare providers, it monitors, detects, and mitigates mental health burdens using WHO-standard ROI modeling and ICD-10 clinical frameworks.

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

### 6. **Mental Emergency Response Protocol (MERP)**
*   **L0 Crisis Management**: Standardized protocols for immediate escalation of Level 0 (Emergency) cases.
*   **Professional Consultation**: Instant connection to licensed psychologists and mental health professionals.

---

## 🛠️ Tech Stack

*   **Frontend**: React 18+, TypeScript, Vite
*   **Styling**: Tailwind CSS (Utility-first CSS)
*   **Animations**: Motion (formerly Framer Motion)
*   **Data Visualization**: Recharts (Area, Bar, Pie, Doughnut)
*   **Icons**: Lucide React
*   **State Management**: React Hooks (useState, useEffect)

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
- `POST /api/v1/risk-detect`: Automated psychosocial risk stratification (L0-L3). A Risk Detection Engine. This is where the system understands human distress.
- `GET /api/v1/economic-forecast`: ROI calculations and INA-CBG claim estimates. A Health Economic Intelligence. This is how we translate mental health into financial impact.
- `GET /api/v1/icd-clusters`: ICD-10 Chapter V burden distribution data. A Clinical Standardization Layer. This is how we translate mental health into financial impact.

Our system is built on three layers: detection, economic justification, and clinical standardization.

## 🚀 Technical Architecture Upgrade

The platform has been optimized for **Vercel Serverless** deployment:
- **Frontend**: React + Vite (Served via Vercel Edge).
- **Backend**: Node.js Express (Deployed as Serverless Functions in `/api`).
- **Swagger UI**: OAS 3.0 with CDN-backed assets (jsDelivr) for high availability.
- **Environment Awareness**: Automatic switching between Local (Port 3000) and Production (Vercel) contexts.

SafeGuard is built as an API-first architecture, enabling integration with enterprise HCIS and national health systems.

---

Developed for the **HSIL Hackathon 2026**.

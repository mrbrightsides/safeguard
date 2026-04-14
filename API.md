# SafeGuard API Documentation (v1)

SafeGuard provides a robust set of APIs for integration with the **Prompt Opinion** platform, EHR systems, and corporate dashboards.

## 🔐 Authentication

SafeGuard supports two modes of authentication:
1.  **A2A Mode**: No explicit auth header required when called via the Prompt Opinion Orchestrator (internal routing).
2.  **External Mode**: Firebase ID Token passed in the `Authorization` header.

```http
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

## 📡 Core Endpoints

### 1. A2A Chat (Skills Execution)
Main endpoint for inter-agent communication. Handles clinical risk analysis, ICD-10 recommendations, and economic forecasting.

- **URL**: `/api/v1/chat`
- **Method**: `POST`
- **SHARP Headers**:
  - `x-sharp-patientid`: Patient ID from EHR
  - `x-sharp-fhirserverurl`: FHIR Server URL
  - `x-sharp-token`: FHIR Authorization Token
- **Body**:
  ```json
  {
    "message": "Analyze patient Edward Balistreri. DASS-21: 28, SRQ-20: 15."
  }
  ```
- **Response**: Structured JSON containing `risk_analysis`, `icd10_recommendations`, `economic_impact`, and `recommendations`.

### 2. SHARP Patient Analysis
Analyzes patient data directly using SHARP context.

- **URL**: `/api/v1/analyze`
- **Method**: `POST`
- **Headers**: SHARP Context Headers (PatientID, FHIRServer, Token)
- **Response**: Clinical risk stratification and behavioral insights.

### 3. Economic Forecast & ROI
Calculates potential ROI and INA-CBG claim estimates.

- **URL**: `/api/v1/economic-forecast`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "roi_ratio": "1:5.0",
    "potential_savings": "Rp 20.000.000",
    "ina_cbg_estimates": {
      "mild_cases": "Rp 1.200.000",
      "severe_cases": "Rp 6.000.000"
    }
  }
  ```

### 4. ICD-10 Recommendation
Suggests diagnostic codes based on symptoms.

- **URL**: `/api/v1/icd-clusters`
- **Method**: `GET`
- **Response**: Distribution of ICD-10 Chapter V codes.

## 🛠️ Standards Compliance

- **Interoperability**: SHARP Extension Specs, HL7 FHIR R4
- **Protocol**: Agent-to-Agent (A2A) v2.0
- **Data Format**: JSON
- **Security**: TLS 1.3, AES-256

---
For interactive documentation, visit our [Swagger UI](https://server-safeguard.onrender.com/api-docs).

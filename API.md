# SafeGuard API Documentation (v1)

SafeGuard provides a robust set of APIs for integration with external health systems, corporate dashboards, and third-party analytical tools.

## 🔐 Authentication

All API requests must be authenticated using a Firebase ID Token passed in the `Authorization` header.

```http
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

## 📡 Endpoints

### 1. Psychosocial Risk Detection
Analyzes user data to provide a clinical risk stratification (L0-L3).

- **URL**: `/api/v1/risk-detect`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "dass21": { "depression": 12, "anxiety": 15, "stress": 10 },
    "biometrics": { "hrv": 45, "resting_bpm": 72 },
    "behavioral_signals": ["absenteeism_increase", "social_withdrawal"]
  }
  ```
- **Response**:
  ```json
  {
    "risk_level": "L2",
    "status": "Moderate Risk",
    "icd10_mapping": ["F41.1", "F43.2"],
    "recommendation": "Scheduled counseling session required within 48 hours."
  }
  ```

### 2. Economic Forecast & ROI
Calculates the potential ROI and cost of inaction for a specific population.

- **URL**: `/api/v1/economic-forecast`
- **Method**: `GET`
- **Query Params**: `population_size`, `avg_salary`, `incident_rate`
- **Response**:
  ```json
  {
    "roi_ratio": "1:4.2",
    "potential_savings_idr": 1250000000,
    "cost_of_inaction_idr": 5200000000,
    "ina_cbg_estimates": {
      "psychiatric_admission": 12400000,
      "outpatient_followup": 450000
    }
  }
  ```

### 3. ICD-10 Cluster Distribution
Retrieves the distribution of mental health burdens within the organization.

- **URL**: `/api/v1/icd-clusters`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "clusters": [
      { "code": "F32", "label": "Depressive Episode", "count": 45, "percentage": 15 },
      { "code": "F41", "label": "Other Anxiety Disorders", "count": 120, "percentage": 40 }
    ]
  }
  ```

### 4. SATUSEHAT Sync Status
Checks the synchronization status with the National Health Data Exchange.

- **URL**: `/api/v1/satusehat/status`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "connected",
    "last_sync": "2026-04-08T12:00:00Z",
    "fhir_version": "R4",
    "records_synced": 12450
  }
  ```

## ⚠️ Error Handling

The API uses standard HTTP status codes:
- `200 OK`: Request successful.
- `400 Bad Request`: Invalid parameters.
- `401 Unauthorized`: Missing or invalid authentication token.
- `403 Forbidden`: Insufficient permissions.
- `500 Internal Server Error`: Something went wrong on our end.

Errors are returned in the following format:
```json
{
  "error": {
    "code": "auth/invalid-token",
    "message": "The provided ID token is expired or invalid."
  }
}
```

## 📚 Standards Compliance

- **Data Format**: JSON
- **Health Standard**: HL7 FHIR R4
- **Security**: TLS 1.3, AES-256
- **API Style**: RESTful

---
For interactive documentation, visit our [Swagger UI](https://safeguard-hsil.vercel.app/api-docs).

/**
 * SafeGuard FHIR Integration Service (Mock)
 * Aligned with HL7 FHIR R4 & SATUSEHAT Standards
 */

export interface FHIRResource {
  resourceType: string;
  id: string;
  [key: string]: any;
}

export const generateFHIRPayload = (patientId: string, riskLevel: string, scores: any): FHIRResource[] => {
  const timestamp = new Date().toISOString();
  
  // 1. Patient Resource (Anonymized for Privacy)
  const patient: FHIRResource = {
    resourceType: "Patient",
    id: patientId,
    identifier: [{
      system: "https://fhir.kemkes.go.id/id/nik",
      value: "3171XXXXXXXXXXXX"
    }],
    active: true,
    gender: "unknown", // Privacy-first
    meta: {
      lastUpdated: timestamp
    }
  };

  // 2. Observation Resource (The Assessment Scores)
  const observation: FHIRResource = {
    resourceType: "Observation",
    id: `obs-${Math.random().toString(36).substr(2, 9)}`,
    status: "final",
    category: [{
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/observation-category",
        code: "survey",
        display: "Survey"
      }]
    }],
    code: {
      coding: [{
        system: "http://loinc.org",
        code: "80615-8",
        display: "Mental health screening assessment"
      }]
    },
    subject: { reference: `Patient/${patientId}` },
    effectiveDateTime: timestamp,
    valueString: JSON.stringify(scores),
    note: [{ text: "Psychosocial EWS Assessment via SafeGuard AI" }]
  };

  // 3. RiskAssessment Resource (The AI Output)
  const riskAssessment: FHIRResource = {
    resourceType: "RiskAssessment",
    id: `risk-${Math.random().toString(36).substr(2, 9)}`,
    status: "final",
    subject: { reference: `Patient/${patientId}` },
    occurrenceDateTime: timestamp,
    prediction: [{
      outcome: {
        text: `Psychosocial Risk Level: ${riskLevel}`
      },
      qualitativeRisk: {
        coding: [{
          system: "http://terminology.hl7.org/CodeSystem/risk-probability",
          code: riskLevel.toLowerCase().includes('l0') ? "high" : "moderate",
          display: riskLevel
        }]
      }
    }],
    mitigation: "Automated EWS Flagging & Clinical Escalation via SafeGuard"
  };

  return [patient, observation, riskAssessment];
};

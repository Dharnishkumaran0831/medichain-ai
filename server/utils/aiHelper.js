// server/utils/aiHelper.js

function buildAIPrompt({ name, age, gender, bp, hr, sugar, bmi, temp, symptoms, history }) {
  return `You are a medical AI assistant. Analyze the patient data and return ONLY a valid JSON object with no markdown, no preamble.

Required JSON structure:
{
  "primaryDiagnosis": "string",
  "confidence": number (0-100),
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "riskScore": number (0-100),
  "differentials": [
    { "name": "string", "probability": number, "color": "#hex" }
  ],
  "recommendations": ["string", ...],
  "urgency": "string"
}

Patient Data:
- Name: ${name || 'Unknown'}, Age: ${age}, Gender: ${gender || 'Not specified'}
- Blood Pressure: ${bp || 'Not provided'} mmHg
- Heart Rate: ${hr || 'Not provided'} bpm
- Blood Sugar: ${sugar || 'Not provided'} mg/dL
- BMI: ${bmi || 'Not provided'}
- Temperature: ${temp || 'Not provided'} °C
- Symptoms: ${Array.isArray(symptoms) && symptoms.length ? symptoms.join(', ') : 'None reported'}
- Medical History: ${history || 'None provided'}

Provide clinically accurate analysis. Use red (#ff4757), orange (#ffa502), cyan (#00d4ff), green (#51cf66) for differential colors by severity.`;
}

function parsePrediction(raw) {
  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    // Return a safe fallback if parsing fails
    return {
      primaryDiagnosis: 'Analysis Incomplete — Manual Review Required',
      confidence: 0,
      riskLevel: 'Unknown',
      riskScore: 0,
      differentials: [],
      recommendations: ['Please consult a licensed physician for manual assessment.'],
      urgency: 'Manual review required',
    };
  }
}

module.exports = { buildAIPrompt, parsePrediction };

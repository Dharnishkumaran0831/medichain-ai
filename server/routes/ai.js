// ─────────────────────────────────────────────
//  Route: /api/ai — Disease Prediction via Claude
// ─────────────────────────────────────────────
const router = require('express').Router();

// POST /api/ai/predict
router.post('/predict', async (req, res) => {
  const { name, age, gender, bp, hr, bloodSugar, bmi, temp, symptoms, history } = req.body;

  if (!age) return res.status(400).json({ success: false, error: 'Patient age is required' });

  const prompt = `You are a medical AI assistant. Analyze the patient data and return ONLY a JSON object (no markdown, no text outside the JSON).

Required JSON structure:
{
  "primaryDiagnosis": "string",
  "confidence": number (0-100),
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "riskScore": number (0-100),
  "differentials": [
    { "name": "string", "probability": number, "color": "hex color" }
  ],
  "recommendations": ["string"],
  "urgency": "string",
  "nextSteps": ["string"]
}

Patient Data:
- Name: ${name || 'Unknown'}, Age: ${age}, Gender: ${gender || 'Unknown'}
- Blood Pressure: ${bp || 'N/A'} mmHg
- Heart Rate: ${hr || 'N/A'} bpm
- Blood Sugar: ${bloodSugar || 'N/A'} mg/dL
- BMI: ${bmi || 'N/A'}
- Temperature: ${temp || 'N/A'}°C
- Symptoms: ${Array.isArray(symptoms) ? symptoms.join(', ') : (symptoms || 'none')}
- Medical History: ${history || 'none'}

Provide 3-5 differential diagnoses with realistic probabilities. Be clinically accurate.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);

    const data  = await response.json();
    const raw   = data.content.map(c => c.text || '').join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    const prediction = JSON.parse(clean);

    res.json({ success: true, data: prediction });

  } catch (err) {
    console.error('AI prediction error:', err.message);
    // Return a structured fallback so the UI still works without an API key
    res.json({
      success: true,
      fallback: true,
      data: {
        primaryDiagnosis: 'Analysis Unavailable',
        confidence: 0,
        riskLevel: 'Unknown',
        riskScore: 0,
        differentials: [],
        recommendations: ['Please configure ANTHROPIC_API_KEY in .env to enable AI predictions'],
        urgency: 'Consult a licensed physician',
        nextSteps: ['Add your API key to .env file']
      }
    });
  }
});

module.exports = router;

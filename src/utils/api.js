function buildContentBlock(base64Data, mimeType) {
  const isImage = mimeType.startsWith('image/');
  return isImage
    ? { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64Data } }
    : { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64Data } };
}

function buildHeaders(apiKey, mimeType) {
  const isImage = mimeType.startsWith('image/');
  const headers = {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
    'anthropic-dangerous-direct-browser-access': 'true',
  };
  if (!isImage) headers['anthropic-beta'] = 'pdfs-2024-09-25';
  return headers;
}

async function callClaude(apiKey, mimeType, base64Data, systemPrompt, userText) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: buildHeaders(apiKey, mimeType),
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: [buildContentBlock(base64Data, mimeType), { type: 'text', text: userText }],
      }],
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  const result = await response.json();
  const text = result.content[0].text.trim();
  const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Claude returned incomplete data — the report may be too large. Try uploading a clearer or smaller image.');
  }
}

export async function extractPrescription(base64Data, mimeType) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('API key not configured. Create a .env file with VITE_ANTHROPIC_API_KEY=your_key');

  return callClaude(apiKey, mimeType, base64Data,
    `You are a medical prescription parser. Extract structured data from this prescription image and return ONLY a valid JSON object with no markdown, no explanation, no backticks. Schema:
{
  "date": "YYYY-MM-DD or null",
  "doctorName": "string or null",
  "hospitalName": "string or null",
  "medicines": [{ "name": "string", "dosage": "string", "frequency": "string", "duration": "string", "category": "diabetic|antibiotic|supplement|cardiac|other" }],
  "tests": ["string"],
  "notes": "string or null",
  "nextVisitDate": "YYYY-MM-DD or null"
}`,
    'Extract prescription data from this and return as JSON only.'
  );
}

export async function extractLabReport(base64Data, mimeType) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('API key not configured. Create a .env file with VITE_ANTHROPIC_API_KEY=your_key');

  return callClaude(apiKey, mimeType, base64Data,
    `You are a medical lab report parser. Extract structured data from this lab report image and return ONLY a valid JSON object with no markdown, no explanation, no backticks. Schema:
{
  "date": "YYYY-MM-DD or null",
  "reportName": "string — infer a clean name like 'Lipid Profile' or 'Complete Blood Count' or null",
  "labName": "string or null",
  "orderedBy": "string or null",
  "results": [
    {
      "testName": "string",
      "value": "string",
      "unit": "string or null",
      "normalRange": "string or null",
      "status": "high or low or normal"
    }
  ],
  "abnormalSummary": "1-2 sentence plain-language summary of abnormal values only, or null if all normal"
}`,
    'Extract lab report data from this and return as JSON only.'
  );
}

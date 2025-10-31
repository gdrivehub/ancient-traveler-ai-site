// netlify/functions/chat.js
export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const userMessage = (body.message || '').toString().trim();
  if (!userMessage) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No message provided' }) };
  }

  const API_KEY = process.env.CEREBRAS_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing CEREBRAS_API_KEY env variable' }) };
  }

  const payload = {
    model: 'llama-3.3-70b',
    messages: [
      { role: 'system', content: 'You are "The Ancient Traveler" — a wise storyteller from antiquity. Answer questions about ancient history, cultures, myths, and life in a poetic yet factual tone.' },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.2,
    top_p: 1,
    max_completion_tokens: 1024,
    stream: false
  };

  try {
    const res = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'User-Agent': 'ancient-traveler-site/1.0'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: 502, body: JSON.stringify({ error: 'Upstream error', status: res.status, text }) };
    }

    const data = await res.json();
    let assistantText = '';
    if (Array.isArray(data.choices) && data.choices.length > 0) {
      assistantText = data.choices.map(c => (c.message?.content ?? c.text ?? '')).join('\n');
    } else if (data.output?.[0]?.content?.[0]?.text) {
      assistantText = data.output[0].content[0].text;
    } else {
      assistantText = JSON.stringify(data);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: assistantText })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Request failed', details: err.message }) };
  }
}

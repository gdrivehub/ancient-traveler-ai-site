import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { userMessage } = JSON.parse(event.body);

    const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CEREBRAS_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b",
        messages: [
          {
            role: "system",
            content: "You are an ancient time traveler, a wise explorer who knows everything about history and civilizations across ages."
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_completion_tokens: 512,
        temperature: 0.7,
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to connect to Cerebras API." }),
    };
  }
}

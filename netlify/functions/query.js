import Cerebras from "@cerebras/cerebras_cloud_sdk";

export async function handler(event) {
  try {
    const { userMessage } = JSON.parse(event.body);

    const cerebras = new Cerebras({
      apiKey: process.env.CEREBRAS_API_KEY
    });

    const stream = await cerebras.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an ancient time traveler, a historian who knows every secret and civilization across centuries."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama-3.3-70b",
      stream: false,
      max_completion_tokens: 512,
      temperature: 0.6,
      top_p: 1
    });

    const reply = stream.choices?.[0]?.message?.content || "The ancient winds are silent...";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Something went wrong" })
    };
  }
}

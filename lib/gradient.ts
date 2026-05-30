export async function askGradient(messages: any[]) {
  const response = await fetch(
    "https://inference.do-ai.run/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DIGITALOCEAN_MODEL_ACCESS_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-3-14B",
        messages,
        max_tokens: 500,
      }),
    }
  );

  return response.json();
}
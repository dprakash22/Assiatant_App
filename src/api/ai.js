export async function askAI(prompt, mode = "chat") {
  const apiKey = import.meta.env.VITE_GEMINI_KEY;

  const system =
    mode === "grammar"
      ? "Correct grammar and rewrite clearly without changing meaning."
      : "You are a helpful AI assistant.";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${system}\n\nUser: ${prompt}` }],
          },
        ],
      }),
    }
  );

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}
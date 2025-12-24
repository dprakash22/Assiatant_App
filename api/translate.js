export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { text, source, target } = req.body;

    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source,
        target,
        format: "text",
      }),
    });

    const data = await response.json();

    res.status(200).json({ translated: data.translatedText });
  } catch (err) {
    res.status(500).json({ message: "Translation failed" });
  }
}

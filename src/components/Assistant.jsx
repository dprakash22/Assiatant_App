import { useState } from "react";
import { useSpeech } from "../context/SpeechContext";
import { askAI } from "../api/ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Assistant() {
  const { transcript, startListening, stopListening } = useSpeech();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [grammarMode, setGrammarMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (msg) => {
  if (!msg.trim()) return;

  const userMsg = msg.trim();

  // 👉 Add user message ONCE
  setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
  setInput("");
  setLoading(true);

  try {
    const reply = await askAI(userMsg, grammarMode ? "grammar" : "chat");

    // 👉 Only append bot reply
    setMessages((prev) => [...prev, { from: "bot", text: reply }]);

    speak(reply);
  } catch (e) {
    setMessages((prev) => [
      ...prev,
      { from: "bot", text: "API error. Check your key." },
    ]);
  } finally {
    setLoading(false);
  }
};


  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <h1 className="text-2xl font-bold p-4 border-b border-gray-700">
        Assistant Chat {grammarMode && "(Grammar Correction Mode)"}
      </h1>

      {/* CHAT WINDOW */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[75%] prose prose-invert ${
              m.from === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-gray-800 mr-auto"
            }`}
          >
            {m.from === "bot" ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {m.text}
              </ReactMarkdown>
            ) : (
              m.text
            )}
          </div>
        ))}

        {loading && <p>🤖 Thinking…</p>}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 border-t border-gray-700 flex flex-col gap-2">

        <textarea
          className="w-full p-3 rounded-lg bg-gray-800 resize-none"
          rows={2}
          placeholder={
            grammarMode
              ? "Paste text to correct grammar…"
              : "Type your question…"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <div className="flex gap-2 flex-wrap">

          <button
            onClick={startListening}
            className="bg-green-600 px  -4 py-2 rounded-lg"
          >
            🎤 Voice input
          </button>

          <button
            onClick={stopListening}
            className="bg-yellow-600 px-4 py-2 rounded-lg"
          >
            Stop listening
          </button>

          <button
            onClick={() => setInput(transcript)}
            className="bg-purple-600 px-4 py-2 rounded-lg"
          >
            Use voice text
          </button>

          <button
            onClick={() => setGrammarMode((v) => !v)}
            className={`px-4 py-2 rounded-lg ${
              grammarMode ? "bg-pink-600" : "bg-gray-700"
            }`}
          >
            ✍️ Grammar Mode
          </button>

          <button
            onClick={() => sendMessage(input)}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

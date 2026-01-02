import { useSpeech } from "../context/SpeechContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { startListening, stopListening, listening, jarvisActive } = useSpeech();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Home</h1>

      <p className="mb-4 text-gray-300">
        Say <b>“Hey Jarvis”</b> to activate
      </p>

      <p className="mb-2">
        Status: {jarvisActive ? "🟢 Jarvis Active" : "🔴 Inactive"}
      </p>

      <div className="flex gap-4">
        <button onClick={() => navigate("/assistant")} className="bg-blue-600 px-6 py-3 rounded-lg">
          Open Assistant
        </button>

        <button
          onClick={startListening}
          className={`px-6 py-3 rounded-lg ${
            listening ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {listening ? "Listening…" : "🎤 Start Listening"}
        </button>

        <button onClick={stopListening} className="px-6 py-3 bg-red-700 rounded-lg">
          Stop
        </button>
      </div>
    </div>
  );
}

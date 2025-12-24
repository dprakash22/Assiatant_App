// import { useSpeech } from "../hooks/useSpeech";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const navigate = useNavigate();
//   const { startListening, transcript, listening, speak, stopListening } = useSpeech();

//   // Wake-word & navigation commands

//   useEffect(() => {
//     if (!transcript) return;

//     const text = transcript.toLowerCase();

//     if (text.includes("come on Jarvis")) {
//       speak("Listening activated");
//       return;
//     }

//     if (text.includes("open assistant") || text.includes("start assistant")) {
//       speak("Opening assistant");
//       navigate("/assistant");
//       return;
//     }

//     if (text.includes("open notes")) {
//       speak("Opening notes");
//       navigate("/notes");
//       return;
//     }

//     if (text.includes("open reminders")) {
//       speak("Opening reminders");
//       navigate("/reminders");
//       return;
//     }

//     if (text.includes("jarvis stop") || text.includes("assistant stop")) {
//         speak("Stopping listening");
//         stopListening();         // <-- microphone OFF
//         return;
//     }
//   }, [transcript]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
//       <h1 className="text-3xl font-bold mb-6">
//         🔥 Personal AI Assistant – Home
//       </h1>

//       <p className="mb-4 text-gray-300">
//         Say <span className="font-bold">“Hey assistant”</span> or use buttons below
//       </p>

//       <div className="flex gap-4">
//         <button
//           onClick={() => navigate("/assistant")}
//           className="px-6 py-3 bg-blue-600 rounded-lg"
//         >
//           🚀 Launch Assistant
//         </button>

//         <button
//           onClick={startListening}
//           className={`px-6 py-3 rounded-lg ${
//             listening ? "bg-red-500 animate-pulse" : "bg-green-600"
//           }`}
//         >
//           {listening ? "Listening…" : "🎤 Use Voice"}
//         </button>

//         <button
//             onClick={stopListening}
//             className="px-6 py-3 bg-red-600 rounded-lg"
//             >
//             ⏹ Stop Listening
//         </button>

//       </div>
//     </div>
//   );
// }

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

// import { useEffect, useState } from "react";
// import { useSpeech } from "../context/SpeechContext";

// export default function Assistant() {
//   const { startListening, stopListening, listening, transcript } = useSpeech();

//   const [assistantReply, setAssistantReply] = useState("");

//   // --- SAFE START (avoids InvalidStateError) ---
//   useEffect(() => {
//     const safeStart = async () => {
//       try {
//         await startListening();
//       } catch (e) {
//         console.warn("Already listening. Skipping start.");
//       }
//     };

//     safeStart();
//     return () => {
//       stopListening();
//     };
//   }, []);

//   // --- TEXT → SPEECH (assistant voice) ---
//   const speak = (text) => {
//     if (!text) return;

//     const synth = window.speechSynthesis;

//     // Stop previous speech
//     if (synth.speaking) synth.cancel();

//     const utter = new SpeechSynthesisUtterance(text);
//     utter.rate = 1;
//     utter.pitch = 1;
//     utter.lang = "en-US";

//     synth.speak(utter);
//   };

//   // Example simple bot reply
//   useEffect(() => {
//     if (!transcript) return;

//     if (transcript.toLowerCase().includes("hello")) {
//       setAssistantReply("Hello, how can I help you?");
//     } else if (transcript.toLowerCase().includes("time")) {
//       setAssistantReply("Checking the time for you.");
//     } else if (transcript.toLowerCase().includes("who are you")) {
//       setAssistantReply("I am your Jarvis style assistant.");
//     } else {
//       setAssistantReply("Okay, noted.");
//     }
//   }, [transcript]);

//   // Speak reply automatically
//   useEffect(() => {
//     if (assistantReply) speak(assistantReply);
//   }, [assistantReply]);

//   return (
//     <div className="p-6 text-white bg-gray-900 min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Assistant</h1>

//       <div className="mb-4">
//         Listening Status:
//         <span className="font-semibold ml-2">
//           {listening ? "🎤 Listening" : "⏸️ Not Listening"}
//         </span>
//       </div>

//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => {
//             try {
//               startListening();
//             } catch {}
//           }}
//           className="px-4 py-2 bg-green-600 rounded"
//         >
//           Start Listening
//         </button>

//         <button
//           onClick={stopListening}
//           className="px-4 py-2 bg-red-600 rounded"
//         >
//           Stop Listening
//         </button>
//       </div>

//       <div className="mt-4 p-4 bg-black rounded">
//         <b>User Speech → Text:</b>
//         <p className="mt-2 text-green-400">{transcript || "Say something..."}</p>
//       </div>

//       <div className="mt-4 p-4 bg-black rounded">
//         <b>Assistant Reply (Text → Speech):</b>
//         <p className="mt-2 text-blue-400">{assistantReply}</p>

//         <button
//           onClick={() => speak(assistantReply)}
//           className="mt-3 px-4 py-2 bg-blue-600 rounded"
//         >
//           🔊 Speak Again
//         </button>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useSpeech } from "../context/SpeechContext";

export default function Assistant() {
  const { startListening, stopListening, listening, transcript } = useSpeech();

  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("ta");

  // -------------------------------
  // START LISTENING SAFELY
  // -------------------------------
  useEffect(() => {
    if (!listening) startListening();

    return () => {
      stopListening();
    };
  }, []);

  // Keep transcript synced to text box
  useEffect(() => {
    setInputText(transcript);
  }, [transcript]);

  // -------------------------------
  // TEXT → SPEECH
  // -------------------------------
  const speakText = (text, lang = "en-IN") => {
    if (!text) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  // -------------------------------
  // TRANSLATE FUNCTION
  // (Demo using libretranslate — replace as needed)
  // -------------------------------
  const translate = async () => {
  if (!inputText.trim()) return;

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: inputText,
        source: fromLang,
        target: toLang,
      }),
    });

    const data = await res.json();
    setTranslatedText(data.translated);
  } catch (error) {
    console.error(error);
    setTranslatedText("Translation failed");
  }
};


  // Swap English <-> Tamil direction
  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setTranslatedText("");
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Voice Assistant</h1>

      {/* Listening status */}
      <p className="mb-2">
        🎧 Listening: <b>{listening ? "Yes" : "No"}</b>
      </p>

      {/* Speech Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => !listening && startListening()}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Start Listening
        </button>

        <button
          onClick={stopListening}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Stop Listening
        </button>
      </div>

      {/* INPUT TEXT AREA */}
      <label className="block mb-2 font-semibold">Input (Speech or Typing)</label>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full h-28 p-3 text-black rounded"
        placeholder="Speak or type here..."
      />

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => speakText(inputText, fromLang === 'en' ? 'en-IN' : 'ta-IN')}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          🔊 Speak Input
        </button>

        <button
          onClick={() => setInputText("")}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>

      {/* TRANSLATION CONTROLS */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Translation</h2>

        <div className="flex items-center gap-3 mb-3">
          <span>{fromLang === "en" ? "English" : "Tamil"}</span>

          <button
            className="bg-purple-600 px-3 py-1 rounded"
            onClick={swapLanguages}
          >
            ⇄ Swap
          </button>

          <span>{toLang === "en" ? "English" : "Tamil"}</span>
        </div>

        <button
          onClick={translate}
          className="bg-teal-600 px-4 py-2 rounded"
        >
          🌐 Translate
        </button>

        {/* TRANSLATED OUTPUT */}
        <div className="mt-4 p-3 bg-black rounded min-h-16">
          <b>Translated:</b>
          <p>{translatedText}</p>
        </div>

        <button
          onClick={() =>
            speakText(
              translatedText,
              toLang === "en" ? "en-IN" : "ta-IN"
            )
          }
          className="bg-blue-600 mt-2 px-4 py-2 rounded"
        >
          🔊 Speak Translation
        </button>
      </div>
    </div>
  );
}

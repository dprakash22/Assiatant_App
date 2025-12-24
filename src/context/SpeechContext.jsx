import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const SpeechContext = createContext();

export function SpeechProvider({ children }) {
  const navigate = useNavigate();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognitionRef = useRef(null);
  const manualStopRef = useRef(false);
  const isStartingRef = useRef(false); // <-- NEW GUARD

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [jarvisActive, setJarvisActive] = useState(false);

  // ---------- INIT RECOGNITION ----------
  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      isStartingRef.current = false;
      setListening(true);
    };

    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text.toLowerCase());
    };

    recognition.onerror = () => {
      isStartingRef.current = false;
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);

      // restart only if jarvis active AND not manually stopped
      if (!manualStopRef.current && jarvisActive) {
        safeStart(); // <-- auto safe start
      }
    };

    recognitionRef.current = recognition;

    return () => {
      manualStopRef.current = true;
      recognition.stop();
    };
  }, [jarvisActive]);

  // ---------- SAFE START ----------
  const safeStart = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    // already listening or trying to start – do nothing
    if (listening || isStartingRef.current) return;

    try {
      manualStopRef.current = false;
      isStartingRef.current = true;
      recognition.start();
    } catch (err) {
      // If already started → ignore silently
      isStartingRef.current = false;
    }
  };

  // ---------- SAFE STOP ----------
  const safeStop = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    manualStopRef.current = true;

    try {
      recognition.stop();
    } catch {
      // not running → ignore
    }

    setListening(false);
  };

  // ---------- SPEAK ----------
  const speak = (text) => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;

    window.speechSynthesis.speak(u);
  };

  // ---------- COMMANDS ----------
  useEffect(() => {
    if (!transcript) return;

    const text = transcript;

    // ACTIVATE
    if (text.includes("jarvis activate") || text.includes("hey jarvis")) {
      setJarvisActive(true);
      speak("Jarvis activated");
      safeStart();
      setTranscript("");
      return;
    }

    // DEACTIVATE
    if (text.includes("jarvis sleep") || text.includes("jarvis deactivate")) {
      speak("Going inactive");
      setJarvisActive(false);
      safeStop();
      setTranscript("");
      return;
    }

    // Ignore if inactive
    if (!jarvisActive) return;

    // OPEN ASSISTANT
    if (text.includes("open assistant")) {
      speak("Opening assistant");
      navigate("/assistant");
      setTranscript("");
      return;
    }

    // OPEN HOME
    if (text.includes("open home")) {
      speak("Going home");
      navigate("/");
      setTranscript("");
      return;
    }

    // BACK
    if (text.includes("come back") || text.includes("go back")) {
      speak("Going back");
      navigate(-1);
      setTranscript("");
      return;
    }
  }, [transcript]);

  return (
    <SpeechContext.Provider
      value={{
        listening,
        transcript,
        startListening: safeStart,
        stopListening: safeStop,
        speak,
        jarvisActive,
        setJarvisActive,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeech() {
  return useContext(SpeechContext);
}

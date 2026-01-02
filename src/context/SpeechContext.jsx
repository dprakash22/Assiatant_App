import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReminders } from "./ReminderContext";
import { parseReminderFromText } from "../utils/parseReminderTime";

const SpeechContext = createContext();

export function SpeechProvider({ children }) {
  const navigate = useNavigate();

  // get reminders only from ReminderContext
  const { setReminders } = useReminders();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognitionRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [jarvisActive, setJarvisActive] = useState(false);
  const [transcript, setTranscript] = useState("");

  // guards
  const isStartingRef = useRef(false);
  const manualStopRef = useRef(false);

  // NOTES saved locally
  const [notes, setNotes] = useState(() =>
    JSON.parse(localStorage.getItem("notes") || "[]")
  );

  // persist notes
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // -------- INIT SPEECH RECOGNITION --------
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
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        }
      }

      if (finalText) setTranscript(finalText.toLowerCase());
    };

    recognition.onerror = () => {
      isStartingRef.current = false;
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);

      if (!manualStopRef.current && jarvisActive) {
        safeStart();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      manualStopRef.current = true;
      recognition.stop();
    };
  }, [jarvisActive]);

  // -------- SAFE START --------
  const safeStart = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isStartingRef.current || listening) return;

    try {
      manualStopRef.current = false;
      isStartingRef.current = true;
      recognition.start();
    } catch {
      isStartingRef.current = false;
    }
  };

  // -------- SAFE STOP --------
  const safeStop = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    manualStopRef.current = true;

    try {
      recognition.stop();
    } catch {}

    setListening(false);
  };

  // -------- SPEAK --------
  const speak = (text) => {
    if (!text) return;

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  };

  // -------- COMMAND HANDLER --------
  useEffect(() => {
    if (!transcript) return;

    const text = transcript;

    // WAKE
    if (text.includes("hey jarvis") || text.includes("jarvis activate")) {
      setJarvisActive(true);
      speak("Jarvis activated");
      safeStart();
      setTranscript("");
      return;
    }

    // SLEEP
    if (text.includes("jarvis sleep") || text.includes("jarvis deactivate")) {
      speak("Jarvis deactivated");
      setJarvisActive(false);
      safeStop();
      setTranscript("");
      return;
    }

    if (!jarvisActive) return;

    // NAVIGATE
    if (text.includes("open notes")) {
      navigate("/notes");
      speak("Opening notes");
      setTranscript("");
      return;
    }

    if (text.includes("open reminders")) {
      navigate("/reminders");
      speak("Opening reminders");
      setTranscript("");
      return;
    }

    // NOTES
    if (text.includes("take note") || text.includes("note that")) {
      const noteText = text
        .replace("take note", "")
        .replace("note that", "")
        .trim();

      if (noteText) {
        setNotes((p) => [...p, { id: Date.now(), text: noteText }]);
        speak("Note saved");
      } else {
        speak("What should I write?");
      }

      setTranscript("");
      return;
    }

    // REMINDERS (go to ReminderContext state)
    if (text.includes("remind")) {
        const when = parseReminderFromText(text);

        setReminders(prev => [
          ...prev,
          {
            id: Date.now(),
            text,
            time: when ? when.time.toISOString() : null,
            displayLabel: when ? when.label : "",
            triggered: false,
          }
        ]);


      speak("Reminder saved");
      setTranscript("");
      return;
    }

    speak("Sorry, I am still learning");
    setTranscript("");
  }, [transcript]);

  return (
    <SpeechContext.Provider
      value={{
        listening,
        jarvisActive,
        startListening: safeStart,
        stopListening: safeStop,
        speak,
        notes,
        setNotes,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeech() {
  return useContext(SpeechContext);
}

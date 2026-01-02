import { useState } from "react";
import { useSpeech } from "../context/SpeechContext";

export default function Notes() {
  const { notes, setNotes, speak } = useSpeech();
  const [text, setText] = useState("");

  const saveNote = () => {
    if (!text.trim()) return;

    setNotes((p) => [...p, { id: Date.now(), text }]);
    speak("Note saved");
    setText("");
  };

  const deleteNote = (id) => {
    setNotes((p) => p.filter((n) => n.id !== id));
    speak("Note deleted");
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl mb-4">Notes</h1>

      <textarea
        className="w-full p-2 bg-gray-800 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={saveNote}
        className="mt-2 bg-blue-600 px-4 py-2 rounded"
      >
        Save
      </button>

      <div className="mt-4 space-y-2">
        {notes.map((n) => (
          <div
            key={n.id}
            className="bg-gray-800 p-3 rounded flex justify-between"
          >
            <p>{n.text}</p>

            <button
              onClick={() => deleteNote(n.id)}
              className="text-red-400"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

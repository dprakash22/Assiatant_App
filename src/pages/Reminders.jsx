// import { useState } from "react";
// import { useSpeech } from "../context/SpeechContext";
// import { useReminders } from "../context/ReminderContext";
// import useReminderAlarm from "../hooks/useReminderAlarm";


// export default function Reminders() {
//   const { speak } = useSpeech();
//   const { reminders, setReminders } = useReminders();

//   const [text, setText] = useState("");
//   const [time, setTime] = useState("");

//   const addReminder = () => {
//     if (!text) {
//       speak("Please say reminder text");
//       return;
//     }

//     if (!time) {
//       speak("No time selected");
//       return;
//     }

//     setReminders((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         text,
//         time,
//         triggered: false,
//       },
//     ]);

//     speak("Reminder added successfully");

//     setText("");
//     setTime("");
//   };

//   const deleteReminder = (id) => {
//     setReminders((prev) => prev.filter((r) => r.id !== id));
//     speak("Reminder deleted");
//   };

//   useReminderAlarm();

//   return (
//     <div className="p-6 text-white">
//       <h1 className="text-3xl mb-4">Reminders</h1>

//       <input
//         className="w-full p-2 rounded bg-gray-800 mb-2"
//         placeholder="Reminder text"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />

//       <input
//         type="datetime-local"
//         className="w-full p-2 rounded bg-gray-800 mb-2"
//         value={time}
//         onChange={(e) => setTime(e.target.value)}
//       />

//       <button
//         onClick={addReminder}
//         className="bg-green-600 px-4 py-2 rounded"
//       >
//         Add Reminder
//       </button>

//       <div className="mt-4 space-y-2">
//         {reminders.map((r) => (
//           <div
//             key={r.id}
//             className="bg-gray-800 p-3 rounded flex justify-between"
//           >
//             <div>
//               <p>{r.text}</p>

//               <p className="text-sm text-gray-400">
//                 {r.time
//                   ? new Date(r.time).toLocaleString()
//                   : "No time set"}
//               </p>
//             </div>

//             <button
//               onClick={() => deleteReminder(r.id)}
//               className="text-red-400"
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { useSpeech } from "../context/SpeechContext";
import { useReminders } from "../context/ReminderContext";
import useReminderAlarm from "../hooks/useReminderAlarm";
import { parseReminderFromText } from "../utils/parseReminderTime";

export default function Reminders() {
  const { speak, lastTranscript } = useSpeech();
  const { reminders, setReminders } = useReminders();

  const [text, setText] = useState("");
  const [time, setTime] = useState("");

  const addReminder = (t, when) => {
    setReminders((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: t,
        time: when,
        triggered: false,
      },
    ]);
  };

  const handleAdd = () => {
    if (!text) return speak("Please enter reminder text");

    if (!time) return speak("Please select time");

    addReminder(text, time);
    speak("Reminder saved");

    setText("");
    setTime("");
  };

  // 🎤 voice auto-parse
  const handleVoiceReminder = () => {
    if (!lastTranscript) return;

    const parsed = parseReminderFromText(lastTranscript);

    if (!parsed) {
      speak("Sorry, I could not understand the time");
      return;
    }

    addReminder(lastTranscript, parsed.time);
    speak("Reminder set " + parsed.label);
  };

  useReminderAlarm();

  const deleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    speak("Reminder deleted");
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl mb-4">Reminders</h1>

      <input
        className="w-full p-2 rounded bg-gray-800 mb-2"
        placeholder="Reminder text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* 12-hour visible format */}
      <input
        type="datetime-local"
        className="w-full p-2 rounded bg-gray-800 mb-2"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <button
        onClick={handleAdd}
        className="bg-green-600 px-4 py-2 rounded mr-2"
      >
        Add Reminder
      </button>

      <button
        onClick={handleVoiceReminder}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Use Voice Command
      </button>

      <div className="mt-4 space-y-2">
        {reminders.map((r) => (
          <div
            key={r.id}
            className="bg-gray-800 p-3 rounded flex justify-between"
          >
            <div>
              <p>{r.text}</p>

              <p className="text-sm text-gray-400">
                {new Date(r.time).toLocaleString("en-IN", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                  day: "2-digit",
                  month: "short",
                })}
              </p>
            </div>

            <button
              onClick={() => deleteReminder(r.id)}
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

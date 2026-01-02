// // src/hooks/useReminderAlarm.js
// import { useEffect } from "react";
// import { useReminders } from "../context/ReminderContext";
// import { useSpeech } from "../context/SpeechContext";

// export default function useReminderAlarm() {
//   const { reminders, setReminders } = useReminders();
//   const { speak } = useSpeech();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = new Date();

//       setReminders((prev) =>
//         prev.map((r) => {
//           if (!r.time || r.triggered) return r;

//           const reminderTime = new Date(r.time);

//           if (now >= reminderTime) {
//             speak(`Reminder: ${r.text}`);
//             return { ...r, triggered: true };
//           }

//           return r;
//         })
//       );
//     }, 2000);

//     return () => clearInterval(interval);
//   }, [reminders, setReminders, speak]);
// }
import { useEffect } from "react";
import { useReminders } from "../context/ReminderContext";
import { useSpeech } from "../context/SpeechContext";

export default function useReminderAlarm() {
  const { reminders, setReminders } = useReminders();
  const { speak } = useSpeech();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setReminders((prev) =>
        prev.map((r) => {
          if (!r.time || r.triggered) return r;

          const reminderTime = new Date(r.time);

          if (now >= reminderTime) {
            speak(`Reminder: ${r.text}`);
            alert(`🔔 Reminder: ${r.text}`);
            return { ...r, triggered: true };
          }

          return r;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [setReminders, speak]);
}

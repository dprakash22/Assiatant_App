import { createContext, useContext, useEffect, useState } from "react";

const ReminderContext = createContext();

export function ReminderProvider({ children }) {
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem("reminders");
    return saved ? JSON.parse(saved) : [];
  });

  // persist to local storage
  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  return (
    <ReminderContext.Provider value={{ reminders, setReminders }}>
      {children}
    </ReminderContext.Provider>
  );
}

export const useReminders = () => useContext(ReminderContext);

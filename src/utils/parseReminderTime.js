// export function parseReminderFromText(text) {
//   text = text.toLowerCase();

//   // relative minutes
//   const minMatch = text.match(/in (\d+) minutes?/);
//   if (minMatch) {
//     const mins = parseInt(minMatch[1]);
//     const time = new Date(Date.now() + mins * 60000);
//     return { time, label: `in ${mins} minutes` };
//   }

//   // relative hours
//   const hourMatch = text.match(/in (\d+) hours?/);
//   if (hourMatch) {
//     const hrs = parseInt(hourMatch[1]);
//     const time = new Date(Date.now() + hrs * 3600000);
//     return { time, label: `in ${hrs} hours` };
//   }

//   // at 5 pm / at 10:30 am
//   const atMatch = text.match(/at (\d{1,2})(?::(\d{1,2}))?\s?(am|pm)/);
//   if (atMatch) {
//     let hour = parseInt(atMatch[1]);
//     const minute = atMatch[2] ? parseInt(atMatch[2]) : 0;
//     const ampm = atMatch[3];

//     if (ampm === "pm" && hour !== 12) hour += 12;
//     if (ampm === "am" && hour === 12) hour = 0;

//     const time = new Date();
//     time.setHours(hour, minute, 0, 0);

//     return { time, label: `at ${atMatch[1]}:${minute || "00"} ${ampm}` };
//   }

//   return null;
// }
export function parseReminderFromText(text) {
  text = text.toLowerCase().trim();

  // normalize am/pm formats: pm, p.m., P.M., etc.
  text = text.replace(/\./g, "");

  // --- relative minutes ---
  const minMatch = text.match(/in (\d+) minutes?/);
  if (minMatch) {
    const mins = parseInt(minMatch[1]);
    const time = new Date();
    time.setMinutes(time.getMinutes() + mins);
    return { time, label: `in ${mins} minutes` };
  }

  // --- relative hours ---
  const hourMatch = text.match(/in (\d+) hours?/);
  if (hourMatch) {
    const hrs = parseInt(hourMatch[1]);
    const time = new Date();
    time.setHours(time.getHours() + hrs);
    return { time, label: `in ${hrs} hours` };
  }

  // --- at 2 pm / at 2:30 pm / at 02:00 p.m. ---
  const atMatch = text.match(/at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);

  if (atMatch) {
    let hour = parseInt(atMatch[1]);
    const minute = atMatch[2] ? parseInt(atMatch[2]) : 0;
    const ampm = atMatch[3];

    // 12-hour → 24-hour conversion
    if (ampm === "pm" && hour !== 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;

    // create LOCAL date for today
    const now = new Date();
    const time = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0,
      0
    );

    // if time already passed → schedule tomorrow
    if (time < now) {
      time.setDate(time.getDate() + 1);
    }

    return { time, label: `at ${atMatch[1]}:${minute || "00"} ${ampm}` };
  }

  return null;
}

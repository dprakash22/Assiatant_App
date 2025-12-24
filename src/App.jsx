import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Assistant from "./components/Assistant";
import Notes from "./pages/Notes";
import Reminders from "./pages/Reminders";
import { SpeechProvider } from "./context/SpeechContext";


export default function App() {
  return (
    <BrowserRouter>
      <SpeechProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/reminders" element={<Reminders />} />
        </Routes>
      </SpeechProvider>
    </BrowserRouter>
  );
}

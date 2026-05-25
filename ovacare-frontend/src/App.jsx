import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import SymptomChecker from "./pages/SymptomChecker";
import YogaPlanner from "./pages/YogaPlanner";
import PeriodTracker from "./pages/PeriodTracker";
import Nutritionguide from "./pages/Nutritionguide";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 default → login */}
        <Route path="/" element={<Login />} />

        {/* 🔥 actual app pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/symptoms" element={<SymptomChecker />} />
        <Route path="/diet" element={<Nutritionguide />} />
        <Route path="/yoga" element={<YogaPlanner />} />
        <Route path="/period" element={<PeriodTracker />} />

        {/* 🔥 fallback (optional) */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import SymptomChecker from "./pages/SymptomChecker";
import YogaPlanner from "./pages/YogaPlanner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/symptoms" element={<SymptomChecker />} />
        <Route path="/yoga" element={<YogaPlanner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
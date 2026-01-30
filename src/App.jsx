import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<Home />} />
      <Route path="/admin" element={<Home isAdminOverride={true} />} />
    </Routes>
  );
}

export default App;

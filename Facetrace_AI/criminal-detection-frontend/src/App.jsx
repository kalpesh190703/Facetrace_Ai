import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LiveFeed from "./pages/LiveFeed";
import AddRecord from "./pages/AddRecord";
import DetectionLogs from "./pages/DetectionLogs";
import ViewRecords from "./pages/ViewRecords";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/live" element={<LiveFeed />} />
      <Route path="/add" element={<AddRecord />} />
      <Route path="/logs" element={<DetectionLogs />} />
      <Route path="/records" element={<ViewRecords />} />
    </Routes>
  );
}

export default App;

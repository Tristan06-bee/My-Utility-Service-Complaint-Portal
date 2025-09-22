import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Complaint from "./pages/Complaint";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
        <Link to="/complaint">Complaint</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome Home</h1>} />
        <Route path="/complaint" element={<Complaint />} />
      </Routes>
    </Router>
  );
}

export default App;

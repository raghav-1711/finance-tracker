import Signup from "./pages/Signup";



import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Stocks from "./pages/Stocks";




function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/stocks" element={<Stocks />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
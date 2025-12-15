import { Routes, Route,Navigate } from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import {useState,useEffect } from "react";
import userContext from './context/userContext';
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <div>
        <userContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/home" element={<Home />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </userContext.Provider>
    </div>
  );
}

export default App;

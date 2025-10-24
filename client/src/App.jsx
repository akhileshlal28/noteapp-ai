import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topnav from "./components/Topnav";
import MainDashboard from "./pages/MainDashboard";
import PinnedNote from "./pages/PinnedNote";
import FavouriteNote from "./pages/FavouriteNote";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [notes, setNotes] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    if (!token) return;
    fetch("https://noteapp-ai.onrender.com/api/notes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error(err));
    // keep user from token if not present
    if (!user && token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const inferredUser = payload.user ?? payload; // adjust to your token shape
        setUser(inferredUser);
        localStorage.setItem("user", JSON.stringify(inferredUser));
      } catch (e) {
        // ignore decode errors
      }
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  const PrivateRoute = ({ element }) => {
    return token ? element : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      {/* show navs only when authenticated */}
      {token ? (
        <div className="flex">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Topnav user={user} onLogout={logout} />
            <Routes>
              <Route
                path="/"
                element={<MainDashboard notes={notes} setNotes={setNotes} />}
              />
              <Route
                path="/pinned"
                element={<PinnedNote notes={notes} setNotes={setNotes} />}
              />
              <Route
                path="/favourites"
                element={<FavouriteNote notes={notes} setNotes={setNotes} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      ) : (
        // public routes (no navs)
        <Routes>
          <Route
            path="/login"
            element={<Login setToken={setToken} setUser={setUser} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;

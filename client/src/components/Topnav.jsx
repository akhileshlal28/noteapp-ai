import React from "react";
import { useNavigate } from "react-router-dom";

const Topnav = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout?.();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="text-lg font-semibold">NoteApp</div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm">
              Hello, {user.name ?? user.username ?? user.email ?? "User"}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Topnav;

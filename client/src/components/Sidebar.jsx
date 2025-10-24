import React from "react";
import { Home, Search, Pin, Star, Settings, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col justify-between p-4">
      {/* Top Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <img src="/vite.svg" alt="Vite logo" className="w-8 h-8" />
          <h2 className="text-xl font-bold">SmartScribe</h2>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-sm placeholder-gray-400 flex-1"
            />
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800"
          >
            <Home size={18} />
            Home
          </Link>

          <Link
            to="/pinned"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800"
          >
            <Pin size={18} />
            Pin Notes
          </Link>

          <Link
            to="/favourite"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800"
          >
            <Star size={18} />
            Favourite Notes
          </Link>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-3 mt-6">
        <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800">
          <Settings size={18} />
          Settings
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800">
          <HelpCircle size={18} />
          Help
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

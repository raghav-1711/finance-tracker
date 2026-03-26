import { Link } from "react-router-dom";
import { FaHome, FaUser, FaChartLine } from "react-icons/fa";

export default function Sidebar({ darkMode }) {

  return (

    <div className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"} w-64 border-r shadow-lg p-6 sticky top-0 h-screen`}>

      <div className="flex items-center gap-3 mb-10">

        <img src="/fin.jpg" alt="logo" className="w-12 h-12 rounded-lg shadow-md" />

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          $harkFin
        </h1>

      </div>

      <div className="space-y-4">

        <Link
          to="/dashboard"
          className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
        >
          <FaHome />
          Dashboard
        </Link>

        <Link
          to="/profile"
          className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
        >
          <FaUser />
          Profile
        </Link>

        <Link
          to="/stocks"
          className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
        >
          <FaChartLine />
          Stocks
        </Link>

      </div>

    </div>

  );
}
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";

const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Header with Close button */}
        <div className="bg-teal-600 h-12 flex items-center justify-between px-4">
          <h3 className="text-xl font-semibold">Admin panel</h3>
          {/* Close Button (mobile only) */}
          <button
            className="lg:hidden text-2xl hover:text-gray-200"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* Links */}
        <nav className="mt-4 space-y-2 px-4">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : ""} flex items-center space-x-3 py-2.5 px-3 rounded hover:bg-teal-600`
            } end
          >
             <FaUsers />
            <span>User Analysis</span>
          </NavLink>

          

          
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;

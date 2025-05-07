import React from "react";
import { Link } from "react-router-dom";

const AdminHomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Header */}
      <header className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users and species data</p>
      </header>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manage Users */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Manage Admins
          </h2>
          <p className="text-gray-600 mb-4">
            View, edit, or delete admin accounts.
          </p>
          <Link
            to="/admin/manage-admin"
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg inline-block"
          >
            Go to Admin Management
          </Link>
        </div>

        {/* Manage Users */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Manage Users
          </h2>
          <p className="text-gray-600 mb-4">
            View, edit, or delete user accounts.
          </p>
          <Link
            to="/admin/manage-user"
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block"
          >
            Go to User Management
          </Link>
        </div>

        {/* Manage Species */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Manage Species
          </h2>
          <p className="text-gray-600 mb-4">
            Add, edit, or delete species information.
          </p>
          <Link
            to="/admin/manage-species"
            className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-block"
          >
            Go to Species Management
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
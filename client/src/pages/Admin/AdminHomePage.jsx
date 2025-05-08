import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminHomePage = () => {
  const [usersData, setUsersData] = useState([]);
  const [speciesData, setSpeciesData] = useState([]);

  const userRoleData = [
    {
      name: "USER",
      value: usersData.filter((user) => user.role === "USER").length,
    },
    {
      name: "ADMIN",
      value: usersData.filter((user) => user.role === "ADMIN").length,
    },
  ];
  

  const COLORS = {
    USER: "#bfdbfe", // Tailwind blue-100
    ADMIN: "#fef9c3", // Tailwind yellow-100
  };

  const speciesByClassification = speciesData.reduce((acc, species) => {
    const classification = species.classification || "Unknown";
    acc[classification] = (acc[classification] || 0) + 1;
    return acc;
  }, {});

  const speciesChartData = Object.entries(speciesByClassification).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const {
    data: allUsersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/allclient");
      return res.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to get users");
    },
  });

  const {
    data: allSpeciesData,
    isLoading: isSpeciesLoading,
    isError: isSpeciesError,
  } = useQuery({
    queryKey: ["getAllSpecies"],
    queryFn: async () => {
      const res = await axiosInstance.get("/species/all");
      return res.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to get species");
    },
  });

  useEffect(() => {
    if (allUsersData) {
      setUsersData(allUsersData.users);
    }
    if (allSpeciesData) {
      setSpeciesData(allSpeciesData.species);
    }
  }, [allUsersData, allSpeciesData]);

  console.log(usersData);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Header */}
      <header className="flex flex-col items-center mt-2 mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage users, species data, and view dashboard analytics.
        </p>
      </header>

      {/* Dashboard Analysis */}
      <div className="max-w-5xl w-full mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Dashboard Analytics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-blue-900">
                {usersData.filter((user) => user.role === "USER").length}
              </p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Total Admins
              </h3>
              <p className="text-3xl font-bold text-yellow-900">
                {usersData.filter((user) => user.role === "ADMIN").length}
              </p>
            </div>

            <div className="bg-green-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Total Species
              </h3>
              <p className="text-3xl font-bold text-green-900">
                {speciesData.length}
              </p>
            </div>

            <div className="bg-violet-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-violet-800 mb-2">
                Total Classification
              </h3>
              <p className="text-3xl font-bold text-violet-900">
                {Object.keys(speciesByClassification).length}
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}

        {/* User Role Distribution Bar Chart */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md lg:col-span-2 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            User Role Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userRoleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Count">
                  {userRoleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name] || "#ccc"} // fallback color if unknown role
                    />
                  ))}

                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Manage Users */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Manage Users
            </h2>
            <p className="text-gray-600 mb-4">
              View, edit, or delete user accounts.
            </p>
            <Link
              to="/admin/manage-admin"
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
    </div>
  );
};

export default AdminHomePage;

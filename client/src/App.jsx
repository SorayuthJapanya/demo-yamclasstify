import React from "react";
import NavBar from "./components/NavBar";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ClassificationPage from "./pages/Classification/ClassificationPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import SpeciesPage from "./pages/Spicies/SpeciesPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import AdminHomePage from "./pages/Admin/AdminHomePage";
import Footer from "./components/Footer";
import PreviewPage from "./pages/PreviewPage";
import "./App.css";
import NotFoundPage from "./pages/NotFoundPage";
import HistoryPage from "./pages/HistoryPage";
import ProtectedRoute from "./context/AdminProtect";
import ManageSpeciesPage from "./pages/Admin/ManageSpeciesPage";
import ManageUserPage from "./pages/Admin/ManageUserPage";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        localStorage.setItem("userRole", res.data.role);
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401) return null;
        toast.error(error.response.data.message || "Something went wrong");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  const isAdmin = localStorage.getItem("userRole") === "ADMIN";

  return (
    <>
      <NavBar />

      <div className="w-full bg-gray-50 flex flex-col relation">
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/classification"
            element={
              authUser ? <ClassificationPage /> : <Navigate to={"/login"} />
            }
          />
          <Route
            path="/history"
            element={authUser ? <HistoryPage /> : <Navigate to={"/login"} />}
          />
          <Route path="/specie" element={<SpeciesPage />} />
          <Route
            path="/login"
            element={
              authUser ? (
                authUser.role === "ADMIN" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/home" />
                )
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/signup"
            element={
              authUser ? (
                authUser.role === "ADMIN" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/home" />
                )
              ) : (
                <SignupPage />
              )
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                <AdminHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-user"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                <ManageUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-spicies"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]} authUser={authUser}>
                <ManageSpeciesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preview"
            element={authUser ? <PreviewPage /> : <Navigate to={"/login"} />}
          />
        </Routes>
        <Toaster />

        {/* footer */}
      </div>
      <Footer />
    </>
  );
};

export default App;

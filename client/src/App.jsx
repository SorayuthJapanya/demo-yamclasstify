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

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
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

  return (
    <>
      <NavBar />

      <div className="w-full bg-gray-50 flex flex-col relation">
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/classification"
            element={
              authUser ? <ClassificationPage /> : <Navigate to={"/login"} />
            }
          />
          <Route path="/specie" element={<SpeciesPage />} />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/admin"
            element={
              authUser?.role === "ADMIN" ? (
                <AdminHomePage />
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
          <Route
            path="/preview"
            element={authUser ? <PreviewPage /> : <Navigate to={"/login"} />}
          />
        </Routes>
        <Toaster />

        {/* footer */}
        <Footer />
      </div>
    </>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import rmutllogo from "/rmutl_logo.png";
import plantlogo from "/plant_logo.png";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LogOut, MenuIcon } from "lucide-react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isAdmin = localStorage.getItem("userRole") === "ADMIN";

  const { data: authUser } = useQuery({
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

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onMutate: async () => {
      queryClient.setQueriesData(["authUser"], null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged out successfully");
      localStorage.removeItem("userRole");
      setIsMenuOpen(false);
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Logout failed");
    },
  });

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  return (
    <nav className="h-25 flex items-center justify-center ">
      <div className="w-full h-full shadow-md">
        {/* container */}
        <div className="lg:max-w-[1280px] px-4 w-full mx-auto h-full flex justify-center items-center lg:justify-between">
          {/* Logo */}
          {isAdmin ? (
            <Link to="/admin">
              <div className="flex gap-4">
                <img src={rmutllogo} alt="logo" className="w-10 h-18" />
                <img src={plantlogo} alt="logo" className="w-12 h-18" />
              </div>
            </Link>
          ) : (
            <Link to="/home">
              <div className="flex gap-4">
                <img src={rmutllogo} alt="logo" className="w-10 h-18" />
                <img src={plantlogo} alt="logo" className="w-12 h-18" />
              </div>
            </Link>
          )}

          {/* Hambergur Menu for responsive web */}
          <button
            className="absolute right-8 duration-300 px-2 py-2 rounded-full hover:bg-gray-100 active:bg-gray-200 lg:hidden text-gray-700 focus:outline-none cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon className="size-8" />
          </button>

          {/* Menu */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } lg:flex absolute lg:static top-16 right-4 lg:top-0 lg:right-0 bg-white lg:bg-transparent shadow-md lg:shadow-none rounded-lg lg:rounded-none px-6 py-4 lg:p-0 lg:items-center lg:space-x-8 font-medium text-lg `}
          >
            {isAdmin ? (
              // Admin Menu
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/admin"
                  className="hover:text-blue-500"
                >
                  Home
                </Link>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/admin/manage-admin"
                  className="hover:text-blue-500"
                >
                  Manage Users
                </Link>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/admin/manage-species"
                  className="hover:text-blue-500"
                >
                  Manage Species
                </Link>
              </div>
            ) : authUser ? (
              // Authenticated User Menu
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/classification"
                  className="hover:text-blue-500"
                >
                  Classification
                </Link>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/preview"
                  className="hover:text-blue-500"
                >
                  Preview
                </Link>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/history"
                  className="hover:text-blue-500"
                >
                  History
                </Link>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/specie"
                  className="hover:text-blue-500"
                >
                  Species
                </Link>
              </div>
            ) : (
              // Guest Menu
              <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 mt-4 lg:mt-0">
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/login"
                  className="hover:text-blue-500"
                >
                  Login
                </Link>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  to="/signup"
                  className="hover:text-white hover:bg-blue-500 active:bg-blue-700 px-3 py-2 shadow-md rounded-lg duration-200"
                >
                  Signup
                </Link>
              </div>
            )}

            {/* User Info and Logout */}
            {authUser && (
              <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 mt-4 lg:mt-0">
                <Link onClick={() => setIsMenuOpen(false)} >
                  <p className="px-3 py-2 shadow-md rounded-lg cursor-pointer">
                    {authUser.name}
                  </p>
                </Link>
                <button
                  onClick={() => logout()}
                  className="hover:text-white hover:bg-blue-500 active:bg-blue-700 cursor-pointer px-3 py-2 shadow-md rounded-lg duration-200 flex items-center gap-2"
                >
                  <LogOut className="size-5"/> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

import React from "react";
import rmutllogo from "/rmutl_logo.png";
import plantlogo from "/plant_logo.png";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Logout failed");
    },
  });

  console.log("authUser", authUser);

  return (
    <div className="h-25 flex items-center justify-center ">
      <div className="w-full h-full shadow-md">
        {/* container */}
        <div className="lg:max-w-[1280px] px-4 w-full mx-auto h-full flex justify-center items-center lg:justify-between">
          {/* Logo */}
          <Link to="/">
            <div className="flex gap-4">
              <img src={rmutllogo} alt="logo" className="w-10 h-18" />
              <img src={plantlogo} alt="logo" className="w-12 h-18" />
            </div>
          </Link>

          {/* Menu */}
          <div className="hidden lg:block">
            <ul className="flex space-x-8 font-medium text-lg items-center">
              <Link to="/classification">
                <li className="hover:text-blue-500 cursor-pointer duration-200">
                  Classification
                </li>
              </Link>
              <Link to="/preview">
                <li className="hover:text-blue-500 cursor-pointer duration-200">
                  Preview
                </li>
              </Link>
              <Link to="/specie">
                <li className="hover:text-blue-500 cursor-pointer duration-200">
                  Species
                </li>
              </Link>

              {authUser ? (
                <div className="flex items-center gap-6">
                  <Link to={"/"}>
                    <p className="px-3 py-2 shadow-md rounded-lg cursor-pointer">
                      {authUser.name}
                    </p>
                  </Link>
                  <li
                    onClick={() => logout()}
                    className="hover:text-white hover:bg-blue-500 active:bg-blue-700 cursor-pointer px-3 py-2 shadow-md rounded-lg duration-200"
                  >
                    Logout
                  </li>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <Link to="login">
                    <li className="hover:text-blue-500 cursor-pointer duration-200">
                      Login
                    </li>
                  </Link>
                  <Link to="signup">
                    <li className="hover:text-white hover:bg-blue-500  active:bg-blue-700 cursor-pointer px-3 py-2 shadow-md rounded-lg duration-200">
                      Signup
                    </li>
                  </Link>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

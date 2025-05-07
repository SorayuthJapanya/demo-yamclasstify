import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  // set all fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("userRole") === "ADMIN";

  //   call backend useMutation ( POST, PUT, DELETE )
  const { mutate: signUpMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      if (isAdmin) {
        navigate("/admin/manage-admin");
      } else {
        navigate("/");
      }
    },
    onError: (err) =>
      toast.error(err.response.data.message || "Something went wrong!!"),
  });

  //   when click submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return toast.error("Password do not match");
    signUpMutation({ name, email, role, password, confirmPassword });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-6 my-12 w-full"
    >
      {/* Title */}
      <div className="text-center text-3xl md:text-3xl lg:text-4xl font-semibold pb-6">
        {isAdmin ? <h2>Add New User</h2> : <h2>Sgn Up</h2>}
      </div>

      {/* Input */}
      <div className="w-full">
        <input
          type="text"
          placeholder="Username"
          value={name}
          id="name"
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 border-gray-400 rounded-lg w-full"
          required
        />
      </div>
      <div className="w-full">
        <input
          type="email"
          placeholder="Email"
          value={email}
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 border-gray-400 rounded-lg w-full"
          required
        />
      </div>
      {isAdmin && (
        <div className="w-full">
        <input
          type="text"
          placeholder="** USER && ADMIN **"
          value={role}
          id="role"
          onChange={(e) => setRole(e.target.value)}
          className="border px-3 py-2 border-gray-400 rounded-lg w-full"
          required
        />
      </div>
      )}
      <div className="w-full">
        <input
          type="password"
          placeholder="Password"
          value={password}
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 border-gray-400 rounded-lg w-full"
          required
        />
      </div>
      <div className="w-full">
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          id="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border px-3 py-2 border-gray-400 rounded-lg w-full"
          required
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        className="bg-main px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white text-lg cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="size-5 animate-spin duration-200" />
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
};

export default SignupForm;

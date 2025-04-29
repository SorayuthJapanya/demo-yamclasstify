import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LogInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
    onSuccess: () => {
      toast.success("Logged In successfully");
      queryClient.invalidateQueries({ queryKey:   ["authUser"] });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong!!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-6 my-12 w-full"
    >
      {/* Title */}
      <div className="text-center text-3xl md:text-3xl lg:text-4xl font-semibold pb-6">
        <h2>Log In</h2>
      </div>

      {/* Input */}
      <div className="w-full">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 border-gray-400 rounded-lg w-full"
        />
      </div>
      <div className="w-full">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 border-gray-400 rounded-lg w-full"
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
          "Log In"
        )}
      </button>
    </form>
  );
};

export default LogInForm;

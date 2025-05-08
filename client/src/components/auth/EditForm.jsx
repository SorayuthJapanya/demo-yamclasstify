import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

const EditForm = () => {
  const { id } = useParams();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { mutate: getUser } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.get(`/auth/get-user/${id}`);
      const user = res.data;
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setLoading(false);
    },
  });

  useEffect(() => {
    getUser(); 
  }, [getUser]);

  const { mutate: updateMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.put(`/auth/update-user/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Updated user succesfully");
      navigate("/admin/manage-admin");
    },
    onError: (err) =>
      toast.error(err.response.data.message || "Something went wrong!!"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation({ name, email, role });
  };

  if (loading) {
    return <p className="text-gray-600">Loading user data...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error.message}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-6 my-12 w-full"
    >
      {/* Title */}
      <div className="text-center text-3xl md:text-3xl lg:text-4xl font-semibold pb-6">
        <h2>Edit User</h2>
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

      {/* Button */}
      <button
        type="submit"
        className="bg-main px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white text-lg cursor-pointer text-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="size-5 animate-spin duration-200" />
        ) : (
          "Edit User"
        )}
      </button>
    </form>
  );
};

export default EditForm;

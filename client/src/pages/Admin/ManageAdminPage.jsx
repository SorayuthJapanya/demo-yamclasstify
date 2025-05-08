import React, { use, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Edit, Search, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const ManageAdmin = () => {
  const [dataPages, setDataPages] = useState(1);
  const [usersData, setUsersData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["getAllAdmin"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/allclient");
      return res.data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to fetch admins data");
    },
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: (userId) => axiosInstance.delete(`/auth/delete-user/${userId}`),
    onSuccess: (response) => {
      toast.success(response.data.message);
      setDataPages(response.data);
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user.");
    },
  });

  const { mutate: searchUsers } = useMutation({
    mutationFn: async (name) => await axiosInstance.get(`/auth/search?name=${name}`),
    onSuccess: (response) => {
      toast.success("Search user successfully");
      setUsersData(response.data.users);
      setDataPages(response.data);
      setIsSearch(true);
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "failed to search users")
    }
  });

  const handleEdit = (userId) => {
    navigate(`/edit/${userId}`);
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete user?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, I do!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      deleteUser(userId);
    }
  };

  const handleSearch = () => {
    if (searchValue.trim() === "")
      return toast.error("Search query is not required");
    searchUsers(searchValue);
  };

  const handleGoBack = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (data) {
      setUsersData(data.users);
      setDataPages(data);
    }
  }, [data]);

  return (
    <div className="min-h-160 p-6 flex flex-col justify-cneter items-center">
      <header className="text-center flex flex-col gap-4 mt-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl  font-bold text-gray-800">
          Manage Users
        </h1>
        <p className="text-gray-600">View and manage admin accounts</p>
      </header>

      {/* Menu */}
      <div className="flex flex-col justify-center items-center w-full max-w-4xl mx-auto m-6">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : usersData.length === 0 ? (
          <p className="text-gray-600">No admins found</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 w-full">
            <nav className="flex flex-col sm:flex-row gap-4  justify-between items-center mb-4">
              <div className="flex items-center gap-2 relative">
                <button
                  type="button"
                  className={
                    isSearch
                      ? "absolute right-19 top-1.5 cursor-pointer"
                      : "absolute right-2 top-1.5 cursor-pointer"
                  }
                  onClick={handleSearch}
                >
                  <Search className="size-5 text-gray-400 " />
                </button>
                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="search"
                  className="px-3 py-1 border border-gray-400 rounded"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                {isSearch && (
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-700 duration-200"
                    onClick={handleGoBack}
                  >
                    <Link to={"/admin/manage-admin"}>
                      <p>Back</p>
                    </Link>
                  </button>
                )}
              </div>
              <Link to={"/signup"}>
                <button
                  type="button"
                  className="text-end px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 cursor-pointer active:bg-blue-900 duration-200"
                >
                  Add New User
                </button>
              </Link>
            </nav>

            <div className="overflow-x-auto">
              <table className="w-full ">
                <thead>
                  <tr className="hover:bg-gray-100 border-b-2 font-medium text-gray-700 border-gray-300">
                    <td className="px-4 py-2">#</td>
                    <td className="px-4 py-2">Name</td>
                    <td className=" px-4 py-2">Email</td>
                    <td className=" px-4 py-2">Date Created</td>
                    <td className=" px-4 py-2">Role</td>
                    <td className="text-center px-4 py-2">Actions</td>
                  </tr>
                </thead>
                <tbody>
                  {usersData.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`hover:bg-gray-100 text-gray-600 ${
                        index !== usersData.length - 1
                          ? "border-b border-gray-300"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-4">{index + 1}</td>
                      <td className="px-4 py-4">{user.name}</td>
                      <td className="px-4 py-4">{user.email}</td>
                      <td className="px-4 py-4">
                        {format(new Date(user.createdAt), "dd MMM yyyy")}
                      </td>
                      <td className="px-4 py-4">{user.role}</td>
                      <td className="px-4 py-4 flex items-center justify-center gap-4">
                        <button
                          onClick={() => handleEdit(user._id)}
                          className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-700 cursor-pointer duration-200"
                        >
                          <Edit className="size-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500 text-white px-2 py-2 rounded-full hover:bg-red-700 cursor-pointer duration-200"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <footer>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-gray-600">
                    Showing{" "}
                    <span className="font-medium">
                      {dataPages.users.length}
                    </span>{" "}
                    out of{" "}
                    <span className="font-medium">{dataPages.totalUsers}</span>{" "}
                    entries
                  </p>
                </div>
                <div></div>
              </div>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAdmin;

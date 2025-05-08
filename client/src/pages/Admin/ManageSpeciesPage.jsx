import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Edit, Trash2, Search, Eye, X } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Buffer } from "buffer";
import { Link, useNavigate } from "react-router-dom";

const ManageSpeciesPage = () => {
  const [speciesData, setSpeciesData] = useState([]);
  const [speciesPages, setSpeciesPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  // Fetch species data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["getAllSpecies"],
    queryFn: async () => {
      const res = await axiosInstance.get("/species/all");
      return res.data;
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to fetch species data"
      );
    },
  });

  // Mutation for deleting a species
  const { mutate: deleteSpecies } = useMutation({
    mutationFn: (speciesId) => axiosInstance.delete(`/species/${speciesId}`),
    onSuccess: () => {
      toast.success("Species deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete species");
    },
  });

  // Mutation for deleting a species
  const { mutate: searchSpecies } = useMutation({
    mutationFn: async (searchValue) => {
      const res = await axiosInstance.get(
        `/species/search?query=${searchValue}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Search species successfully");
      setSpeciesData(data.species);
      setSpeciesPages(data);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to search species");
    },
  });

  const handleSearch = () => {
    if (searchValue.trim() === "") {
      setSpeciesData(data.species);
      setIsSearch(false);
      return toast.error("Please enter a search query");
    }
    setIsSearch(true);
    searchSpecies(searchValue);
  };

  // Handle delete action
  const handleDelete = async (speciesId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this species?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      deleteSpecies(speciesId);
    }
  };

  const handleEdit = (speciesId) => {
    navigate(`/admin/edit-species/${speciesId}`);
  };

  const handleGoBack = () => {
    window.location.reload();
  };

  const handleViewSpecies = (speciesId) => {
    navigate(`/specie/${speciesId}`)
  }

  useEffect(() => {
    if (data) {
      setSpeciesData(data.species);
      setSpeciesPages(data);
    }
  }, [data]);

  return (
    <div className="min-h-160 p-6 flex flex-col items-center">
      <header className="text-center flex flex-col gap-4 mt-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          Manage Species
        </h1>
        <p className="text-gray-600">View and manage species data</p>
      </header>

      <div className="flex flex-col justify-center items-center w-full max-w-7xl mx-auto mt-6 mb-20">
        {isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error.message}</p>
        ) : speciesPages.length === 0 ? (
          <p className="text-gray-600">No species found</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 w-full">
            <nav className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
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
                    <Link to={"/admin/manage-species"}>
                      <p>Back</p>
                    </Link>
                  </button>
                )}
              </div>
              <Link to={"/admin/add-species"}>
                <button
                  type="button"
                  className="text-end px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 cursor-pointer duration-200"
                >
                  Add New Species
                </button>
              </Link>
            </nav>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="hover:bg-gray-100 border-b-2 font-medium text-gray-700 border-gray-300 text-center">
                    <td className="px-4 py-2">#</td>
                    <td className="px-4 py-2">Image</td>
                    <td className="px-4 py-2">Common Name</td>
                    <td className="px-4 py-2">Local Name</td>
                    <td className="px-4 py-2">Scientific Name</td>
                    <td className="px-4 py-2">Family Name</td>
                    <td className="px-4 py-2">Created At</td>
                    <td className="px-4 py-2">Actions</td>
                  </tr>
                </thead>
                <tbody>
                  {speciesData.map((species, index) => (
                    <tr
                      key={species._id}
                      className={`hover:bg-gray-100 text-gray-600 ${
                        index !== speciesData.length - 1
                          ? "border-b border-gray-300"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-4">{index + 1}</td>
                      <td className="px-4 py-4 flex items-center justify-center">
                        {species.imageUrl?.data &&
                        species.imageUrl?.contentType ? (
                          <img
                            src={`data:${
                              species.imageUrl.contentType
                            };base64,${Buffer.from(
                              species.imageUrl.data
                            ).toString("base64")}`}
                            alt={species.commonName}
                            className="size-30 object-cover rounded-md"
                          />
                        ) : (
                          <p>No Image</p>
                        )}
                      </td>
                      <td className="px-4 py-4">{species.commonName}</td>
                      <td className="px-4 py-4">{species.localName}</td>
                      <td className="px-4 py-4">{species.scientificName}</td>
                      <td className="px-4 py-4">{species.familyName}</td>
                      <td className="px-4 py-4">
                        {format(new Date(species.createdAt), "dd MMM yyyy")}
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-full h-full flex gap-2 items-center justify-center">
                          <button className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-700 cursor-pointer duration-200">
                            <Eye 
                              onClick={() => handleViewSpecies(species._id)}
                            className="size-5" />
                          </button>
                          <button className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-700 cursor-pointer duration-200">
                            <Edit
                              onClick={() => handleEdit(species._id)}
                              className="size-5"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(species._id)}
                            className="bg-red-500 text-white px-2 py-2 rounded-full hover:bg-red-700 cursor-pointer duration-200"
                          >
                            <Trash2 className="size-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-gray-600">
                    Showing{" "}
                    <span className="font-medium">
                      {speciesPages?.species?.length ?? 0}
                    </span>{" "}
                    out of{" "}
                    <span className="font-medium">
                      {speciesPages?.totalSpecies ?? 0}
                    </span>{" "}
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

export default ManageSpeciesPage;

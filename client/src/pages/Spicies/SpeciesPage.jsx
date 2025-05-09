import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const SpeciesPage = () => {
  const [speciesData, setSpeciesData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  // Fetch species data
  const { data, isLoading, error } = useQuery({
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

  // Search species
  const { mutate: searchSpecies } = useMutation({
    mutationFn: async (value) => {
      const res = await axiosInstance.get(`/species/search?query=${value}`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.species.length === 0) {
        toast.error("No species found for the search query");
        setIsSearching(false);
        return;
      }
      toast.success("Search completed successfully");
      setIsSearching(true);
      setSpeciesData(data.species);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to search species");
    },
  });

  useEffect(() => {
    if (data) {
      setSpeciesData(data.species);
    }
  }, [data]);

  const handleSearchSpecies = () => {
    if (searchValue.trim() === "") {
      toast.error("Search input is required");
      setIsSearching(false);
      setSpeciesData(data.species);
      return;
    }
    searchSpecies(searchValue);
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Explore Species</h1>
        <p className="text-gray-600">
          Discover and learn about various species
        </p>
      </header>

      {/* Search Bar */}
      <div className="flex justify-center items-center mb-6">
        <input
          type="text"
          placeholder="Search species"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="px-4 py-2 border border-gray-400 rounded-l-md w-1/2"
        />
        <button
          onClick={handleSearchSpecies}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-700 cursor-pointer duration-200"
        >
          Search
        </button>
        {isSearching && (
          <button
            onClick={handleRefreshPage}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 cursor-pointer duration-200"
          >
            Back
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">
            {error.message || "An error occurred"}
          </p>
        ) : speciesData.length === 0 ? (
          <p className="text-center text-gray-600">No species found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {speciesData.map((species) => (
              <div
                key={species._id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-200"
              >
                <img
                  src={
                    species.imageUrl
                      ? `${import.meta.env.VITE_SERVER_URL}/uploads/${
                          species.imageUrl
                        }`
                      : "https://via.placeholder.com/150"
                  }
                  alt={species.commonName}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h2 className="text-lg font-bold text-gray-800">
                  {species.commonName}
                </h2>
                <p className="text-gray-600 italic">{species.scientificName}</p>
                <button
                  onClick={() => navigate(`/specie/${species._id}`)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 duration-200 cursor-pointer"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeciesPage;

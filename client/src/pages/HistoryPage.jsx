import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const HistoryPage = () => {
  const queryClient = useQueryClient();
  const [isToggleMap, setIsToggleMap] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address ,setAdress] = useState("Loading...")

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
  });

  const {
    data: authHistory,
    isLoading: isHistoryLoading,
    refetch,
  } = useQuery({
    queryKey: ["authHistory", authUser?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/history/get-history/${authUser._id}`
      );
      return res.data;
    },
    enabled: !!authUser?._id,
  });

  const { mutate: deleteHsitory } = useMutation({
    mutationFn: async (historyId) =>
      await axiosInstance.delete(`history/delete-history/${historyId}`),
    onSuccess: (response) => {
      toast.success("History deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["authHistory"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete history.");
    },
  });

  const { mutate: updateHistory } = useMutation({
    mutationFn: async ({ historyId, latitude, longitude }) => {
      const res = await axiosInstance.put(
        `/history/update-history/${historyId}`,
        {
          latitude,
          longitude,
        }
      );
      return res.data;
    },
    onSuccess: (response) => {
      toast.success("History updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authHistory"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update history.");
    },
  });

  const handleDeleteHistory = async (historyId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete your history?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, I do!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      deleteHsitory(historyId);
    }
  };

  const handleUpdateHistory = async (
    historyId,
    currentLatitude,
    currentLongitude
  ) => {
    let selectedLatitude = currentLatitude || 18.796143;
    let selectedLongitude = currentLongitude || 98.979263;

    const result = await Swal.fire({
      title: "Choose a Location",
      html: `
        <input id="location-search" type="text" placeholder="Search location" class="swal2-input" />
        <div id="map" style="width: 100%; height: 400px; margin-top: 10px;"></div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      didOpen: () => {
        const map = L.map("map").setView(
          [selectedLatitude, selectedLongitude],
          8
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const marker = L.marker([selectedLatitude, selectedLongitude], {
          draggable: true,
        }).addTo(map);

        // Update location when marker is clicked
        map.on("click", (e) => {
          const { lat, lng } = e.latlng;
          selectedLatitude = lat;
          selectedLongitude = lng;
          marker.setLatLng([lat, lng]);
        });

        // Update location when marker is dragged
        marker.on("dragend", () => {
          const { lat, lng } = marker.getLatLng();
          selectedLatitude = lat;
          selectedLongitude = lng;
        });
        // Add search functionality
        const searchInput = document.getElementById("location-search");
        searchInput.addEventListener("change", async () => {
          const query = searchInput.value;
          if (query) {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                  query
                )}`
              );
              const data = await response.json();
              if (data.length > 0) {
                const { lat, lon } = data[0];
                selectedLatitude = parseFloat(lat);
                selectedLongitude = parseFloat(lon);
                map.setView([selectedLatitude, selectedLongitude], 13);
                marker.setLatLng([selectedLatitude, selectedLongitude]);
              } else {
                Swal.fire(
                  "Location not found",
                  "Please try a different search query.",
                  "error"
                );
              }
            } catch (error) {
              Swal.fire("Error", "Failed to fetch location data.", "error");
            }
          }
        });
      },
    });

    if (result.isConfirmed) {
      setLatitude(selectedLatitude);
      setLongitude(selectedLongitude);

      updateHistory({
        historyId,
        latitude: selectedLatitude,
        longitude: selectedLongitude,
      });
    }
  };

  if (isLoading || isHistoryLoading) {
    return (
      <div className="w-full h-screen flex justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="w-full h-screen flex justify-center">
        <p>Failed to fetch user data</p>
      </div>
    );
  }

  if (!authHistory || authHistory.length === 0) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>No history found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your History</h1>
        <p className="text-gray-600">View your classification history</p>
      </header>

      <div className="space-y-6">
        {authHistory.map((history, index) => (
          <div
            key={history._id}
            className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 flex flex-col gap-4 relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="flex justify-center items-center">
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}${history.imageUrl}`}
                  alt={history.bestpredicted}
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>

              {/* Info Section */}
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Best Prediction: {history.bestpredicted}
                </h2>
                <p className="text-gray-600 mb-2">
                  <strong>Confidence Score:</strong> {history.confidenceScore}%
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>All Predictions:</strong>{" "}
                  {history.allpredicted.join(", ")}
                </p>
                <p className="text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(history.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 right-4">
              <div className="flex gap-2">
                <button
                  arai-label="Toggle Map"
                  onClick={() =>
                    setIsToggleMap((prev) => (prev === index ? null : index))
                  }
                  className="px-2 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-700 cursor-pointer"
                >
                  {isToggleMap === index ? (
                    <ChevronUp className="size-5" />
                  ) : (
                    <ChevronDown className="size-5" />
                  )}
                </button>
                <button
                  onClick={() =>
                    handleUpdateHistory(
                      history._id,
                      history.latitude,
                      history.longitude
                    )
                  }
                  className="px-2 py-2 text-white bg-green-600 rounded-full hover:bg-green-700 cursor-pointer"
                >
                  <Edit className="size-5" />
                </button>
                <button
                  onClick={() => handleDeleteHistory(history._id)}
                  className="px-2 py-2 text-white bg-red-500 rounded-full hover:bg-red-700 cursor-pointer"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            </div>

            {/* Map Section */}
            {isToggleMap === index && history.latitude && history.longitude && (
              <div
                className={`mt-4 overflow-hidden transition-all duration-500 ${
                  isToggleMap === index
                    ? "max-h-64 opacity-100 mb-12"
                    : "max-h-0 opacity-0"
                }`}
              >
                <MapContainer
                  center={[history.latitude, history.longitude]}
                  zoom={12}
                  style={{ height: "256px", width: "100%" }}
                  className="rounded-md"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker 
                    position={[history.latitude, history.longitude]}
                    eventHandlers={{click: async (e) => {
                      const { lat, lng } = e.latlng;

                      try {
                        const res = await fetch(
                          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=th`
                        )
                        const data = await res.json();
                        console.log(data.display_name);
                        setAdress(data.display_name);
                      } catch (error) {
                        setAdress("Failed to fetch address.");
                        Swal.fire(
                          "Error",
                          "Failed to fetch location data.",
                          "error"
                        );
                      }
                    }}}>
                    <Popup>
                      ที่อยู่: {address}
                      <br /> 
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;

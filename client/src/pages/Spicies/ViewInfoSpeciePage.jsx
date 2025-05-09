import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Buffer } from "buffer";

const ViewInfoSpeciePage = () => {
  const { id } = useParams();
  const [species, setSpecies] = useState(null);

  const userRole = localStorage.getItem("userRole") === "ADMIN";

  const { data, isLoading, error } = useQuery({
    queryKey: ["getSpecie", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/species/${id}`);
      return res.data;
    },
    onError: () => {
      toast.error("Failed to fetch species data");
    },
  });

  useEffect(() => {
    if (data) {
      setSpecies(data);
    }
  }, [data]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Failed to load species data</p>;
  }

  if (!species) {
    return <p>No species data available</p>;
  }

  return (
    <div className="max-w-2xl w-full mx-auto p-6 min-h-160 ">
      <div className="px-4 py-2 shadow-[0px_0px_20px_-16px_rgba(0,_0,_0,_0.8)] my-4">
        <div className="flex justify-end items-center my-4 mx-4">
          {userRole ? (
            <Link
              to="/admin/manage-species"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 duration-200"
            >
              Go Back
            </Link>
          ) : (
            <Link
              to="/species"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 duration-200"
            >
              Go Back
            </Link>
          )}
        </div>

        {/* Image Section */}
        <div className="mb-10 gap-4 flex flex-col items-center justify-center">
          <img
            src={`${import.meta.env.VITE_SERVER_URL}/uploads/${
              species.imageUrl
            }`}
            alt={species.commonName}
            className="w-70 h-auto object-cover rounded"
          />
          <h1 className="text-2xl font-medium">{species.commonName}</h1>
        </div>

        <div className="max-w-md w-full mx-auto">
          {/* Species Information */}
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex gap-4">
              <p className="text-lg underline">ชื่อท้องถิ่น</p>
              <span>{species.localName}</span>
            </div>
            <div className="flex gap-4">
              <p className="text-lg underline">ชื่อวิทยาศาสตร์</p>
              <span className="italic">{species.scientificName}</span>
            </div>
            <div className="flex gap-4">
              <p className="text-lg underline">วงศ์</p>
              <span className="italic">{species.familyName}</span>
            </div>
          </div>

          {/* Botanical Characteristics */}
          <div className="mt-6 flex flex-col gap-2">
            <p className="text-lg underline">ลักษณะทางพฤกษศาสตร์</p>
            <p className="ml-20">{species.description || "ไม่มีข้อมูล"}</p>
          </div>

          {/* Propagation */}
          <div className="mt-6 flex flex-col gap-2">
            <p className="text-lg underline">การขยายพันธุ์</p>
            <p className="ml-20">{species.propagation || "ไม่มีข้อมูล"}</p>
          </div>

          {/* Planting and Harvesting Seasons */}
          <div className="mt-6 flex flex-col gap-2">
            <p className="text-lg underline">ฤดูกาลปลูก-เก็บเกี่ยว</p>
            <div className="flex flex-col ml-20">
              <p>ปลูกช่วง: {species.plantingseason || "ไม่มีข้อมูล"}</p>
              <p>เก็บเกี่ยวช่วง: {species.harvestingseason || "ไม่มีข้อมูล"}</p>
            </div>
          </div>

          {/* Utilization */}
          <div className="mt-6 flex flex-col gap-2">
            <p className="text-lg underline">การใช้ประโยชน์</p>
            <p className="ml-20">{species.utilization || "ไม่มีข้อมูล"}</p>
          </div>

          {/* Market and Status */}
          <div className="mt-6 flex flex-col gap-2">
            <p className="text-lg underline">ตลาดและสถานภาพ</p>
            <p className="ml-20">{species.status || "ไม่มีข้อมูล"}</p>
          </div>

          {/* Survey Sites */}
          <div className="my-6 flex flex-col gap-2">
            <p className="text-lg underline">แหล่งที่สำรวจ</p>
            <p className="ml-20">{species.surveysite || "ไม่มีข้อมูล"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInfoSpeciePage;

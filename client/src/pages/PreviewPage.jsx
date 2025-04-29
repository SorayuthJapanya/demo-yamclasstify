import React, { useEffect, useRef, useState } from "react";
import { useUpload } from "../context/UploadContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { Loader, Trash2 } from "lucide-react";


const PreviewPage = () => {
  const { images, setImages } = useUpload();
  const queryClient = useQueryClient();

  if (images.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        No Images Selected
      </div>
    );

  const [formData, setFormData] = useState(
    images.map(() => ({
      typeOfLeaf: "",
      thorn: "",
      trichomes: "",
      tip: "",
      leafBaseColor: "",
      leafMiddleColor: "",
      fruit: "",
      shapeOfPetiole: "",
    }))
  );

  const { mutate: classificationMutate, isLoading } = useMutation({
    mutationFn: (classificationData) =>
      axiosInstance.post("/upload", classificationData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      toast.success("Send data completed");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wromg!!");
    },
  });

  const handleChange = (index, field, value) => {
    const updatedFormData = [...formData];
    updatedFormData[index][field] = value;
    setFormData(updatedFormData);
  };

  const handleSubmitHITL = async (e, index) => {
    e.preventDefault();

    console.log("Image to send: ", images[index].file);

    if (!images[index]?.file) {
      toast.error("No image file found");
      return;
    }

    const payLoad = new FormData();
    payLoad.append("image", images[index].file);
    payLoad.append("fruit", formData[index].fruit);
    payLoad.append("leafBaseColor", formData[index].leafBaseColor);
    payLoad.append("leafMiddleColor", formData[index].leafMiddleColor);
    payLoad.append("shapeOfPetiole", formData[index].shapeOfPetiole);
    payLoad.append("thorn", formData[index].thorn);
    payLoad.append("tip", formData[index].tip);
    payLoad.append("trichomes", formData[index].trichomes);
    payLoad.append("typeOfLeaf", formData[index].typeOfLeaf);

    // วิธีตรวจสอบ payLoad ที่ถูกต้อง
    console.log("--- payLoad Contents ---");
    for (let [key, value] of payLoad.entries()) {
      if (value instanceof File) {
        console.log(key, `File: ${value.name} (${value.size} bytes)`);
      } else {
        console.log(key, value);
      }
    }
    classificationMutate(payLoad);
  };

  const handleDeleteForm = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  useEffect(() => {
    console.log("Current image file:", images);
  }, [images]);
  return (
    <div className="lg:max-w-[1280px] px-4 w-full mx-auto min-h-[40rem] mb-20 flex flex-col">
      <div className="text-center my-8 mt-10">
        <h1 className="text-3xl">Human In The Loop (HITL)</h1>
      </div>

      {images.map((item, index) => (
        <div
          key={index}
          className="w-full lg:max-w-4xl mx-auto px-8 py-12 mt-6 rounded-xl shadow-[0px_0px_30px_-20px_rgba(0,_0,_0,_0.8)] "
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full">
            <div className="flex items-center justify-center mb-10 lg:mb-0">
              <img
                src={item.preview}
                key={index}
                alt={`preview-${index}`}
                className="w-[200px] h-auto"
              />
            </div>

            <form
              onSubmit={(e) => handleSubmitHITL(e, index)}
              className="w-full flex flex-col gap-4 justify-center"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={formData[index].typeOfLeaf}
                  onChange={(e) =>
                    handleChange(index, "typeOfLeaf", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-blue-400 focus:border-blue-400 transition-all duration-200"
                >
                  <option value="">-- ชนิดของใบ --</option>
                  <option value="ใบเลี้ยงเดี่ยว">ใบเลี้ยงเดี่ยว</option>
                  <option value="ใบเลี้ยงคู่">ใบเลี้ยงคู่</option>
                </select>

                <select
                  value={formData[index].thorn}
                  onChange={(e) => handleChange(index, "thorn", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-blue-400 focus:border-blue-400 transition-all duration-200"
                >
                  <option value="">-- หนามบริเวณลำต้น --</option>
                  <option value="มีหนาม">มีหนาม</option>
                  <option value="ไม่มีหนาม">ไม่มีหนาม</option>
                </select>

                <select
                  value={formData[index].trichomes}
                  onChange={(e) =>
                    handleChange(index, "trichomes", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-blue-400 focus:border-blue-400 transition-all duration-200"
                >
                  <option value="">-- ขนบริเวณลำต้น --</option>
                  <option value="มีขน">มีขน</option>
                  <option value="ไม่มีขน">ไม่มีขน</option>
                </select>

                <select
                  value={formData[index].tip}
                  onChange={(e) => handleChange(index, "tip", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-blue-400 focus:border-blue-400 transition-all duration-200"
                >
                  <option value="">-- ครีบส่วนก้านใบ --</option>
                  <option value="มีครีบ">มีครีบ</option>
                  <option value="ไม่มีครีบ">ไม่มีครีบ</option>
                </select>

                <select
                  value={formData[index].leafBaseColor}
                  onChange={(e) =>
                    handleChange(index, "leafBaseColor", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-blue-400 focus:border-blue-400 transition-all duration-200"
                >
                  <option value="">-- สีโคนใบ --</option>
                  <option value="สีเขียว">สีเขียว</option>
                  <option value="สีม่วง">สีม่วง</option>
                </select>

                <select
                  value={formData[index].leafMiddleColor}
                  onChange={(e) =>
                    handleChange(index, "leafMiddleColor", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-blue-400 focus:border-blue-400 transition-all duration-200"
                >
                  <option value="">-- สีเส้นกลางใบ --</option>
                  <option value="สีเขียว">สีเขียว</option>
                  <option value="สีม่วง">สีม่วง</option>
                </select>

                <select
                  value={formData[index].fruit}
                  onChange={(e) => handleChange(index, "fruit", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-blue-400 focus:border-blue-400 transition-all duration-200"
                >
                  <option value="">-- ผลของพืช --</option>
                  <option value="มีผล">มีผล</option>
                  <option value="ไม่มีผล">ไม่มีผล</option>
                </select>

                <select
                  value={formData[index].shapeOfPetiole}
                  onChange={(e) =>
                    handleChange(index, "shapeOfPetiole", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-blue-400 focus:border-blue-400 transition-all duration-200"
                >
                  <option value="">-- ลักษณะของก้านใบ --</option>
                  <option value="ก้านตรง">ก้านตรง</option>
                  <option value="ก้านบิดเกลียว">ก้านบิดเกลียว</option>
                </select>
              </div>

              <div className="w-full h-full flex  justify-center items-center gap-4">
                <button
                  type="submit"
                  className={`inline-block py-3 w-full rounded-full text-white font-medium text-md cursor-pointer transition-all duration-300 ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader className="size-5 animate-spin duration-200 mr-2" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteForm(index)}
                  className="text-white bg-red-500 p-3 rounded-full cursor-pointer hover:bg-red-600 duration-200 transform hover:-translate-y-0.5 active:bg-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewPage;

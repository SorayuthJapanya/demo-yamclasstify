import React, { useEffect, useRef, useState } from "react";
import { useUpload } from "../context/UploadContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { Crop, Loader, Trash2 } from "lucide-react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import Swal from "sweetalert2";

const PreviewPage = () => {
  const { images, setImages } = useUpload();
  const queryClient = useQueryClient();

  const cropperRef = useRef(null);
  const [currentCropIndex, setCurrentCropIndex] = useState(null);
  const [cropImageSrc, setCropImageSrc] = useState(null);

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

  // Call API
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
      toast.error(error.response.data.message || "Something went wrong!!");
    },
  });

  // Crop Function
  const startCropping = async (index) => {
    try {
      const image = images[index];
      if (!image?.preview) {
        toast.error("No image available for cropping");
        return;
      }

      // โหลดภาพจาก preview
      const img = new Image();
      img.src = image.preview;

      img.onload = () => {
        const padding = 20;

        const canvas = document.createElement("canvas");
        canvas.width = img.width + padding * 2;
        canvas.height = img.height + padding * 2;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff"; // พื้นหลังขาว
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // วาดภาพไว้ตรงกลาง
        ctx.drawImage(img, padding, padding);

        // แปลงเป็น base64 แล้วเซ็ตให้ Cropper
        const paddedDataUrl = canvas.toDataURL();
        setCropImageSrc(paddedDataUrl);
        setCurrentCropIndex(index);
      };

      img.onerror = () => {
        toast.error("Failed to load image for padding");
      };
    } catch (error) {
      console.error("Error starting crop:", error);
      toast.error("Failed to start cropping");
    }
  };

  // submit Crop
  const applyCropping = async () => {
    if (currentCropIndex === null) return;

    try {
      const cropper = cropperRef.current?.cropper;
      if (!cropper) {
        toast.error("Cropper not initialized");
        return;
      }

      // ได้รูปที่ถูก crop เป็น Data URL
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        fillColor: "#fff",
      });

      // เพิ่มการตรวจสอบว่าได้ canvas มาแล้ว
      if (!croppedCanvas) {
        toast.error("Failed to get cropped canvas. Please try cropping again.");
        return;
      }

      const croppedBase64 = croppedCanvas.toDataURL();

      const res = await fetch(croppedBase64);
      const blob = await res.blob();
      const file = new File([blob], `cropped-${Date.now()}.png`, {
        type: "image/png",
      });

      const updatedImages = [...images];
      updatedImages[currentCropIndex] = {
        ...updatedImages[currentCropIndex],
        preview: croppedBase64,
        file: file,
      };

      setImages(updatedImages);
      setCurrentCropIndex(null);
      toast.success("Image cropped successfully");
    } catch (error) {
      console.error("Error applying crop:", error);
      toast.error("Failed to crop image");
    }
  };

  // when Change
  const handleChange = (index, field, value) => {
    const updatedFormData = [...formData];
    updatedFormData[index][field] = value;
    setFormData(updatedFormData);
  };

  // when submit
  const handleSubmitHITL = async (e, index) => {
    e.preventDefault();

    if (!images[index]?.file) {
      toast.error("No image file found");
      return;
    }
    console.log("Image to send: ", images[index].file);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to send the data?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, send it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      console.log("Sending data for index:", index);

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

      console.log("--- payLoad Contents ---");
      for (let [key, value] of payLoad.entries()) {
        if (value instanceof File) {
          console.log(key, `File: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(key, value);
        }
      }

      classificationMutate(payLoad, {
        onSuccess: () => {
          setImages((prev) => prev.filter((_, i) => i !== index));
          setFormData((prev) => prev.filter((_, i) => i !== index));
        },
      });
    }
  };

  const handleSubmitAllForm = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("No images to submit");
      return;
    }

    const payloads = images.map((image, index) => {
      if (!image?.file) {
        toast.error(`No file found for image at index ${index}`);
        return null;
      }

      const payLoad = new FormData();
      payLoad.append("image", image.file);
      payLoad.append("fruit", formData[index].fruit);
      payLoad.append("leafBaseColor", formData[index].leafBaseColor);
      payLoad.append("leafMiddleColor", formData[index].leafMiddleColor);
      payLoad.append("shapeOfPetiole", formData[index].shapeOfPetiole);
      payLoad.append("thorn", formData[index].thorn);
      payLoad.append("tip", formData[index].tip);
      payLoad.append("trichomes", formData[index].trichomes);
      payLoad.append("typeOfLeaf", formData[index].typeOfLeaf);

      return payLoad;
    });

    const validPayLoads = payloads.filter((payload) => payload !== null);

    if (validPayLoads.length === 0) {
      toast.error("No valid data to submit");
      return;
    }

    try {
      await Promise.all(
        validPayLoads.map((payLoad) =>
          axiosInstance.post("/upload-all", payLoad, {
            header: {
              "Content-Types": "multipart/form-data",
            },
          })
        )
      );

      toast.success("All forms submitted successfully");
      setImages([]);
      setFormData([]);
    } catch (error) {
      console.log("Error submitting forms: ", error);
      toast.error("Failed to submit all forms");
    }
  };

  // When click delete
  const handleDeleteForm = (index) => {
    if (currentCropIndex === index) {
      setCurrentCropIndex(null);
      setCropImageSrc(null);
    }

    setImages(images.filter((_, i) => i !== index));
    setFormData(formData.filter((_, i) => i !== index));
  };

  // redirect
  useEffect(() => {
    console.log("Current image file:", images);
  }, [images]);

  return (
    <>
      {images.length === 0 ? (
        <div className="flex items-center justify-center min-h-160">
          No Images Selected
        </div>
      ) : (
        <div className="lg:max-w-[1280px] px-4 w-full mx-auto min-h-[40rem] mb-20 flex flex-col">
          <div className="text-center my-8 mt-10">
            <h1 className="text-3xl">Human In The Loop (HITL)</h1>
          </div>

          <div className="w-full lg:max-w-4xl mx-auto flex justify-end mb-2">
            <button
              type="button"
              onClick={handleSubmitAllForm}
              className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 active:bg-blue-900 tranform hover:-translate-y-0.5 duration-200 cursor-pointer"
            >
              Submit All
            </button>
          </div>

          {images.map((item, index) => (
            <div
              key={index}
              className="w-full lg:max-w-4xl mx-auto px-8 py-12 mt-6 rounded-xl shadow-[0px_0px_30px_-20px_rgba(0,_0,_0,_0.8)] "
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 w-full">
                <div className="flex flex-col items-center justify-center mb-10 md:mb-0 gap-4">
                  <img
                    src={item.preview}
                    alt={`preview-${index}`}
                    className="w-[200px] h-auto"
                  />
                  <button
                    onClick={() => startCropping(index)}
                    className="text-blue-500 flex items-center transform hover:-translate-y-0.5 hover:bg-blue-500 hover:text-white duration-200 active:bg-blue-700 cursor-pointer px-3 py-2 rounded-xl shadow-xl"
                  >
                    <Crop className="w-4 h-4 mr-1" /> Crop
                  </button>
                </div>
                <div className="flex flex-col gap-2 justify-center items-center">
                  {currentCropIndex === index && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-xl w-[90%] max-w-2xl">
                        <Cropper
                          src={cropImageSrc}
                          style={{ height: 400, width: "100%" }}
                          aspectRatio={1}
                          guides={true}
                          ref={cropperRef}
                          viewMode={0}
                          dragMode="none"
                          autoCropArea={0.7}
                          background={false}
                          responsive={true}
                        />

                        <div className="flex justify-end mt-4 gap-2">
                          <button
                            onClick={() => setCurrentCropIndex(null)}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={applyCropping}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer"
                          >
                            Crop
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                        onChange={(e) =>
                          handleChange(index, "thorn", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleChange(index, "tip", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleChange(index, "fruit", e.target.value)
                        }
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
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PreviewPage;

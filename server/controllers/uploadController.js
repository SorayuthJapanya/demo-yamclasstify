const axios = require("axios");

// Single file upload handler
exports.uploadImages = async (req, res) => {
  try {
    const Currentimage = req.file;
    console.log("Image File:", Currentimage);

    const {
      fruit,
      leafBaseColor,
      leafMiddleColor,
      shapeOfPetiole,
      thorn,
      tip,
      trichomes,
      typeOfLeaf,
    } = req.body;

    console.log("Form Data:", req.body);

    // ถ้ายังไม่ได้ยิง ML API ก็ Mock ไปก่อน
    const mlResult = {
      prediction: "mock-prediction",
      filename: Currentimage.originalname,
      receivedData: {
        fruit,
        leafBaseColor,
        leafMiddleColor,
        shapeOfPetiole,
        thorn,
        tip,
        trichomes,
        typeOfLeaf,
      },
    };

    res.status(200).json({ mlResult });

    /*
    // ถ้า ML API พร้อมยิง
    const response = await axios.post(process.env.ML_URL, {
      image: base64Image,
      fruit,
      leafBaseColor,
      leafMiddleColor,
      shapeOfPetiole,
      thorn,
      tip,
      trichomes,
      typeOfLeaf,
    });

    res.status(200).json(response.data);
    */
  } catch (error) {
    console.error("Error in uploadImages:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

exports.uploadMultipleImages = async (req, res) => {
  try {
    const files = req.files;
    console.log("Uploaded Files: ", files);

    const result = files.map((file, index) => {
      const {
        [`fruit_${index}`]: fruit,
        [`leafBaseColor_${index}`]: leafBaseColor,
        [`leafMiddleColor_${index}`]: leafMiddleColor,
        [`shapeOfPetiole_${index}`]: shapeOfPetiole,
        [`thorn_${index}`]: thorn,
        [`tip_${index}`]: tip,
        [`trichomes_${index}`]: trichomes,
        [`typeOfLeaf_${index}`]: typeOfLeaf,
      } = req.body;

      console.log(`Form Data for file ${index}`, {
        fruit,
        leafBaseColor,
        leafMiddleColor,
        shapeOfPetiole,
        thorn,
        tip,
        trichomes,
        typeOfLeaf,
      });

      // Mock ML API response for each file
      return {
        prediction: "mock-prediction",
        filename: file.originalname,
        receivedData: {
          fruit,
          leafBaseColor,
          leafMiddleColor,
          shapeOfPetiole,
          thorn,
          tip,
          trichomes,
          typeOfLeaf,
        },
      };
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log("Error in uploadMultipleImages controller: ", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

const axios = require("axios");

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

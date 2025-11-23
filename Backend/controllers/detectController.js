// const axios = require("axios");

// External ML API URLs
const LESION_API = {
  streaks: process.env.STREAKS_API,
  globules: process.env.GLOBULES_API,
  pigmentNetwork: process.env.PIGMENT_API,
  negativeNetwork: process.env.NEGATIVE_API,
  miliaLikeCysts: process.env.MILIA_API,
};

// Detect single lesion via external server
async function detectSingleLesion(lesionType, imageBase64) {
  try {
    const apiUrl = LESION_API[lesionType];

    
    // const response = await axios.post(apiUrl, { image: imageBase64 });

    // return {
    //   status: response.data.detected,
    //   confidence: response.data.confidence,
    //   detectedImage: response.data.detectedImage,
    //   labeledImage: response.data.labeledImage,
    // };
    // MOCK RESPONSE FOR TESTING WITHOUT EXTERNAL API
    return {
      status: true,
      confidence: 85,
      detectedImage: apiUrl,
      labeledImage: apiUrl,
    };

  } catch (error) {
    console.error(`Detection error (${lesionType}):`, error.message);

    return {
      status: false,
      confidence: 0,
      detectedImage: null,
      labeledImage: null,
    };
  }
}


exports.runDetection = async (req, res) => {
  try {
    const { imageBase64, types } = req.body;

    if (!imageBase64 || !types)
      return res
        .status(400)
        .json({ success: false, message: "Image and detection types required" });

    let lesionTypes = [];

    if (types === "all") {
      lesionTypes = Object.keys(LESION_API);
    } else if (Array.isArray(types)) {
      lesionTypes = types;
    } else {
      lesionTypes = [types];
    }

    const results = {};

    for (const lesion of lesionTypes) {
      results[lesion] = await detectSingleLesion(lesion, imageBase64);
    }

    res.json({
      success: true,
      message: "Detection completed successfully",
      results,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

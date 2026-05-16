const axios = require("axios");
require("dotenv").config();

async function listModels() {
  try {
    const res = await axios.get(
      "https://generativelanguage.googleapis.com/v1beta/models",
      { params: { key: process.env.GEMINI_API_KEY } }
    );

    console.log("AVAILABLE MODELS:\n", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("ERROR:\n", err.response?.data || err.message);
  }
}

listModels();

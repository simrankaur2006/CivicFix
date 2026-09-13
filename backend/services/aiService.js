import axios from "axios";
import FormData from "form-data";

export const analyzeImage = async (buffer, filename) => {
  const form = new FormData();
  form.append("image", buffer, filename || "image.jpg");

  const { data } = await axios.post(
    `${process.env.AI_SERVICE_URL}/predict`,
    form,
    { headers: form.getHeaders(), timeout: 15000 }
  );

  return data; // { category, confidence, severity, description }
};

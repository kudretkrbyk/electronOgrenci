// src/Api/getData.js
export const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Ağ hatası: " + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Veri alma hatası:", error);
    throw error;
  }
};

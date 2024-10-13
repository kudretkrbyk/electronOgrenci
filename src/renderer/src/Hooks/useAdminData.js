// src/hooks/useAdminData.js
import { useEffect, useState } from "react";
import { fetchData } from "../Api/getData";

const useAdminData = () => {
  const [adminData, setAdminData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // loading durumu

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData("http://localhost:3000/api/admin");
        setAdminData(data);
      } catch (error) {
        console.error("Veriler yüklenirken hata oluştu:", error);
        setError(error);
      } finally {
        setLoading(false); // yükleme tamamlandı
      }
    };

    getData();
  }, []);

  return { adminData, error, loading };
};

export default useAdminData;

import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";

const Charts = ({ examResults }) => {
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // examResults değiştiğinde hatayı sıfırlıyoruz
    if (examResults && examResults[0]) {
      setIsError(false); // Hata durumunu sıfırla
    } else {
      setIsError(true); // Eğer geçerli sonuç yoksa hata durumu
    }
  }, [examResults]);

  if (isError) {
    return <p>Sınav sonuçları bulunamadı.</p>;
  }

  // Öğrenci adı ve sınavlar dizisini alıyoruz
  const ogrenciAdi =
    examResults[0]?.ogrenci?.ogr_ad_soyad || "Bilinmeyen Öğrenci";
  const sinavlar = examResults[0]?.sinavlar || [];

  // Sınav adlarını ve sonuçları ayırıyoruz
  const sinavAdlari = sinavlar.map(
    (sinavObjesi) => sinavObjesi?.sinav?.sinav_adi || "Bilinmeyen Sınav"
  );
  const netler = sinavlar.map((sinavObjesi) => sinavObjesi?.sinav_net ?? 0); // Net bilgisi yoksa 0
  const puanlar = sinavlar.map((sinavObjesi) => sinavObjesi?.sinav_puan ?? 0); // Puan bilgisi yoksa 0

  const netBaslik = `${ogrenciAdi} netleri`;
  const puanBaslik = `${ogrenciAdi} puanları`;

  // Netler grafiği için seçenekler
  const netOptions = {
    chart: {
      zoom: { enabled: false },
      height: 350,
      type: "line",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: [],
        },
      },
    },
    xaxis: {
      categories: sinavAdlari, // X ekseni sınav isimleri
    },
    yaxis: {
      title: {
        text: "Netler",
      },
      min: 0,
      max: 100,
      tickAmount: 5,
    },
    dataLabels: {
      enabled: true, // Verilerin üzerinde etiket gösterme
    },
    title: {
      text: netBaslik,
      align: "left",
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    markers: {
      size: 5,
    },
  };

  // Puanlar grafiği için seçenekler
  const puanOptions = {
    chart: {
      zoom: { enabled: false },
      height: 350,
      type: "line",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: [],
        },
      },
    },
    xaxis: {
      categories: sinavAdlari, // X ekseni sınav isimleri
      title: {
        text: "Sınavlar",
      },
    },
    yaxis: {
      title: {
        text: "Puanlar",
      },
      min: 0,
      max: 500,
      tickAmount: 10,
    },
    dataLabels: {
      enabled: true, // Verilerin üzerinde etiket gösterme
    },
    title: {
      text: puanBaslik,
      align: "left",
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
  };

  return (
    <div className="p-10">
      {/* Netler Grafiği */}
      <div id="net-chart">
        <ReactApexChart
          options={netOptions}
          series={[{ name: "Netler", data: netler }]}
          type="line"
          height={200}
        />
      </div>

      {/* Puanlar Grafiği */}
      <div id="puan-chart">
        <ReactApexChart
          options={puanOptions}
          series={[{ name: "Puanlar", data: puanlar }]}
          type="line"
          height={300}
        />
      </div>
    </div>
  );
};

export default Charts;

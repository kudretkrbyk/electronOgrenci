import useExamsData from "../Hooks/useExamsData";

export default function Exams() {
  const { examsData, error, loading } = useExamsData();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Veri yüklenirken hata oluştu: {error.message}</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Sınav Listesi</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Sınav Adı</th>
              <th className="border border-gray-300 px-4 py-2">Sınav Tarihi</th>
              <th className="border border-gray-300 px-4 py-2">
                Sınava Giren Kişi Sayısı
              </th>
              <th className="border border-gray-300 px-4 py-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {examsData.map((exam, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {exam.sinav_adi}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {(() => {
                    const seconds = exam.sinav_tarihi._seconds;
                    const nanoseconds = exam.sinav_tarihi._nanoseconds;
                    const date = new Date(
                      seconds * 1000 + Math.floor(nanoseconds / 1000)
                    );
                    return date.toLocaleString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  })()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {exam.sinava_giren_sayisi}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {" "}
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom'
import useStudentsData from '../Hooks/useStudentsData'

export default function Students() {
  const { studentsData, error, loading } = useStudentsData()
  const navigate = useNavigate() // useNavigate hook'u ile yönlendirme fonksiyonu

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  if (error) {
    return <div>Veri yüklenirken hata oluştu: {error.message}</div>
  }

  const sortedStudentsData = studentsData.sort((a, b) =>
    a.ogr_ad_soyad.localeCompare(b.ogr_ad_soyad)
  )

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Öğrenci Listesi</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Öğrenci Adı</th>
              <th className="border border-gray-300 px-4 py-2">Öğrenci Sınıfı</th>
              <th className="border border-gray-300 px-4 py-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudentsData.map((e, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{e.ogr_ad_soyad}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {e.ogr_sinif} {e.ogr_sube}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Düzenle
                  </button>
                  <button
                    onClick={() => navigate(`/sonuclar/${e.id}`)} // Öğrenci id ile yönlendirme
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Sonuçlara Git
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

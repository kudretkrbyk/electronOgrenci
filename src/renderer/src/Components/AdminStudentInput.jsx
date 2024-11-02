import { useState } from 'react'
import { usePostStudentData } from '../Hooks/usePostStudentData'

export default function AdminStudentInput() {
  const [ogrAdSoyad, setOgrAdSoyad] = useState('')
  const [ogrNo, setOgrNo] = useState('')
  const [ogrSinif, setOgrSinif] = useState('')
  const [ogrSube, setOgrSube] = useState('')

  const { postData, response, error, loading } = usePostStudentData()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const studentData = {
      ogr_ad_soyad: ogrAdSoyad,
      ogr_no: Number(ogrNo),
      ogr_sinif: ogrSinif,
      ogr_sube: ogrSube
    }

    await postData(studentData) // Veriyi backend'e gönder

    // Inputları sıfırlama
    setOgrAdSoyad('')
    setOgrNo('')
    setOgrSinif('')
    setOgrSube('')
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Öğrenci Girişi</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label>Ad Soyad:</label>
          <input
            type="text"
            value={ogrAdSoyad}
            onChange={(e) => setOgrAdSoyad(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label>Öğrenci No:</label>
          <input
            type="number"
            value={ogrNo}
            onChange={(e) => setOgrNo(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label>Sınıf:</label>
          <input
            type="text"
            value="8"
            readOnly
            className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label>Şube:</label>
          <input
            placeholder="Boş kalabilir"
            type="text"
            value={ogrSube}
            onChange={(e) => setOgrSube(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-4"
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : 'Öğrenciyi Kaydet'}
        </button>

        {response && <p className="text-green-500">Öğrenci başarıyla eklendi!</p>}
        {error && <p className="text-red-500">Bir hata oluştu: {error}</p>}
      </form>
    </div>
  )
}

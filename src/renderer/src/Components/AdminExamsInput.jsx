import { useState } from 'react'
import { usePostExamsData } from '../Hooks/usePostExamsData'

export default function AdminExamsInput() {
  const [sinavAdi, setSinavAdi] = useState('')
  const [sinavTarihi, setSinavTarihi] = useState('')
  const [sinavaGirenKisiSayisi, setSinavaGirenKisiSayisi] = useState('')
  const { postData, response, error, loading } = usePostExamsData()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const examData = {
      sinav_adi: sinavAdi,
      sinav_tarihi: sinavTarihi,
      sinava_giren_sayisi: sinavaGirenKisiSayisi
    }

    // Konsol logu ile examData'yı kontrol edin
    console.log('Gönderilen Sınav Verisi:', examData)

    // Veriyi backend'e gönder
    await postData(examData)

    // Inputları sıfırlama
    setSinavAdi('')
    setSinavTarihi('')
    setSinavaGirenKisiSayisi('')
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Sınav Girişi</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label>Sınav Adı: </label>
          <input
            type="text"
            value={sinavAdi}
            onChange={(e) => setSinavAdi(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label>Sınav Tarihi</label>
          <input
            type="date"
            value={sinavTarihi}
            onChange={(e) => setSinavTarihi(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label>Sınava Kaç Kişi Girdi?</label>
          <input
            type="text"
            value={sinavaGirenKisiSayisi}
            onChange={(e) => setSinavaGirenKisiSayisi(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
          {loading ? 'Kaydediliyor...' : 'Sınavı Kaydet'}
        </button>
        {response && <p className="text-green-500">Sınav başarıyla eklendi!</p>}
        {error && <p className="text-red-500">Bir hata oluştu: {error}</p>}
      </form>
    </div>
  )
}

import { useState, useEffect } from 'react'
import usePostExamResult from '../Hooks/usePostExamResult'
import useExamsResultsReportData from '../Hooks/useExamsResultsReportData'

export default function AdminResultInput({
  examsData,
  studentsData,
  examsLoading,
  studentsLoading
}) {
  const { postExamResult, loading, error, success } = usePostExamResult()
  const { examResults, error: examError, loading: examLoading } = useExamsResultsReportData()
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedExam, setSelectedExam] = useState('')
  const [netSayisi, setNetSayisi] = useState('')
  const [puan, setPuan] = useState('')
  const [siralamasi, setSiralamasi] = useState('')
  const [isReady, setIsReady] = useState(false)
  const [filteredStudents, setFilteredStudents] = useState([])

  // Verileri A-Z sırala
  const sortedStudentsData = studentsData.sort((a, b) =>
    a.ogr_ad_soyad.localeCompare(b.ogr_ad_soyad)
  )

  useEffect(() => {
    if (
      !studentsLoading &&
      !examsLoading &&
      !examLoading &&
      Array.isArray(studentsData) &&
      Array.isArray(examsData)
    ) {
      setIsReady(true)
    } else {
      setIsReady(false)
    }
  }, [studentsLoading, examsLoading, examLoading, studentsData, examsData])

  // Seçilen sınav için sonuç girilmemiş öğrencileri filtrele
  useEffect(() => {
    if (selectedExam && examResults && Array.isArray(studentsData)) {
      const studentsWithoutResult = sortedStudentsData.filter((student) => {
        // Bu öğrenci için seçilen sınavın sonuçlarının olup olmadığını kontrol edin
        const studentResult = examResults.find(
          (result) => result.ogrenci && result.ogrenci.ogr_ad_soyad === student.ogr_ad_soyad
        )

        // Eğer öğrenci sonuçlarda varsa, seçilen sınav id'siyle eşleşmeyenleri filtrele
        if (studentResult && studentResult.sinavlar) {
          return !studentResult.sinavlar.some(
            (sinav) => sinav.sinav && sinav.sinav.id === selectedExam
          )
        }

        // Öğrenci sonuçlarda yoksa, tüm sınavlar için henüz sonuç girişi yapılmamış kabul edin
        return true
      })
      setFilteredStudents(studentsWithoutResult)
    } else {
      setFilteredStudents(sortedStudentsData)
    }
  }, [selectedExam, sortedStudentsData, examResults])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const resultData = {
      ogrenci_id: selectedStudent,
      sinav_id: selectedExam,
      sinav_net: Number(netSayisi),
      sinav_puan: Number(puan),
      sinav_siralama: Number(siralamasi)
    }

    await postExamResult(resultData)

    setSelectedStudent('')

    setNetSayisi('')
    setPuan('')
    setSiralamasi('')
  }

  if (!isReady) {
    return <div className="text-center p-6">Veriler yükleniyor...</div>
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Sınav Sonuç Girişi</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center justify-start gap-10">
          <div>
            <label className="p-4">Öğrenci Seçin:</label>
            <select
              className="p-2"
              onChange={(e) => setSelectedStudent(e.target.value)}
              value={selectedStudent}
              required
            >
              <option value="">Bir öğrenci seçin</option>
              {filteredStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.ogr_ad_soyad}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="p-4">Sınav Seçin:</label>
            <select
              className="p-2 px-5"
              onChange={(e) => setSelectedExam(e.target.value)}
              value={selectedExam}
              required
            >
              <option value="">Bir sınav seçin</option>
              {Array.isArray(examsData) &&
                examsData.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.sinav_adi}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label>Net Sayısı:</label>
          <input
            type="number"
            value={netSayisi}
            onChange={(e) => setNetSayisi(e.target.value)}
            className="border p-2 rounded w-full"
            required
            min="0"
          />
        </div>

        <div>
          <label>Puan:</label>
          <input
            type="number"
            value={puan}
            onChange={(e) => setPuan(e.target.value)}
            className="border p-2 rounded w-full"
            required
            min="0"
          />
        </div>

        <div>
          <label>Sıralama:</label>
          <input
            type="number"
            value={siralamasi}
            onChange={(e) => setSiralamasi(e.target.value)}
            className="border p-2 rounded w-full"
            required
            min="0"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mt-4"
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : 'Sınavı Kaydet'}
        </button>

        {error && <div className="text-red-500 mt-2">{error} ghgh</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}
      </form>
    </div>
  )
}

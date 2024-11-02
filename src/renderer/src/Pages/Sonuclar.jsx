import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom' // useParams ile URL parametresini alıyoruz
import useStudentsData from '../Hooks/useStudentsData'
import useExamResultsData from '../Hooks/useExamResultsData'
import Charts from '../Components/Charts'

export default function Sonuclar() {
  const { id } = useParams() // URL'den gelen öğrenci id'si
  const { studentsData, error: studentsError, loading: studentsLoading } = useStudentsData()
  const [selectedStudent, setSelectedStudent] = useState(id) // Seçilen öğrenci id'si
  const {
    examResults,
    loading: resultsLoading,
    error: resultsError
  } = useExamResultsData(selectedStudent)

  useEffect(() => {
    setSelectedStudent(id) // URL'den alınan id'yi seçili öğrenci olarak ayarla
  }, [id])

  if (studentsLoading) {
    return <div>Öğrenci verileri yükleniyor...</div>
  }

  if (studentsError) {
    return <div>Öğrenci verileri yüklenirken hata oluştu: {studentsError.message}</div>
  }

  const sortedStudentsData = studentsData.sort((a, b) =>
    a.ogr_ad_soyad.localeCompare(b.ogr_ad_soyad)
  )

  return (
    <div className="flex flex-col items-center w-full">
      <div className="p-1">
        <h1 className="text-2xl font-bold mb-5">Sınav Sonuçları</h1>
        <select
          className="w-80 p-2 border border-gray-300 rounded mb-5"
          onChange={(e) => setSelectedStudent(e.target.value)}
          value={selectedStudent}
        >
          <option value="">Bir öğrenci seçin</option>
          {sortedStudentsData.map((student, index) => (
            <option key={index} value={student.id}>
              {student.ogr_ad_soyad}
            </option>
          ))}
        </select>
      </div>

      {selectedStudent && (
        <div className="w-full bg-gray-100 rounded shadow">
          {resultsLoading ? (
            <div>Sonuçlar yükleniyor...</div>
          ) : resultsError ? (
            <div>Veri yüklenirken hata oluştu: {resultsError.message}</div>
          ) : examResults && examResults.length > 0 ? (
            <Charts examResults={examResults} />
          ) : (
            <div>Sonuç bulunamadı.</div>
          )}
        </div>
      )}
    </div>
  )
}

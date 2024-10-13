import { useState } from 'react'
import useStudentsData from '../Hooks/useStudentsData'
import useExamResultsData from '../Hooks/useExamResultsData'
import Charts from '../Components/Charts'

export default function Sonuclar() {
  const { studentsData, error: studentsError, loading: studentsLoading } = useStudentsData() // Sadece öğrenciler
  const [selectedStudent, setSelectedStudent] = useState('') // Seçilen öğrenci id'si
  const {
    examResults,
    loading: resultsLoading,
    error: resultsError
  } = useExamResultsData(selectedStudent) // Seçilen öğrenciye göre sonuçlar

  console.log('Öğrenciler:', studentsData)
  console.log('Seçilen öğrenci ID:', selectedStudent)
  console.log('Sınav sonuçları:', examResults)

  // Öğrenci verileri yüklenirken göster
  if (studentsLoading) {
    return <div>Öğrenci verileri yükleniyor...</div>
  }

  // Öğrenci verileri yüklenirken hata oluşursa göster
  if (studentsError) {
    return <div>Öğrenci verileri yüklenirken hata oluştu: {studentsError.message}</div>
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="p-1">
        <h1 className="text-2xl font-bold mb-5">Sınav Sonuçları</h1>
        {/* Öğrenci seçimi */}
        <select
          className="w-80 p-2 border border-gray-300 rounded mb-5"
          onChange={(e) => setSelectedStudent(e.target.value)} // Seçilen öğrenci id'si
          value={selectedStudent}
        >
          <option value="">Bir öğrenci seçin</option>
          {studentsData.map((student, index) => (
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
            <div>Sonuç bulunamadı.</div> // Eğer sonuç yoksa
          )}
        </div>
      )}
    </div>
  )
}

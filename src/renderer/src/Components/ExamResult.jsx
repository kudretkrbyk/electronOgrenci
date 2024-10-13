import Charts from '../Components/Charts'

export default function ExamResults({
  selectedStudent,
  examResults,
  resultsLoading,
  resultsError
}) {
  return (
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
  )
}

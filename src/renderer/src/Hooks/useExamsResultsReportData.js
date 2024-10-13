import { useEffect, useState } from 'react'

const useExamsResultsReportData = () => {
  const [examResults, setExamResults] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getResults = () => {
      setLoading(true)
      setError(null)

      // Tüm sınav sonuçlarını talep et
      window.api.send('fetch-all-exam-results') // Öğrenci ID'siz tüm sınav sonuçlarını talep ediyoruz

      // Yanıt işleme fonksiyonunu tanımlıyoruz
      const apiResponseHandler = (response) => {
        console.log('Tüm Sınav Sonuçları API Yanıtı:', response) // Daha genel bir kontrol ekledim

        if (response.error) {
          setError(response.error)
          setExamResults([]) // Hata durumunda sonuçları sıfırla
        } else if (Array.isArray(response.data?.data)) {
          setExamResults(response.data.data) // Gelen veriyi ayarla
          setError(null)
        } else {
          setError('Beklenmeyen yanıt formatı.')
          setExamResults([]) // Yanıt beklenmedikse sonuçları sıfırla
        }
        setLoading(false) // Yükleme durumunu bitir
      }

      // 'all-exam-results-response' kanalından gelen yanıtları dinliyoruz
      window.api.receive('all-exam-results-response', apiResponseHandler)

      // Temizlik: Dinleyiciyi kaldırıyoruz
      return () => {
        window.api.off('all-exam-results-response', apiResponseHandler)
      }
    }

    getResults() // Sonuçları almak için fonksiyonu çağır
  }, []) // Boş bağımlılık dizisi ile yalnızca bileşen ilk yüklendiğinde çalışır

  console.log('hook içi sınav sonuçları:', examResults)
  return { examResults, error, loading }
}

export default useExamsResultsReportData

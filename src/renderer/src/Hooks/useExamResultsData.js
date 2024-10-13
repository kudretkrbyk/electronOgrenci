import { useEffect, useState } from 'react'

const useExamResultsData = (studentId = null) => {
  const [examResults, setExamResults] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!studentId) {
      setExamResults([])
      return
    }

    setLoading(true)
    setError(null)

    // Öğrenci ID'sine göre sınav sonuçlarını talep et
    window.api.send('fetch-exam-results', studentId)

    // Dinleyici fonksiyonunu oluşturuyoruz
    const apiResponseHandler = (response) => {
      if (response.error) {
        setError(response.error)
        setExamResults([])
      } else if (Array.isArray(response.data?.data)) {
        setExamResults(response.data.data)
        setError(null)
      } else {
        setError('Beklenmeyen yanıt formatı.')
        setExamResults([])
      }
      setLoading(false)
    }

    // 'exam-results-response' kanalından gelen yanıtları dinliyoruz
    window.api.receive('exam-results-response', apiResponseHandler)

    // Temizlik: Dinleyiciyi kaldırıyoruz
    return () => {
      window.api.off('exam-results-response', apiResponseHandler)
    }
  }, [studentId])

  return { examResults, error, loading }
}

export default useExamResultsData

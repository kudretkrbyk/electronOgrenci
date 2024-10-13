import { useEffect, useState } from 'react'

const useExamsData = () => {
  const [examsData, setExamsData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Sınav verilerini talep et
    window.api.send('fetch-exams')

    // Dinleyici fonksiyonunu oluşturuyoruz
    const apiResponseHandler = (response) => {
      if (response.error) {
        setError(response.error)
        setExamsData([])
      } else if (Array.isArray(response.data?.data)) {
        setExamsData(response.data.data)
        setError(null)
      } else {
        setError('Beklenmeyen yanıt formatı.')
        setExamsData([])
      }
      setLoading(false)
    }

    // 'exams-response' kanalından gelen yanıtları dinliyoruz
    window.api.receive('exams-response', apiResponseHandler)

    // Temizlik: Dinleyiciyi kaldırıyoruz
    return () => {
      window.api.off('exams-response', apiResponseHandler)
    }
  }, [])

  return { examsData, error, loading }
}

export default useExamsData

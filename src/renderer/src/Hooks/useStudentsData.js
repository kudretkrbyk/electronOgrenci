import { useEffect, useState } from 'react'

const useStudentsData = () => {
  const [studentsData, setStudentsData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Öğrenci verilerini talep et
    window.api.send('fetch-students')

    // Dinleyici fonksiyonunu oluşturuyoruz
    const apiResponseHandler = (response) => {
      if (response.error) {
        console.log('if')
        setError(response.error)
        setStudentsData([])
      } else if (Array.isArray(response.data?.data)) {
        setStudentsData(response.data.data)
        setError(null)
        console.log('else if')
      } else {
        console.log('else')
        setError('Beklenmeyen yanıt formatı.')
        setStudentsData([])
      }
      setLoading(false)
    }

    // 'students-response' kanalından gelen yanıtları dinliyoruz
    window.api.receive('students-response', apiResponseHandler)

    // Temizlik: Dinleyiciyi kaldırıyoruz
    return () => {
      window.api.off('students-response', apiResponseHandler)
    }
  }, [])
  console.log('hooh içi öğrencielr', studentsData)

  return { studentsData, error, loading }
}

export default useStudentsData

import { useState } from 'react'

export const usePostStudentData = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [response, setResponse] = useState(null)

  const postData = (data) => {
    setLoading(true)
    setError(null)

    window.api.send('post-student', { data })

    // 'student-response' kanalından gelen yanıtları dinliyoruz
    const handleResponse = (response) => {
      if (response.error) {
        setError(response.error)
      } else {
        setResponse(response.data)
      }
      setLoading(false)

      // Listener'ı temizliyoruz
      window.api.off('post-student-response', handleResponse)
    }

    window.api.receive('post-student-response', handleResponse)
  }

  return { postData, response, error, loading }
}

import { useState } from 'react'

export const usePostExamsData = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [response, setResponse] = useState(null)

  const postData = (data) => {
    setLoading(true)
    setError(null)

    // Veriyi post-exam kanalına gönderiyoruz
    window.api.send('post-exam', { data })

    // 'post-exam-response' kanalından gelen yanıtları dinliyoruz
    const handleResponse = (response) => {
      if (response.error) {
        setError(response.error)
      } else {
        setResponse(response.data)
      }
      setLoading(false)

      // Listener'ı temizliyoruz
      window.api.off('post-exam-response', handleResponse)
    }

    window.api.receive('post-exam-response', handleResponse)
  }

  return { postData, response, error, loading }
}

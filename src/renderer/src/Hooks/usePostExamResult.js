import { useState } from 'react'

const usePostExamResult = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const postExamResult = (data) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    window.api.send('post-exam-result', { data })

    // 'exam-result-response' kanalından gelen yanıtları dinliyoruz
    const handleResponse = (response) => {
      if (response.error) {
        setError(response.error)
      } else {
        setSuccess(response.data.message)
      }
      setLoading(false)

      // Listener'ı temizliyoruz
      window.api.off('post-exam-result-response', handleResponse)
    }

    window.api.receive('post-exam-result-response', handleResponse)
  }

  return { postExamResult, loading, error, success }
}

export default usePostExamResult

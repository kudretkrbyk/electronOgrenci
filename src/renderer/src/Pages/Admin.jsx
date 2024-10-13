import { useState } from 'react'
import AdminExamsInput from '../Components/AdminExamsInput'
import AdminResultInput from '../Components/AdminResultInput'
import AdminStudentInput from '../Components/AdminStudentInput'
import useExamsData from '../Hooks/useExamsData'
import useStudentsData from '../Hooks/useStudentsData'
export default function Admin() {
  const { examsData, loading: examsLoading } = useExamsData()
  const { studentsData, loading: studentsLoading } = useStudentsData()
  const [activeComponent, setActiveComponent] = useState('student')
  console.log('admin sayfası sınavlar ve öğrenciler', examsData, studentsData)
  return (
    <div className="flex flex-col">
      {/* Header Butonları */}
      <div className="flex items-center justify-center gap-10">
        <button
          className={`p-2 px-4 rounded-2xl text-white ${
            activeComponent === 'student' ? 'bg-blue-700' : 'bg-blue-500'
          }`}
          onClick={() => setActiveComponent('student')}
        >
          Öğrenci Girişi
        </button>
        <button
          className={`p-2 px-4 rounded-2xl text-white ${
            activeComponent === 'exam' ? 'bg-blue-700' : 'bg-blue-500'
          }`}
          onClick={() => setActiveComponent('exam')}
        >
          Sınav Girişi
        </button>
        <button
          className={`p-2 px-4 rounded-2xl text-white ${
            activeComponent === 'result' ? 'bg-blue-700' : 'bg-blue-500'
          }`}
          onClick={() => setActiveComponent('result')}
        >
          Sınav Sonuç Girişi
        </button>
      </div>

      {/* Seçilen Bileşenin Gösterimi */}
      <div className="mt-8">
        {activeComponent === 'student' && <AdminStudentInput />}
        {activeComponent === 'exam' && <AdminExamsInput />}
        {activeComponent === 'result' && (
          <AdminResultInput
            examsData={examsData}
            studentsData={studentsData}
            examsLoading={examsLoading}
            studentsLoading={studentsLoading}
          />
        )}
      </div>
    </div>
  )
}

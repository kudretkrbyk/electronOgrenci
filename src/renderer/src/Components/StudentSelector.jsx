import React from 'react'

export default function StudentSelector({ studentsData, selectedStudent, setSelectedStudent }) {
  return (
    <div className="p-1">
      <h1 className="text-2xl font-bold mb-5">Öğrenci Seçimi</h1>
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
  )
}

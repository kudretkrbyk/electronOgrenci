import { HashRouter as Router, Route, Routes } from 'react-router-dom'

import Admin from './Pages/Admin'
import Home from './Pages/Home'
import Sonuclar from './Pages/Sonuclar'
import Students from './Pages/Students'
import Exams from './Pages/Exams'
import HomeNavbar from './Components/HomeNavbar'
import Report from './Pages/Report'

function App() {
  return (
    <div>
      <Router>
        <HomeNavbar />
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/Ogrenciler" element={<Students />} />
          <Route path="/Sinavlar" element={<Exams />} />
          <Route path="/Sonuclar" element={<Sonuclar />} /> {/* Genel erişim */}
          <Route path="/Sonuclar/:id" element={<Sonuclar />} /> {/* Belirli öğrenci ile erişim */}
          <Route path="/Rapor" element={<Report />} />
          <Route path="/Admin" element={<Admin />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

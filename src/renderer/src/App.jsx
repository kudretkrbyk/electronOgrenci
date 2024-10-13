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
        <HomeNavbar></HomeNavbar>
        <Routes>
          <Route path="*" element={<Home></Home>}></Route>
          <Route path="/Ogrenciler" element={<Students></Students>}></Route>
          <Route path="/Sinavlar" element={<Exams></Exams>}></Route>
          <Route path="/Sonuclar" element={<Sonuclar></Sonuclar>}></Route>
          <Route path="/Rapor" element={<Report></Report>}>
            {' '}
          </Route>
          <Route path="/Admin" element={<Admin></Admin>}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App

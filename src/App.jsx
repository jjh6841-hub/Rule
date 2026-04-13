import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MyLaws from './pages/MyLaws'
import Profile from './pages/Profile'
import LawDetail from './pages/LawDetail'

export default function App() {
  return (
    <BrowserRouter basename="/Rule">
      <div className="min-h-screen bg-[#f0f4f9]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-laws" element={<MyLaws />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/law/:id" element={<LawDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

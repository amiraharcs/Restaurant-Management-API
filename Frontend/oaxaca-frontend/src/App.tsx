import './css/App.css'
import Home from './Home'
import Menu from './Menu'
import Login from './Login'
import MainPage from "./Main_page"
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App

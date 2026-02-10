import './css/App.css'
import Menu from './Menu'
import Login from './Login'
import MainPage from "./Main_page"
import NavBar from "./data/components/NavBar"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Waiter from './Waiter'


function App() {

  return (

    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/waiter" element={<Waiter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import './css/App.css'
import Menu from './Menu'
import Login from './Login'
import MainPage from "./Main_page"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Waiter from './Waiter'
import Order from './order'


function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/waiter" element={<Waiter />} />
        <Route path='/order' element={<Order />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

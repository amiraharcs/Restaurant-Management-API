import './css/App.css'
import Home from './Home'
import Menu from './Menu'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App

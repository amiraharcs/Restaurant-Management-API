import './css/App.css'
import Menu from './Menu'
import Login from './Login'
import MainPage from "./Main_page"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Waiter from './Waiter'
import Kitchen from './Kitchen'
import Alerts from './Alerts'
import Order from './Order'
import TrackOrder from './TrackOrder'
import AboutUs from './AboutUs'
import ManageMenu from './ManageMenu'
import PastOrder from './PastOrder'
import ResetPassword from './ResetPassword'
import CreateAccount from './CreateAccount'


function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/waiter" element={<Waiter />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path='/order' element={<Order />} />
        <Route path='/track-order' element={<TrackOrder />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/manage-menu' element={<ManageMenu />} />
        <Route path='/past-order' element={<PastOrder />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/create-account' element={<CreateAccount />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

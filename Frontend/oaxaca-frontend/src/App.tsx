import './css/App.css'
import Menu from './Menu'
import Login from './Login'
import MainPage from "./Main_page"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Waiter from './Waiter'
import Kitchen from './Kitchen'
import Alerts from './Alerts'
import Order from './Order'
import TrackOrder from './TrackOrder'
import AboutUs from './AboutUs'
import PastOrder from './PastOrder'
import ResetPassword from './ResetPassword'
import CreateAccount from './CreateAccount'
import PaymentPage from './payment_page'
import Manager from './Manager'
import ManageMenuWaiter from './ManageMenuWaiter'
import ManageMenuManager from './ManageMenuManager'
import ManageMenuItemWaiter from '../src/data/components/ManageMenuItemWaiter'
import ManageMenuItemManager from '../src/data/components/ManageMenuItemManager'
import { getLoggedInStaffRole, getLoggedInStaffUsername } from './data/components/staffSession'

interface SecureRouteType {
  children: React.ReactNode;
  allowedRoles: string[];
};

function SecureRoute({ children, allowedRoles } : SecureRouteType) {
  const username = getLoggedInStaffUsername();
  const role = getLoggedInStaffRole();

  if (!username || !role) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>
}

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/waiter" element={
          <SecureRoute allowedRoles={["WAITER"]}>
            <Waiter />
          </SecureRoute>
        } />
        <Route path="/kitchen" element={
          <SecureRoute allowedRoles={["KITCHEN"]}>
            <Kitchen />
          </SecureRoute>
        } />
        <Route path="/alerts" element={
          <SecureRoute allowedRoles={["WAITER", "KITCHEN"]}>
            <Alerts />
          </SecureRoute>
        } />
        <Route path='/order' element={<Order />} />
        <Route path='/track-order' element={<TrackOrder />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path="/manage-menu-waiter" element={
          <SecureRoute allowedRoles={["WAITER"]}>
            <ManageMenuWaiter />
          </SecureRoute>
        } />
        <Route path="/manage-menu-manager" element={
          <SecureRoute allowedRoles={["MANAGER"]}>
            <ManageMenuManager />
          </SecureRoute>
        } />
        <Route path="/manage-menu-waiter/:id" element={
          <SecureRoute allowedRoles={["WAITER"]}>
            <ManageMenuItemWaiter />
          </SecureRoute>
        } />
        <Route path="/manage-menu-manager/:id" element={
          <SecureRoute allowedRoles={["MANAGER"]}>
            <ManageMenuItemManager />
          </SecureRoute>
        } />
        <Route path="/past-order" element={
          <SecureRoute allowedRoles={["WAITER", "KITCHEN"]}>
            <PastOrder />
          </SecureRoute>
        } />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/create-account' element={<CreateAccount />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path="/manager" element={
          <SecureRoute allowedRoles={["MANAGER"]}>
            <Manager />
          </SecureRoute>
        } />     
      </Routes>
    </BrowserRouter>
  )
}

export default App

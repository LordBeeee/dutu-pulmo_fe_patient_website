import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import VerifyOTP from './pages/Verify-otp/VerifyOTP'
import Home from './pages/Home/Home'
import MainLayout from './layouts/MainLayout'
import Profile from './pages/Profile/Profile'
import ForgotPassword from './pages/forgot-password/ForgotPassword'
import ResetPassword from './pages/Reset-password/ResetPassword'
import DoctorAppointment from './pages/Doctor-appointment/Doctor-appointment'
import Appointment from './pages/Appointment/Appointment'
import { http } from './services/http'
import { useEffect } from 'react'
import AppointmentConfirm from './pages/Appointment/AppointmentConfirm'
import AppointmentSuccess from './pages/Appointment/AppointmentSuccess'
import PaymentSuccess from './pages/Payment/PaymentSuccess'
import AppointmentSchedule from './pages/Appointment-Schedule/Appointment-Schedule'
import AppointmentScheduleDetail from './pages/Appointment-Schedule/Appointment-Schedule-Detail'
import Doctor from './pages/Doctor/Doctor'
import DoctorDetail from './pages/Doctor/Doctor-detail'
function App() {

  useEffect(() => {
    http.get("/") // hoặc endpoint khác
      .then(res => console.log("OK", res.data))
      .catch(err => console.log("ERR", err?.response?.status, err?.response?.data || err.message));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-OTP" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/doctor-appointment" element={<DoctorAppointment />} />
          <Route path="/appointment" element={<Appointment/>} />
          <Route path="/appointment-confirm" element={<AppointmentConfirm/>} />
          <Route path="/appointment-success" element={<AppointmentSuccess/>} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/appointment-schedule" element={<AppointmentSchedule />} />
          <Route path="/appointment-schedule/:id" element={<AppointmentScheduleDetail />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/doctor/:id" element={<DoctorDetail />} />
        </Route>

      </Routes>
    </BrowserRouter>

  )
}

export default App

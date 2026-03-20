import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'

import { useFcmToken } from '@/hooks/use-fcm-token'
import MainLayout from '@/layouts/MainLayout'
import { useAuthStore } from '@/store/auth.store'
import AIChatPage from '@/pages/AIChat/AIChatPage'
import Appointment from '@/pages/Appointment/Appointment'
import AppointmentConfirm from '@/pages/Appointment/AppointmentConfirm'
import AppointmentReviewPage from '@/pages/Appointment/AppointmentReview'
import AppointmentSuccess from '@/pages/Appointment/AppointmentSuccess'
import AppointmentSchedule from '@/pages/Appointment-Schedule/Appointment-Schedule'
import AppointmentScheduleDetail from '@/pages/Appointment-Schedule/Appointment-Schedule-Detail'
import ChangePasswordPage from '@/pages/Change-password/ChangePassword'
import ChatPage from '@/pages/Chat/Chat'
import Doctor from '@/pages/Doctor/Doctor'
import DoctorDetail from '@/pages/Doctor/Doctor-detail'
import FavoritesPage from '@/pages/Favorites/Favorites'
import ForgotPassword from '@/pages/Forgot-password/ForgotPassword'
import Home from '@/pages/Home/Home'
import HospitalDetailPage from '@/pages/Hospital/Hospital-detail'
import HospitalsPage from '@/pages/Hospital/Hospitals'
import Login from '@/pages/Login/Login'
import MedicalRecordDetailPage from '@/pages/Medical-records/MedicalRecord-detail'
import MedicalRecordsPage from '@/pages/Medical-records/MedicalRecords'
import MyReviewsPage from '@/pages/My-reviews/MyReviews'
import NewReportPage from '@/pages/Reports/NewReport'
import NewsPage from '@/pages/News/News'
import NewsDetail from '@/pages/News/NewsDetail'
import NotificationsPage from '@/pages/Notifications/Notifications'
import PaymentSuccess from '@/pages/Payment/PaymentSuccess'
import PaymentPage from '@/pages/Payment/Payment'
import PrescriptionDetailPage from '@/pages/Prescriptions/Prescription-detail'
import PrescriptionsPage from '@/pages/Prescriptions/Prescriptions'
import Profile from '@/pages/Profile/Profile'
import Register from '@/pages/Register/Register'
import ReportsPage from '@/pages/Reports/Reports'
import ResetPassword from '@/pages/Reset-password/ResetPassword'
import SettingsPage from '@/pages/Settings/Settings'
import SpecialtiesPage from '@/pages/Specialties/Specialties'
import SupportPage from '@/pages/Support/Support'
import VideoCallPage from '@/pages/Video-call/VideoCall'
import VerifyOTP from '@/pages/Verify-otp/VerifyOTP'

function RequireAuth() {
  const hydrated = useAuthStore((state) => state.hydrated)
  const accessToken = useAuthStore((state) => state.accessToken)

  if (!hydrated) {
    return null
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

function RedirectIfAuthenticated() {
  const accessToken = useAuthStore((state) => state.accessToken)

  if (accessToken) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

function NotificationHandler() {
  const accessToken = useAuthStore((state) => state.accessToken)
  useFcmToken(!!accessToken)
  return null
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <NotificationHandler />
      <Routes>
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-OTP" element={<VerifyOTP />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/doctor-appointment" element={<Navigate to="/doctor" replace />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/appointment-confirm" element={<AppointmentConfirm />} />
            <Route path="/appointment-success" element={<AppointmentSuccess />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/return" element={<PaymentSuccess />} />
            <Route path="/appointment-schedule" element={<AppointmentSchedule />} />
            <Route path="/appointment-schedule/:id" element={<AppointmentScheduleDetail />} />
            <Route path="/doctor" element={<Doctor />} />
            <Route path="/doctor/:id" element={<DoctorDetail />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:chatroomId" element={<ChatPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/hospitals/:id" element={<HospitalDetailPage />} />
            <Route path="/medical-records" element={<MedicalRecordsPage />} />
            <Route path="/medical-records/:recordId" element={<MedicalRecordDetailPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/appointments/review" element={<AppointmentReviewPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/my-reviews" element={<MyReviewsPage />} />
            <Route path="/prescriptions" element={<PrescriptionsPage />} />
            <Route path="/prescriptions/:prescriptionId" element={<PrescriptionDetailPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/new" element={<NewReportPage />} />
            <Route path="/specialties" element={<SpecialtiesPage />} />
            <Route path="/chat-ai" element={<AIChatPage />} />
            <Route path="/video-call/:appointmentId" element={<VideoCallPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

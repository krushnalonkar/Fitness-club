import React from "react"
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import AdminLogin from './Pages/AdminLogin'
import UserDashboard from './Pages/UserDashboard'
import AdminDashboard from './Pages/AdminDashboard'
import ManageUsers from './Pages/ManageUsers'
import ManageTestimonials from './Pages/ManageTestimonials'
import ManagePlans from './Pages/ManagePlans'
import ManageTrainers from './Pages/ManageTrainers'
import ManageInquiries from './Pages/ManageInquiries'
import AdminUserDetails from './Pages/AdminUserDetails'
import ForgotPassword from './Pages/ForgotPassword'
import ResetPassword from './Pages/ResetPassword'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import TermsOfService from './Pages/TermsOfService'
import Support from './Pages/Support'
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import Chatbot from "./Components/Chatbot"
import ProtectedRoute from "./Components/ProtectedRoute"
import ScrollToTop from "./Components/ScrollToTop"

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div>
      <ScrollToTop />
      {!isAdminPath && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/admin/login' element={<AdminLogin />} />

        {/* Protected User Routes */}
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path='/admin/dashboard' element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path='/admin/users' element={
          <ProtectedRoute adminOnly={true}>
            <ManageUsers />
          </ProtectedRoute>
        } />
        <Route path='/admin/users/:id' element={
          <ProtectedRoute adminOnly={true}>
            <AdminUserDetails />
          </ProtectedRoute>
        } />
        <Route path='/admin/trainers' element={
          <ProtectedRoute adminOnly={true}>
            <ManageTrainers />
          </ProtectedRoute>
        } />
        <Route path='/admin/plans' element={
          <ProtectedRoute adminOnly={true}>
            <ManagePlans />
          </ProtectedRoute>
        } />
        <Route path='/admin/testimonials' element={
          <ProtectedRoute adminOnly={true}>
            <ManageTestimonials />
          </ProtectedRoute>
        } />
        <Route path='/admin/inquiries' element={
          <ProtectedRoute adminOnly={true}>
            <ManageInquiries />
          </ProtectedRoute>
        } />

        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token?' element={<ResetPassword />} />

        {/* Support & Legal Routes */}
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/terms-of-service' element={<TermsOfService />} />
        <Route path='/support' element={<Support />} />
      </Routes>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <Chatbot />}
    </div>
  )
}

export default App

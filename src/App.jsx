import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

import './App.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";

import Navbar from './components/Navbar';
import Loader from './components/Loader';

import Home from './components/Home';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';

import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Forgot from './components/auth/Forgot';
import ResetPassword from './components/auth/ResetPassword';

import Dashboard from './components/user/Dashboard';
import DashboardHome from './components/user/DashboardHome';
import Profile from './components/user/Profile';
import Vacancies from './components/user/Vacancies';
import Applications from './components/user/Applications';
import Interviews from './components/user/Interviews';
import Offers from './components/user/Offers';

import AdminDashboard from './components/admin/AdminDashboard';
import AdminDashboardHome from './components/admin/DashboardHome';
import Companies from './components/admin/Companies';
import StudentsApplications from './components/admin/Students';
import AdminProfile from './components/admin/Profile';

import Inbox from './pages/Inbox';
import VideoMeet from './pages/VideoMeet';

import StudentDashboard from './components/user/student/Dashboard'

import Cookies from 'js-cookie';

/* ---------------- APP WRAPPER ---------------- */

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

/* ---------------- MAIN CONTENT ---------------- */

function AppContent() {
  const location = useLocation();

  /* ---------- AUTH HELPERS ---------- */

  const isTokenExpired = () => {
    const token = Cookies.get('userToken');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const isLoggedIn = !isTokenExpired();

  /* ---------- AUTO LOGOUT ---------- */

  useEffect(() => {
    const token = Cookies.get('userToken');
    if (!token) return;

    const publicPaths = [
      '/',
      '/login',
      '/register',
      '/forgotPassword',
      '/reset-password',
      '/aboutUs',
      '/help'
    ];

    if (publicPaths.includes(location.pathname)) return;

    if (isTokenExpired()) {
      alert('Your session has expired. Please login again.');
      Cookies.remove('userToken');
      window.location.href = '/login';
    }
  }, [location.pathname]);

  /* ---------- ROUTE GUARDS ---------- */

  const PublicRoute = ({ element }) =>
    !isLoggedIn ? element : <Navigate to="/user/dashboard" />;

  const PrivateRoute = ({ element }) =>
    isLoggedIn ? element : <Navigate to="/login" />;

  /* ---------- NAVBAR LOGIC (IMPORTANT) ---------- */

  const shouldHideNavbar = () => {
    const path = location.pathname;

    if (path.startsWith('/user')) return true;
    if (path.startsWith('/admin')) return true;
    // if (path.startsWith('/meet')) return true;

    return false;
  };

  /* ---------------- JSX ---------------- */

  return (
    <div className="App">
      <Loader />

      {/* NAVBAR */}
      {!shouldHideNavbar() && <Navbar />}

      {/* ROUTES */}
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<PublicRoute element={<Home />} />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />
        <Route path="/aboutUs" element={<PublicRoute element={<AboutUs />} />} />
        <Route path="/help" element={<PublicRoute element={<ContactUs />} />} />
        <Route path="/forgotPassword" element={<PublicRoute element={<Forgot />} />} />
        <Route path="/reset-password" element={<PublicRoute element={<ResetPassword />} />} />

        {/* VIDEO MEET (NO NAVBAR) */}
        <Route
          path="/meet/:roomId"
          element={<PrivateRoute element={<VideoMeet />} />}
        />

        {/* USER DASHBOARD */}
        <Route
          path="/user/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        >
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="vacancies" element={<Vacancies />} />
          <Route path="applications" element={<Applications />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="offers" element={<Offers />} />
        </Route>

        <Route
          path="/user/student/dashboard"
          element={<PrivateRoute element={<StudentDashboard />} />}
        >
          <Route path="inbox" element={<Inbox />} />

        </Route>

        {/* ADMIN DASHBOARD */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="companies" element={<Companies />} />
          <Route path="students" element={<StudentsApplications />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

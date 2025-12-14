import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/user/Dashboard';
import Forgot from './components/auth/Forgot';
import ResetPassword from './components/auth/ResetPassword';
import Loader from './components/Loader';
import Profile from './components/user/Profile';
import DashboardHome from './components/user/DashboardHome';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminDashboardHome from './components/admin/DashboardHome';
import CompaniesApplications from './components/admin/CompaniesApplications';
import StudentsApplications from './components/admin/Students';
import Companies from './components/admin/Companies';
import AdminProfile from './components/admin/Profile';
import Vacancies from './components/user/Vacancies';
import Applications from './components/user/Applications';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Interviews from './components/user/Interviews';
import Offers from './components/user/Offers';
import Inbox from './pages/Inbox';
import Cookies from 'js-cookie';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const locationPath = useLocation();

  const getCookie = (name) => {
    return Cookies.get(name);
  };

  const isTokenExpired = () => {
    const token = getCookie('userToken');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return expiry < Date.now();
    } catch (e) {
      return true;
    }
  };

  const validAuth = () => {
    return !isTokenExpired();
  };

  const isLoggedIn = validAuth();

  useEffect(() => {
    const token = Cookies.get("userToken");

    if (!token) return;

    const publicPaths = ["/login", "/register", "/forgotPassword", "/reset-password", "/help", "aboutUs"];
    if (publicPaths.includes(window.location.pathname)) return;

    if (isTokenExpired()) {
      alert("Your session has expired. Please log in again.");
      Cookies.remove("userToken");
      window.location.href = "/login";
    }
  }, []);

  const PublicRoute = ({ element }) => {
    return !isLoggedIn ? element : <Navigate to="/user/dashboard" />;
  };

  const PrivateRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to='/login' />;
  };

  return (
    <div className="App">
      <Loader />
      {locationPath.pathname !== '/user' && !locationPath.pathname.startsWith('/user') && <Navbar />
        && locationPath.pathname !== '/admin' && !locationPath.pathname.startsWith('/admin') && <Navbar />}

      <Routes>
        <Route path='/' element={<PublicRoute element={<Home />} />} />
        <Route path='/register' element={<PublicRoute element={<Register />} />} />
        <Route path='/login' element={<PublicRoute element={<Login />} />} />
        <Route path='/aboutUs' element={<PublicRoute element={<AboutUs />} />} />
        <Route path='/help' element={<PublicRoute element={<ContactUs />} />} />
        <Route path='/forgotPassword' element={<PublicRoute element={<Forgot />} />} />
        <Route path='/reset-password' element={<PublicRoute element={<ResetPassword />} />} />
        <Route path='/user/dashboard' element={<PrivateRoute element={<Dashboard />} />}>
          <Route index element={<DashboardHome />} />
          <Route path='profile' element={<Profile />} />
          <Route path='vacancies' element={<Vacancies />} />
          <Route path='applications' element={<Applications />} />
          <Route path='interviews' element={<Interviews />} />
          <Route path='inbox' element={<Inbox />} />
          <Route path='offers' element={<Offers />} />
        </Route>

        <Route path='/admin/dashboard' element={<AdminDashboard />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path='companies' element={<Companies />} />
          <Route path='students' element={<StudentsApplications />} />
          <Route path='inbox' element={<Inbox />} />
          <Route path='profile' element={<AdminProfile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import User from './pages/User';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import ConfirmEmail from './pages/ConfirmEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminLogs from './pages/AdminLogs';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('session');
    setUser(null);
  };

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session?.token) setUser(session);
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar user={user} handleLogout={handleLogout} />

      <div className="pt-20">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin' : '/user'} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/login"
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />

          {/* Protected Routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute user={user} role="user">
                <User handleLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} role="admin">
                <Admin handleLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute user={user} role="admin">
                <AdminLogs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

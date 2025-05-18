import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import User from './pages/User';
import Admin from './pages/Admin';
import Contact from './pages/Contact';

import Navbar from './components/Navbar';
import { useEffect, useState } from 'react';
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('session'));
    if (session) setUser(session);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('session');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="pt-16">
        <Routes>
          <Route
            path='/'
            element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/user') : '/login'} />}
          />
          <Route path="/contact" element={<Contact />} />

          <Route
            path='/login'
            element={!user ? <Login setUser={setUser} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/user'} />}
          />
          <Route
            path='/register'
            element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin' : '/user'} />}
          />
          <Route
            path='/home'
            element={<Home />}
          />
          <Route
            path='/user'
            element={user ? (user.role === 'user' ? <User handleLogout={handleLogout} /> : <Navigate to='/admin' />) : <Navigate to='/login' />}
          />
          <Route
            path='/admin'
            element={user ? (user.role === 'admin' ? <Admin handleLogout={handleLogout} /> : <Navigate to='/user' />) : <Navigate to='/login' />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}export default App;
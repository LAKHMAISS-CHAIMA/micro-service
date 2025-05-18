import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) return toast.error("Missing token or password");

    setLoading(true);
    try {
      await axios.post(`http://localhost:8000/users/reset-password?token=${token}`, {
        newPassword
      });

      toast.success('Password has been reset');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <form
        onSubmit={handleReset}
        className='bg-white p-6 rounded shadow-md w-full max-w-md'
      >
        <h2 className='text-xl font-bold mb-4 text-center text-cyan-600'>Reset Password</h2>

        <label className='block mb-2 font-medium'>New password</label>
        <input
          type='password'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className='w-full p-2 border rounded mb-4'
          required
        />

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700'
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

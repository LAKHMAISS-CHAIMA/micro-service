import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/users/forgot-password', { email });
      toast.success('Password reset link sent to your email');
      setEmail('');
    } catch (err) {
      toast.error('Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <form
        onSubmit={handleForgot}
        className='bg-white p-6 rounded shadow-md w-full max-w-md'
      >
        <h2 className='text-xl font-bold mb-4 text-center text-cyan-600'>Forgot Password</h2>

        <label className='block mb-2 font-medium'>Your email</label>
        <input
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='w-full p-2 border rounded mb-4'
          required
        />

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700'
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

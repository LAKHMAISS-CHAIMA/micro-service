import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token');

  const handleConfirm = async () => {
    if (!newEmail || !token) {
      toast.error("Missing token or email");
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`http://localhost:8000/users/confirm-email-update?token=${token}`, {
        email: newEmail
      }, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('session'))?.token}`,
        }
      });

      toast.success("Email updated successfully!");
      navigate('/profile');
    } catch (err) {
      toast.error("Failed to confirm email update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
      <div className='bg-white p-6 rounded shadow-md w-full max-w-md'>
        <h2 className='text-xl font-bold text-center mb-4 text-cyan-600'>Confirm Email Update</h2>

        <label className='block mb-2 font-medium'>Enter your new email</label>
        <input
          type='email'
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          className='w-full p-2 border rounded mb-4'
          placeholder='yournewemail@example.com'
        />

        <button
          onClick={handleConfirm}
          disabled={loading}
          className='bg-cyan-600 text-white px-4 py-2 rounded w-full hover:bg-cyan-700'
        >
          {loading ? 'Processing...' : 'Confirm Change'}
        </button>
      </div>
    </div>
  );
};

export default ConfirmEmail;

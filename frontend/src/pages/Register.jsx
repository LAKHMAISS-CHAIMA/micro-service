import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../validation/authValidation';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:8000/auth/register', data, {
        withCredentials: true,
      });

      toast.success("Registration successful!");
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-96 bg-white shadow-md p-6 rounded'>
        <h2 className='text-3xl font-semibold text-center mb-6'>Create Account</h2>

        <input {...register('username')} placeholder='Username'
          className='w-full mb-4 p-2 border rounded' />
        {errors.username && <p className='text-red-500 text-sm'>{errors.username.message}</p>}

        <input {...register('email')} placeholder='Email'
          className='w-full mb-4 p-2 border rounded' />
        {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}

        <input {...register('password')} type='password' placeholder='Password'
          className='w-full mb-4 p-2 border rounded' />
        {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}

        <input {...register('confirmPassword')} type='password' placeholder='Confirm Password'
          className='w-full mb-4 p-2 border rounded' />
        {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}

        <select {...register('role')} className='w-full mb-4 p-2 border rounded'>
          <option value='user'>User</option>
          <option value='admin'>Admin</option>
        </select>
        {errors.role && <p className='text-red-500 text-sm'>{errors.role.message}</p>}

        <button type='submit' className='bg-cyan-600 w-full py-2 text-white rounded'>
          Register
        </button>

        {message && <p className='text-red-500 text-sm mt-4'>{message}</p>}
      </form>
    </div>
  );
};

export default Register;

import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../validation/authValidation';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('http://localhost:8000/auth/login', data, {
        withCredentials: true,
      });

      const user = res.data;
      setUser(user);

      toast.success('Login successful!');
      if (user.role === 'admin') navigate('/admin');
      else navigate('/user');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-96 bg-white shadow-md p-6 rounded'>
        <h2 className='text-3xl font-semibold text-center mb-6'>Login</h2>

        <input {...register('email')} type='email' placeholder='Email'
          className='w-full mb-4 p-2 border rounded' />
        {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}

        <input {...register('password')} type='password' placeholder='Password'
          className='w-full mb-4 p-2 border rounded' />
        {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}

        <button type='submit' className='bg-cyan-600 w-full py-2 text-white rounded'>
          Login
        </button>

        {message && <p className='text-red-500 text-sm mt-4'>{message}</p>}
      </form>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../validation/authValidation';
import { toast } from 'react-hot-toast';

const Login = ({ setUser }) => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(
      (u) => u.email === data.email && u.password === data.password
    );

    if (user) {
      if (data.remember) {
        localStorage.setItem('session', JSON.stringify(user));
      } else {
        sessionStorage.setItem('session', JSON.stringify(user));
      }

      setUser(user);
      toast.success('Login successful!');

      user.role === 'admin' ? navigate('/admin') : navigate('/home');
    } else {
      setMessage('Invalid credentials');
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='relative flex w-96 flex-col rounded-xl bg-white text-gray-700 shadow-md mx-auto my-10 px-6 py-8'
      >
        <h2 className='text-3xl font-semibold text-center mb-6'>Login</h2>

        <div className='mb-4'>
          <label className='block mb-2 text-sm font-medium text-gray-900'>Email</label>
          <input
            {...register('email')}
            type='email'
            placeholder='you@example.com'
            className='w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500'
          />
          {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
        </div>

        <div className='mb-4'>
          <label className='block mb-2 text-sm font-medium text-gray-900'>Password</label>
          <input
            {...register('password')}
            type='password'
            placeholder='••••••••'
            className='w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500'
          />
          {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
        </div>

        <div className='mb-4 flex items-center'>
          <input
            id='remember'
            type='checkbox'
            {...register('remember')}
            className='h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded'
          />
          <label htmlFor='remember' className='ml-2 block text-sm text-gray-900'>
            Remember me
          </label>
        </div>

        <button
          type='submit'
          className='block w-full rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 py-3 text-xs font-bold uppercase text-white shadow-md hover:shadow-lg'
        >
          Login
        </button>

        {message && <p className='text-sm text-center text-red-500 mt-4'>{message}</p>}

        <p className='mt-6 text-center text-sm font-light'>
          Don't have an account?
          <a href='/register' className='ml-1 font-bold text-cyan-500 hover:underline'>
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;

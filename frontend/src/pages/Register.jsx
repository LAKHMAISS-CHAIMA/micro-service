import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../validation/authValidation';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

  const onSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const emailExists = users.some((u) => u.email === data.email);
    if (emailExists) {
      setMessage('This email is already in use.');
      return;
    }

    users.push(data);
    localStorage.setItem('users', JSON.stringify(users));
    setMessage('Registration successful! Redirecting...');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='relative flex w-96 flex-col rounded-xl bg-white text-gray-700 shadow-md mx-auto my-10 px-6 py-8'
      >
        <h2 className='text-3xl font-semibold text-center mb-6'>Create Account</h2>

        <div className='mb-4'>
          <label className='block mb-2 text-sm font-medium text-gray-900'>Username</label>
          <input
            {...register('username')}
            type='text'
            placeholder='Your username'
            className='w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500'
          />
          {errors.username && <p className='text-red-500 text-sm'>{errors.username.message}</p>}
        </div>

        <div className='mb-4'>
          <label className='block mb-2 text-sm font-medium text-gray-900'>Email</label>
          <input
            {...register('email')}
            type='email'
            placeholder='you@example.com'
            className='w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500'
          />
          {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
        </div>

        <div className='mb-4'>
          <label className='block mb-2 text-sm font-medium text-gray-900'>Password</label>
          <input
            {...register('password')}
            type='password'
            placeholder='••••••••'
            className='w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500'
          />
          {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
        </div>

        <div className='mb-4'>
          <label className='block mb-2 text-sm font-medium text-gray-900'>Confirm Password</label>
          <input
            {...register('confirmPassword')}
            type='password'
            placeholder='••••••••'
            className='w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500'
          />
          {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}
        </div>

        <div className='mb-6'>
          <label className='block mb-2 text-sm font-medium text-gray-900'>Role</label>
          <select
            {...register('role')}
            defaultValue='user'
            className='w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500'
          >
            <option value='user'>User</option>
            <option value='admin'>Admin</option>
          </select>
          {errors.role && <p className='text-red-500 text-sm'>{errors.role.message}</p>}
        </div>

        <button
          type='submit'
          className='block w-full rounded-lg bg-gradient-to-tr from-cyan-600 to-cyan-400 py-3 text-xs font-bold uppercase text-white shadow-md hover:shadow-lg'
        >
          Register
        </button>
        {message && <p className='text-sm text-center text-cyan-600 mt-4'>{message}</p>}

        <p className='mt-6 text-center text-sm font-light'>
          Already have an account?
          <a href='/login' className='ml-1 font-bold text-cyan-500 hover:underline'>
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;

import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  username: Yup.string().required('Username is required').min(3),
  email: Yup.string().required('Email is required').email('Invalid email format'),
  password: Yup.string().required('Password is required').min(6, 'Minimum 6 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  role: Yup.string().required('Role is required').oneOf(['user', 'admin']),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Invalid email'),
  password: Yup.string().required('Password is required'),
});

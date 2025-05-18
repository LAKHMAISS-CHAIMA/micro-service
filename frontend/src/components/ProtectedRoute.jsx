import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, role, children }) => {
  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} />;
  }

  return children;
};

export default ProtectedRoute;

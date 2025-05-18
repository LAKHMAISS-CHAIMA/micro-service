import { Link } from 'react-router-dom';

const Navbar = ({ user, handleLogout }) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-cyan-600 to-cyan-400 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-cyan-200 mb-2 md:mb-0">
          MyApp
        </Link>

        <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 items-center">
          <Link to="/home" className="text-lg font-medium hover:text-cyan-200">
            Home
          </Link>

          {user?.role === 'user' && (
            <>
              <Link to="/user" className="text-lg font-medium hover:text-cyan-200">
                User
              </Link>
              <Link to="/profile" className="text-lg font-medium hover:text-cyan-200">
                Profile
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Link to="/admin" className="text-lg font-medium hover:text-cyan-200">
                Admin
              </Link>
              <Link to="/admin/logs" className="text-lg font-medium hover:text-cyan-200">
                Logs
              </Link>
            </>
          )}

          <Link to="/contact" className="text-lg font-medium hover:text-cyan-200">
            Contact
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="text-lg font-medium hover:text-cyan-200">
                Login
              </Link>
              <Link to="/register" className="text-lg font-medium hover:text-cyan-200">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 rounded bg-white text-cyan-600 hover:bg-cyan-100"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

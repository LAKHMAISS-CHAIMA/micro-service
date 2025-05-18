import LogoutButton from "../components/LogoutButton";

function Admin({ handleLogout }) {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600 rounded-full opacity-30 blur-xl animate-ping" />
      <div className="absolute bottom-10 right-10 w-36 h-36 bg-cyan-500 rounded-full opacity-20 blur-xl animate-pulse" />
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-2xl shadow-xl text-center max-w-md mx-4">
        <h1 className="text-4xl font-bold text-white drop-shadow">Bonjour Admin !</h1>
      </div>
      <LogoutButton handleLogout={handleLogout} />
    </div>
  );
}

export default Admin;
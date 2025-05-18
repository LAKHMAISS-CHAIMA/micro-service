import LogoutButton from "../components/LogoutButton";

function User({ handleLogout }) {
  return (
    <div className="h-screen w-full bg-gradient-to-tr from-cyan-700 via-cyan-500 to-teal-400 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full blur-xl animate-ping"></div>
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-10 rounded-2xl shadow-xl text-center max-w-md mx-4">
        <h1 className="text-4xl font-bold text-white drop-shadow">Bonjour utilisateur !</h1>
      </div>
      <LogoutButton handleLogout={handleLogout} />
    </div>
  );
}

export default User;
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const LogoutButton = ({ handleLogout }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("session");
    if (handleLogout) {
      handleLogout();
    }
    toast.success("Déconnexion réussie !");
    navigate("/login");
  };

  return (
    <div
      className="absolute top-6 right-6 group cursor-pointer"
      onClick={onLogout}
    >
      <div className="relative px-6 py-3 border-2 border-blue-500 text-blue-500 font-bold text-sm md:text-lg rounded-lg transform transition-all duration-300 group-hover:translate-y-1 group-hover:translate-x-1 shadow-[6px_6px_10px_rgba(0,0,0,0.6),-6px_-6px_10px_rgba(255,255,255,0.1)] group-hover:shadow-[8px_8px_15px_rgba(0,0,0,0.8),-8px_-8px_15px_rgba(255,255,255,0.15)]">
        Logout
      </div>

      <div className="absolute inset-0 border-2 border-dashed border-blue-500 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping shadow-lg"></div>
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-ping shadow-lg"></div>
      <div className="absolute top-1/3 left-3 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-70"></div>
      <div className="absolute top-2/3 right-3 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-70"></div>
    </div>
  );
};

export default LogoutButton;
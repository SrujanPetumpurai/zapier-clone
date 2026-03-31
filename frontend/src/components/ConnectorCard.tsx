import { PROVIDER_CONFIG } from "@/app/config";
import axios from "axios";
export default function ConnectorCard({
  icon, name, isConnected, providerId, onDisconnect
}: {
  icon: string;
  name: string;
  providerId: string;
  isConnected: boolean;
  onDisconnect: () => void;
}) {
  const handleConnect = async () => {
    const config = PROVIDER_CONFIG[providerId];
    const token = localStorage.getItem('token')
    const response = await axios.get(`${config.connectUrl}`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    }) 
    window.location.href= response.data.url;
}

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <img src={icon} alt={name} className="w-8 h-8" />
        <span className="font-medium">{name}</span>
      </div>
      <button
        onClick={isConnected ? onDisconnect : handleConnect}
        className={`px-4 py-1.5 rounded-full text-sm font-medium ${
          isConnected
            ? "border border-red-400 text-red-400 hover:bg-red-50"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}
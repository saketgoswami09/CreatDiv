import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ label = "Back" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="group flex items-center gap-2 text-[13px] font-semibold text-slate-500 hover:text-slate-900 transition-colors focus:outline-none"
    >
      <div className="flex items-center justify-center p-1.5 rounded-lg border border-transparent group-hover:border-slate-200 group-hover:bg-slate-50 transition-all">
        {/* Arrow slides left slightly on hover for that premium feel */}
        <ArrowLeft 
          size={16} 
          className="transition-transform duration-200 ease-in-out group-hover:-translate-x-0.5" 
        />
      </div>
      <span>{label}</span>
    </button>
  );
}
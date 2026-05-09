import { AlertCircle, CheckCircle, X } from 'lucide-react';
const Alert = ({ type = 'error', message, onClose }) => {
  const config = {
    error: { bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle },
    success: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
  };
  const c = config[type] || config.error;
  const Icon = c.icon;
  return (
    <div className={`${c.bg} ${c.text} px-4 py-3 rounded-lg text-sm flex items-center justify-between`}>
      <span className="flex items-center gap-2"><Icon size={16} />{message}</span>
      {onClose && <button onClick={onClose}><X size={14} /></button>}
    </div>
  );
};
export default Alert;
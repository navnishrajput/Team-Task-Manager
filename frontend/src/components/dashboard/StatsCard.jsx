const StatsCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}><Icon className="text-white" size={22} /></div>
    <div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-gray-500">{label}</p></div>
  </div>
);
export default StatsCard;
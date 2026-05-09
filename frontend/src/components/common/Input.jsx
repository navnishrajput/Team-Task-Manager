const Input = ({ label, error, className = '', ...props }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" {...props} />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);
export default Input;
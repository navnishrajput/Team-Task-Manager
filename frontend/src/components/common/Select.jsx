const Select = ({ label, options, className = '', ...props }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" {...props}>
      {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
export default Select;
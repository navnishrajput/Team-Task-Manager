const priorityConfig = {
  LOW: { label: 'Low', classes: 'bg-gray-100 text-gray-600' },
  MEDIUM: { label: 'Medium', classes: 'bg-blue-100 text-blue-700' },
  HIGH: { label: 'High', classes: 'bg-orange-100 text-orange-700' },
  URGENT: { label: 'Urgent', classes: 'bg-red-100 text-red-700' },
};

const PriorityBadge = ({ priority }) => {
  const p = priorityConfig[priority] || priorityConfig.MEDIUM;
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.classes}`}>{p.label}</span>;
};
export default PriorityBadge;
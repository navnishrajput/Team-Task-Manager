const statusColors = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
};
const statusLabels = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };

const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[status] || statusColors.TODO}`}>
    {statusLabels[status] || status}
  </span>
);
export default StatusBadge;
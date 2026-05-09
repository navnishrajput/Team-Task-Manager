import PriorityBadge from '../common/PriorityBadge';
const OverdueTasksList = ({ tasks }) => (
  <div className="space-y-2">
    {tasks?.map(t => (
      <div key={t.id} className="flex justify-between items-center py-2 border-b last:border-0">
        <div><p className="text-sm font-medium">{t.title}</p><p className="text-xs text-red-500">Due: {new Date(t.dueDate).toLocaleDateString()}</p></div>
        <PriorityBadge priority={t.priority} />
      </div>
    ))}
  </div>
);
export default OverdueTasksList;
import PriorityBadge from '../common/PriorityBadge';
import { Calendar, User } from 'lucide-react';

const TaskCard = ({ task, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-1.5">
      <PriorityBadge priority={task.priority} />
      {task.overdue && <span className="text-xs text-red-500 font-bold">Overdue</span>}
    </div>
    <h4 className="font-medium text-sm text-gray-800 mb-1">{task.title}</h4>
    <p className="text-xs text-gray-400 line-clamp-2">{task.description}</p>
    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
      {task.assignee && <span className="flex items-center gap-1"><User size={12} />{task.assignee.name}</span>}
      {task.dueDate && <span className="flex items-center gap-1"><Calendar size={12} />{new Date(task.dueDate).toLocaleDateString()}</span>}
    </div>
  </div>
);
export default TaskCard;
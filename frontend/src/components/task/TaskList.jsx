import TaskCard from './TaskCard';
import EmptyState from '../common/EmptyState';

const TaskList = ({ tasks, onTaskClick }) => {
  if (!tasks?.length) return <EmptyState message="No tasks found" />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {tasks.map(task => <TaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />)}
    </div>
  );
};
export default TaskList;
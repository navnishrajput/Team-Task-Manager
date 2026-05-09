import { useState, useEffect } from 'react';
import { getTasksByProject, updateTaskStatus } from '../api/taskApi';
import { getAllProjects } from '../api/projectApi';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import EmptyState from '../components/common/EmptyState';
import { Calendar, GripVertical, Users } from 'lucide-react';

const KANBAN_COLUMNS = [
  { id: 'TODO', title: 'To Do', bg: 'bg-gray-50', headerBg: 'bg-gray-200' },
  { id: 'IN_PROGRESS', title: 'In Progress', bg: 'bg-blue-50', headerBg: 'bg-blue-200' },
  { id: 'DONE', title: 'Done', bg: 'bg-green-50', headerBg: 'bg-green-200' },
];

const KanbanBoard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getAllProjects();
        setProjects(data);
        if (data.length > 0) {
          setSelectedProjectId(data[0].id);
          fetchTasks(data[0].id);
        } else setLoading(false);
      } catch (err) { console.error(err); setLoading(false); }
    };
    fetchProjects();
  }, []);

  const fetchTasks = async (projectId) => {
    setLoading(true);
    try {
      const { data } = await getTasksByProject(projectId);
      setTasks(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId);
    if (projectId) fetchTasks(projectId);
  };

  const handleDrop = async (columnStatus) => {
    if (!draggedTask || draggedTask.status === columnStatus) return;
    try {
      await updateTaskStatus(selectedProjectId, draggedTask.id, columnStatus);
      setTasks(prev => prev.map(t => t.id === draggedTask.id ? { ...t, status: columnStatus } : t));
    } catch (err) { console.error(err); }
    setDraggedTask(null);
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : '';
  const getInitials = (n) => n?.split(' ').map(w => w[0]).join('').toUpperCase() || '?';
  const getTasksByStatus = (s) => tasks.filter(t => t.status === s);

  if (loading) return <Spinner fullScreen />;

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kanban Board</h1>
          <p className="text-sm text-gray-500">Drag and drop tasks between columns</p>
        </div>
        <select value={selectedProjectId} onChange={(e) => handleProjectChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">Select Project</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {!selectedProjectId ? (
        <EmptyState message="Select a project to view its Kanban board" />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {KANBAN_COLUMNS.map(column => (
            <div key={column.id} className="flex-1 min-w-[280px] max-w-[360px]"
              onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(column.id)}>
              <div className={`${column.headerBg} rounded-t-xl px-4 py-3 flex items-center justify-between`}>
                <h3 className="font-semibold text-sm text-gray-700">{column.title}</h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold">{getTasksByStatus(column.id).length}</span>
              </div>
              <div className={`${column.bg} rounded-b-xl p-3 space-y-2 min-h-[200px]`}>
                {getTasksByStatus(column.id).map(task => (
                  <div key={task.id} draggable onDragStart={() => setDraggedTask(task)}
                    className={`bg-white rounded-lg p-3 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow
                      ${task.overdue ? 'border-l-4 border-l-red-500' : ''}`}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <GripVertical size={12} className="text-gray-300" />
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <h4 className="font-medium text-sm text-gray-800 mb-1">{task.title}</h4>
                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      {task.assignee ? (
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                            {getInitials(task.assignee.name)}
                          </div>
                          <span className="text-gray-500">{task.assignee.name}</span>
                        </div>
                      ) : <span className="text-gray-400">Unassigned</span>}
                      {task.dueDate && <span className="text-gray-400 flex items-center gap-0.5"><Calendar size={11} />{formatDate(task.dueDate)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
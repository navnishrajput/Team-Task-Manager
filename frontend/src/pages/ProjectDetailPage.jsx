import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, addMember, removeMember, deleteProject } from '../api/projectApi';
import { getTasksByProject, createTask, updateTaskStatus, deleteTask, updateTask } from '../api/taskApi';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { 
  Plus, Trash2, UserPlus, UserMinus, Users, Calendar, 
  ArrowLeft, Edit3, GripVertical, Search, Eye, List, Columns3, AlertCircle, CheckCircle
} from 'lucide-react';

const TASK_STATUSES = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };
const PRIORITIES = {
  LOW: { label: 'Low', color: 'bg-gray-100 text-gray-700' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  HIGH: { label: 'High', color: 'bg-orange-100 text-orange-700' },
  URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-700' },
};
const KANBAN_COLUMNS = [
  { id: 'TODO', title: 'To Do', bg: 'bg-gray-50' },
  { id: 'IN_PROGRESS', title: 'In Progress', bg: 'bg-blue-50' },
  { id: 'DONE', title: 'Done', bg: 'bg-green-50' },
];

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban');
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
  
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [deleteProjectConfirm, setDeleteProjectConfirm] = useState(false);
  const [removeMemberId, setRemoveMemberId] = useState(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [draggedTask, setDraggedTask] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const isProjectAdmin = useCallback(() => {
    if (!project || !user) return false;
    const member = project.members?.find(m => m.id === user.id || m.email === user.email);
    return member?.role === 'ADMIN';
  }, [project, user]);

  const fetchProjectData = useCallback(async () => {
    setLoading(true);
    try {
      const [projRes, taskRes] = await Promise.all([getProjectById(id), getTasksByProject(id)]);
      setProject(projRes.data);
      const admin = projRes.data.members?.find(m => (m.id === user?.id || m.email === user?.email))?.role === 'ADMIN';
      if (admin) {
        setAllTasks(taskRes.data || []);
      } else {
        setAllTasks((taskRes.data || []).filter(t => t.assignee?.id === user?.id));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  }, [id, user, navigate]);

  useEffect(() => {
    if (user) fetchProjectData();
  }, [fetchProjectData, user]);

  const showMessage = (msg, type = 'success') => {
    if (type === 'success') { setSuccess(msg); setError(''); }
    else { setError(msg); setSuccess(''); }
    setTimeout(() => { setSuccess(''); setError(''); }, 4000);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) return;
    setActionLoading(true);
    setError('');
    try {
      await addMember(id, { email: memberEmail.trim() });
      setMemberEmail('');
      showMessage('Member added!');
      fetchProjectData();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to add member', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    setActionLoading(true);
    try {
      await removeMember(id, removeMemberId);
      showMessage('Member removed');
      setRemoveMemberId(null);
      fetchProjectData();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Cannot remove', 'error');
      setRemoveMemberId(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    setActionLoading(true);
    setError('');
    try {
      const payload = {
        title: taskForm.title.trim(),
        description: taskForm.description || '',
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || null,
        assigneeId: taskForm.assigneeId ? parseInt(taskForm.assigneeId) : null,
      };
      if (editingTask) {
        await updateTask(id, editingTask.id, payload);
        showMessage('Task updated!');
      } else {
        await createTask(id, payload);
        showMessage('Task created!');
      }
      setShowTaskModal(false);
      setEditingTask(null);
      setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
      fetchProjectData();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to save task', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(id, deleteTaskId);
      showMessage('Task deleted');
      setDeleteTaskId(null);
      fetchProjectData();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Cannot delete', 'error');
      setDeleteTaskId(null);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(id);
      setDeleteProjectConfirm(false);
      navigate('/projects');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Cannot delete', 'error');
      setDeleteProjectConfirm(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(id, taskId, newStatus);
      setAllTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      showMessage(`Status updated`);
    } catch (err) {
      showMessage(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const handleDrop = async (columnStatus) => {
    if (!draggedTask || draggedTask.status === columnStatus) return;
    if (!isProjectAdmin() && draggedTask.assignee?.id !== user?.id) {
      showMessage('You can only move your assigned tasks', 'error');
      return;
    }
    await handleStatusChange(draggedTask.id, columnStatus);
    setDraggedTask(null);
  };

  const handleEditTask = (task) => {
    if (!isProjectAdmin() && task.assignee?.id !== user?.id) {
      showMessage('You can only edit your assigned tasks', 'error');
      return;
    }
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate || '',
      assigneeId: task.assignee?.id || '',
    });
    setShowTaskModal(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setTaskForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
    setShowTaskModal(true);
  };

  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getTasksByStatus = (status) => filteredTasks.filter(t => t.status === status);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  if (loading) return <Spinner fullScreen />;
  if (!project) return <EmptyState message="Project not found" />;

  const admin = isProjectAdmin();

  return (
    <div className="p-4 lg:p-6">
      {/* Messages */}
      {success && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2"><CheckCircle size={16} />{success}</div>}
      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2"><AlertCircle size={16} />{error}</div>}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/projects')} className="p-2 hover:bg-gray-100 rounded-lg" title="Back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-sm text-gray-500">{project.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {!admin && (
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full flex items-center gap-1">
              <Eye size={14} /> Member View
            </span>
          )}
          {admin && (
            <>
              <button onClick={() => setShowMemberModal(true)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
                <UserPlus size={15} /> Members
              </button>
              <button onClick={openCreateModal} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5">
                <Plus size={15} /> Add Task
              </button>
              <button onClick={() => setDeleteProjectConfirm(true)} className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1.5">
                <Trash2 size={15} /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: allTasks.length, color: 'text-gray-700' },
          { label: 'To Do', value: allTasks.filter(t => t.status === 'TODO').length, color: 'text-gray-600' },
          { label: 'In Progress', value: allTasks.filter(t => t.status === 'IN_PROGRESS').length, color: 'text-blue-600' },
          { label: 'Done', value: allTasks.filter(t => t.status === 'DONE').length, color: 'text-green-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Users size={16} /> Team ({project.members?.length || 0})</h3>
          {admin && <button onClick={() => setShowMemberModal(true)} className="text-xs text-blue-600 hover:underline">Manage</button>}
        </div>
        <div className="flex flex-wrap gap-2">
          {project.members?.map(member => (
            <div key={member.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                {getInitials(member.name)}
              </div>
              <span className="text-sm text-gray-700">{member.name} {member.id === user?.id ? '(You)' : ''}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${member.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'}`}>{member.role}</span>
              {admin && member.role !== 'ADMIN' && (
                <button onClick={() => setRemoveMemberId(member.id)} className="text-red-400 hover:text-red-600"><UserMinus size={13} /></button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" placeholder="Search tasks..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="ALL">All Status</option>
          {Object.entries(TASK_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${viewMode === 'kanban' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500'}`}>
            <Columns3 size={14} /> Board
          </button>
          <button onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${viewMode === 'list' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500'}`}>
            <List size={14} /> List
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {KANBAN_COLUMNS.map(column => (
            <div key={column.id} className="flex-1 min-w-[280px] max-w-[360px]"
              onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(column.id)}>
              <div className={`${column.bg} rounded-xl p-3`}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-semibold text-sm text-gray-700">{column.title}</h3>
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-500">{getTasksByStatus(column.id).length}</span>
                </div>
                <div className="space-y-2 min-h-[120px]">
                  {getTasksByStatus(column.id).length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-6">No tasks</p>
                  ) : (
                    getTasksByStatus(column.id).map(task => (
                      <div key={task.id} 
                        draggable={admin || task.assignee?.id === user?.id}
                        onDragStart={() => setDraggedTask(task)}
                        onClick={() => handleEditTask(task)}
                        className={`bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow
                          ${(admin || task.assignee?.id === user?.id) ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
                          ${task.overdue ? 'border-l-4 border-l-red-500' : ''}`}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <GripVertical size={12} className="text-gray-300 flex-shrink-0" />
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITIES[task.priority]?.color || 'bg-gray-100 text-gray-700'}`}>
                            {PRIORITIES[task.priority]?.label || task.priority}
                          </span>
                          {task.overdue && <span className="text-[10px] text-red-500 font-bold">OVERDUE</span>}
                        </div>
                        <h4 className="font-medium text-sm text-gray-800 mb-1">{task.title}</h4>
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{task.description}</p>
                        <div className="flex items-center justify-between">
                          {task.assignee ? (
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                {getInitials(task.assignee.name)}
                              </div>
                              <span className="text-[11px] text-gray-500">{task.assignee.name}</span>
                            </div>
                          ) : <span className="text-[11px] text-gray-400">Unassigned</span>}
                          {task.dueDate && (
                            <span className={`text-[11px] flex items-center gap-0.5 ${task.overdue ? 'text-red-500' : 'text-gray-400'}`}>
                              <Calendar size={11} /> {formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border overflow-hidden">
          {filteredTasks.length === 0 ? (
            <EmptyState message={admin ? "No tasks yet. Create one!" : "No tasks assigned to you."} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500 text-xs uppercase">
                    <th className="px-4 py-3 font-semibold">Task</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Priority</th>
                    <th className="px-4 py-3 font-semibold">Assignee</th>
                    <th className="px-4 py-3 font-semibold">Due Date</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredTasks.map(task => {
                    const canEdit = admin || task.assignee?.id === user?.id;
                    return (
                      <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">{task.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{task.description}</p>
                        </td>
                        <td className="px-4 py-3">
                          {canEdit ? (
                            <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)}
                              className="text-xs border border-gray-200 rounded px-2 py-1">
                              {Object.entries(TASK_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                          ) : <StatusBadge status={task.status} />}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITIES[task.priority]?.color || ''}`}>
                            {PRIORITIES[task.priority]?.label || task.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {task.assignee ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">{getInitials(task.assignee.name)}</div>
                              <span className="text-gray-600 text-xs">{task.assignee.name}</span>
                            </div>
                          ) : <span className="text-gray-400 text-xs">-</span>}
                        </td>
                        <td className={`px-4 py-3 text-xs ${task.overdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                          {task.dueDate ? formatDate(task.dueDate) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          {canEdit && (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleEditTask(task)} className="p-1.5 hover:bg-blue-50 rounded text-blue-500"><Edit3 size={14} /></button>
                              {admin && <button onClick={() => setDeleteTaskId(task.id)} className="p-1.5 hover:bg-red-50 rounded text-red-400"><Trash2 size={14} /></button>}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Task Modal */}
      <Modal isOpen={showTaskModal} onClose={() => { setShowTaskModal(false); setEditingTask(null); }} title={editingTask ? 'Edit Task' : 'Create New Task'}>
        <form onSubmit={handleTaskSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-20 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
            <select value={taskForm.assigneeId} onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="">Unassigned</option>
              {project?.members?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <button type="submit" disabled={actionLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
            {actionLoading ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      </Modal>

      {/* Member Modal */}
      <Modal isOpen={showMemberModal} onClose={() => setShowMemberModal(false)} title="Manage Members">
        <form onSubmit={handleAddMember} className="space-y-3 mb-4">
          <label className="block text-sm font-medium text-gray-700">Add Member by Email</label>
          <div className="flex gap-2">
            <input type="email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)}
              className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="user@example.com" required />
            <button type="submit" disabled={actionLoading} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
              {actionLoading ? '...' : 'Add'}
            </button>
          </div>
        </form>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Members</h4>
          {project?.members?.map(m => (
            <div key={m.id} className="flex items-center justify-between py-2.5 border-b last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">{getInitials(m.name)}</div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{m.name} {m.id === user?.id ? '(You)' : ''}</p>
                  <p className="text-xs text-gray-400">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{m.role}</span>
                {admin && m.role !== 'ADMIN' && (
                  <button onClick={() => setRemoveMemberId(m.id)} className="p-1 hover:bg-red-50 rounded text-red-400"><UserMinus size={14} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Confirm Dialogs */}
      <ConfirmDialog isOpen={!!deleteTaskId} onClose={() => setDeleteTaskId(null)} onConfirm={handleDeleteTask} title="Delete Task" message="This task will be permanently deleted." />
      <ConfirmDialog isOpen={deleteProjectConfirm} onClose={() => setDeleteProjectConfirm(false)} onConfirm={handleDeleteProject} title="Delete Project" message="All tasks in this project will be permanently deleted." />
      <ConfirmDialog isOpen={!!removeMemberId} onClose={() => setRemoveMemberId(null)} onConfirm={handleRemoveMember} title="Remove Member" message="This member will lose access to the project." />
    </div>
  );
};

export default ProjectDetailPage;
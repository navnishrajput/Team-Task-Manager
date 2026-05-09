import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Columns3, Settings, X, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createProject } from '../../api/projectApi';
import Modal from '../common/Modal';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [creating, setCreating] = useState(false);

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/board', icon: Columns3, label: 'Kanban Board' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleNewProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    setCreating(true);
    try {
      const { data } = await createProject({ name: projectName, description: '' });
      setShowNewProject(false);
      setProjectName('');
      navigate(`/projects/${data.id}`);
      onClose();
    } catch (err) {
      alert('Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto flex flex-col`}>
        
        <div className="p-5 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <FolderKanban className="text-white" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-sm">TaskFlow</h2>
              <p className="text-xs text-gray-400">Team Manager</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={label}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive && to !== '#' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t">
          <div className="flex items-center gap-2 px-3 py-2 mb-3 bg-gray-50 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400">{user?.role}</p>
            </div>
          </div>
          <button onClick={() => setShowNewProject(true)} className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
            <Plus size={16} /> New Project
          </button>
        </div>
      </aside>

      {/* New Project Modal */}
      <Modal isOpen={showNewProject} onClose={() => setShowNewProject(false)} title="Create New Project">
        <form onSubmit={handleNewProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter project name"
              required
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowNewProject(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm">
              Cancel
            </button>
            <button type="submit" disabled={creating || !projectName.trim()} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Sidebar;
import { useState, useEffect } from 'react';
import { getAllProjects, createProject, deleteProject } from '../api/projectApi';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import { Plus, FolderKanban, Trash2, Users, Calendar } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const ProjectsPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProject(form);
      setShowModal(false);
      setForm({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      await deleteProject(id);
      fetchProjects();
    }
  };

  if (loading) return <Spinner fullScreen />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState message="No projects yet. Create your first project!" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="card hover:shadow-lg hover:shadow-blue-100 hover:border-blue-300 transition-all duration-200 cursor-pointer group border-2 border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FolderKanban className="text-blue-600" size={20} />
                </div>
                {isAdmin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{project.name}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{project.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Users size={14} /> {project.members?.length || 0}</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(project.createdAt)}</span>
                <span className="ml-auto bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                  {project.taskCount} tasks
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Project">
        {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="Website Redesign"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field h-24 resize-none"
              placeholder="Project description..."
            />
          </div>
          <button type="submit" className="btn-primary w-full">Create Project</button>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
import { FolderKanban, Users } from 'lucide-react';
const ProjectCard = ({ project, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-xl border p-5 cursor-pointer hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><FolderKanban className="text-blue-600" size={20} /></div>
    </div>
    <h3 className="font-semibold text-gray-800 mb-1">{project.name}</h3>
    <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
      <Users size={13} /> {project.members?.length || 0} members
    </div>
  </div>
);
export default ProjectCard;
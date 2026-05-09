import ProjectCard from './ProjectCard';
import EmptyState from '../common/EmptyState';
const ProjectList = ({ projects, onProjectClick }) => {
  if (!projects?.length) return <EmptyState message="No projects" />;
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{projects.map(p => <ProjectCard key={p.id} project={p} onClick={() => onProjectClick?.(p)} />)}</div>;
};
export default ProjectList;
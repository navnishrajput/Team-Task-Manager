import { FolderOpen } from 'lucide-react';
const EmptyState = ({ message = 'No data found', icon: Icon = FolderOpen }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <Icon size={56} strokeWidth={1.5} />
    <p className="mt-3 text-sm font-medium">{message}</p>
  </div>
);
export default EmptyState;
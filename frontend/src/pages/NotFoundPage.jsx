import { Link } from 'react-router-dom';
import { Home, FolderX } from 'lucide-react';

const NotFoundPage = () => (
  <div className="h-screen flex flex-col items-center justify-center text-center p-4">
    <FolderX size={64} className="text-gray-300 mb-4" />
    <h1 className="text-5xl font-bold text-gray-200 mb-2">404</h1>
    <p className="text-gray-500 mb-6">This page doesn't exist</p>
    <Link to="/dashboard" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium">
      <Home size={16} /> Go to Dashboard
    </Link>
  </div>
);
export default NotFoundPage;
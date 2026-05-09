import { useState, useEffect } from 'react';
import { getMyDashboard, getProjectDashboard } from '../api/dashboardApi';
import { getAllProjects } from '../api/projectApi';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import { ListTodo, Clock, CheckCircle2, AlertTriangle, FolderKanban } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const projRes = await getAllProjects();
      setProjects(projRes.data);
      if (projRes.data.length > 0) {
        setSelectedProjectId(projRes.data[0].id);
        const dashRes = await getProjectDashboard(projRes.data[0].id);
        setDashboard(dashRes.data);
      } else {
        const dashRes = await getMyDashboard();
        setDashboard(dashRes.data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleProjectChange = async (projectId) => {
    setSelectedProjectId(projectId);
    if (projectId) {
      const { data } = await getProjectDashboard(projectId);
      setDashboard(data);
    } else {
      const { data } = await getMyDashboard();
      setDashboard(data);
    }
  };

  if (loading) return <Spinner fullScreen />;

  const stats = [
    { label: 'Total Tasks', value: dashboard?.totalTasks || 0, icon: ListTodo, color: 'from-blue-500 to-blue-600' },
    { label: 'In Progress', value: dashboard?.inProgressTasks || 0, icon: Clock, color: 'from-amber-500 to-amber-600' },
    { label: 'Completed', value: dashboard?.doneTasks || 0, icon: CheckCircle2, color: 'from-green-500 to-green-600' },
    { label: 'Past Due', value: dashboard?.overdueTasks || 0, icon: AlertTriangle, color: 'from-red-500 to-red-600' },
  ];

  const chartData = [
    { name: 'To Do', value: dashboard?.todoTasks || 0, fill: '#9CA3AF' },
    { name: 'In Progress', value: dashboard?.inProgressTasks || 0, fill: '#3B82F6' },
    { name: 'Done', value: dashboard?.doneTasks || 0, fill: '#10B981' },
  ];
  const COLORS = ['#9CA3AF', '#3B82F6', '#10B981'];

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <select value={selectedProjectId} onChange={(e) => handleProjectChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">My Tasks</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border p-4 lg:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="text-white" size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Task Status Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                {chartData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Task Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value">
                {chartData.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-5 mt-2">
            {chartData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                {item.name}: {item.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent & Overdue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Recent Tasks</h3>
          {dashboard?.recentTasks?.length > 0 ? (
            <div className="space-y-2">
              {dashboard.recentTasks.slice(0, 6).map(task => (
                <div key={task.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-gray-700 truncate">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.projectName}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400 py-4 text-center">No tasks yet</p>}
        </div>

        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" /> Overdue Tasks
          </h3>
          {dashboard?.overdueTaskList?.length > 0 ? (
            <div className="space-y-2">
              {dashboard.overdueTaskList.map(task => (
                <div key={task.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-gray-700 truncate">{task.title}</p>
                    <p className="text-xs text-red-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400 py-4 text-center">No overdue tasks 🎉</p>}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
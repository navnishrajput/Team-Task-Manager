import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
const TasksByStatusChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip />
      <Bar dataKey="value" radius={[6,6,0,0]}>{data?.map((_,i) => <Cell key={i} fill={_.fill} />)}</Bar>
    </BarChart>
  </ResponsiveContainer>
);
export default TasksByStatusChart;
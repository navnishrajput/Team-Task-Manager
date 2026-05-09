import { UserMinus } from 'lucide-react';
const MemberList = ({ members, currentUserId, isAdmin, onRemove }) => (
  <div className="flex flex-wrap gap-2">
    {members?.map(m => (
      <div key={m.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">{m.name?.charAt(0)}</div>
        <span className="text-sm">{m.name} {m.id === currentUserId ? '(You)' : ''}</span>
        <span className="text-xs text-gray-400">{m.role}</span>
        {isAdmin && m.role !== 'ADMIN' && <button onClick={() => onRemove?.(m.id)} className="text-red-400"><UserMinus size={13} /></button>}
      </div>
    ))}
  </div>
);
export default MemberList;
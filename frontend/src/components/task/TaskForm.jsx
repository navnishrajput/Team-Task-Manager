const TaskForm = ({ form, setForm, members, onSubmit, onCancel, isEditing }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <input type="text" placeholder="Task title" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
      className="w-full px-3 py-2.5 border rounded-lg text-sm" required />
    <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
      className="w-full px-3 py-2.5 border rounded-lg text-sm h-20 resize-none" />
    <div className="grid grid-cols-2 gap-3">
      <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="border rounded-lg px-3 py-2.5 text-sm">
        <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
      </select>
      <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="border rounded-lg px-3 py-2.5 text-sm" />
    </div>
    <select value={form.assigneeId} onChange={e => setForm({...form, assigneeId: e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-sm">
      <option value="">Unassigned</option>
      {members?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
    </select>
    <div className="flex gap-2">
      <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium">{isEditing ? 'Update' : 'Create'}</button>
      <button type="button" onClick={onCancel} className="px-4 py-2.5 border rounded-lg text-sm">Cancel</button>
    </div>
  </form>
);
export default TaskForm;
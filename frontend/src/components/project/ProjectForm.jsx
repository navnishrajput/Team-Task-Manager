const ProjectForm = ({ form, setForm, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <input type="text" placeholder="Project name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
      className="w-full px-3 py-2.5 border rounded-lg text-sm" required />
    <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
      className="w-full px-3 py-2.5 border rounded-lg text-sm h-20 resize-none" />
    <div className="flex gap-2">
      <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium">Create</button>
      <button type="button" onClick={onCancel} className="px-4 py-2.5 border rounded-lg text-sm">Cancel</button>
    </div>
  </form>
);
export default ProjectForm;
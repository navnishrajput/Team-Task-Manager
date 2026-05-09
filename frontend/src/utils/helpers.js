export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'DONE') return false;
  return new Date(task.dueDate) < new Date();
};

export const getInitials = (name) => {
  return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
export const TASK_STATUSES = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export const PRIORITIES = {
  LOW: { label: 'Low', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  HIGH: { label: 'High', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

export const ROLES = {
  ADMIN: 'Admin',
  MEMBER: 'Member',
};

export const KANBAN_COLUMNS = [
  { id: 'TODO', title: 'To Do', color: 'bg-gray-100' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-50' },
  { id: 'DONE', title: 'Done', color: 'bg-green-50' },
];
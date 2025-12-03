import { Employee, Task, TaskPriority, TaskStatus } from './types';

export const EMPLOYEE_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500',
  'bg-pink-500', 'bg-cyan-500', 'bg-rose-500', 'bg-indigo-500',
  'bg-orange-500', 'bg-teal-500', 'bg-lime-500', 'bg-fuchsia-500',
  'bg-red-500', 'bg-violet-500', 'bg-sky-500', 'bg-yellow-500'
];

export const EMPLOYEES: Employee[] = [
  { id: '1', name: 'Sarah Chen', initials: 'SC', color: 'bg-blue-500' },
  { id: '2', name: 'Marcus Johnson', initials: 'MJ', color: 'bg-emerald-500' },
  { id: '3', name: 'Emily Rodriguez', initials: 'ER', color: 'bg-purple-500' },
  { id: '4', name: 'James Wilson', initials: 'JW', color: 'bg-amber-500' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Design new dashboard layout',
    description: 'Create wireframes and mockups for the updated admin dashboard emphasizing dark mode.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    dueDate: 'Dec 5',
    assigneeId: '2', // Marcus
  },
  {
    id: 't2',
    title: 'Implement user authentication',
    description: 'Set up JWT-based authentication with refresh tokens and secure local storage.',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.HIGH,
    dueDate: 'Nov 28',
    assigneeId: '1', // Sarah
  },
  {
    id: 't3',
    title: 'Write API documentation',
    description: 'Document all REST endpoints using OpenAPI specification v3.0.',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: 'Dec 10',
    assigneeId: '4', // James
  },
  {
    id: 't4',
    title: 'Review Q4 project timeline',
    description: 'Meet with stakeholders to discuss milestones and deliverables for the upcoming quarter.',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    dueDate: 'Today',
    assigneeId: '3', // Emily
  },
  {
    id: 't5',
    title: 'Fix mobile responsive issues',
    description: 'Address layout problems on tablet and mobile devices for the checkout flow.',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: 'Dec 8',
    assigneeId: '2', // Marcus
  },
  {
    id: 't6',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment workflows using GitHub Actions.',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    dueDate: 'Dec 15',
    assigneeId: '1', // Sarah
  },
];
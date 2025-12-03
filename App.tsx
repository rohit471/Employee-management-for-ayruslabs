import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  Menu,
  Sun
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import TaskCard from './components/TaskCard';
import NewTaskModal from './components/NewTaskModal';
import AddEmployeeModal from './components/AddEmployeeModal';
import { EMPLOYEES, INITIAL_TASKS, EMPLOYEE_COLORS } from './constants';
import { Task, TaskStatus, TaskPriority, Stats, Employee } from './types';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [priorityFilter, setPriorityFilter] = useState<string>('All Priority');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Derived state for filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All Priority' || task.priority === priorityFilter;
      const matchesEmployee = selectedEmployeeId === null || task.assigneeId === selectedEmployeeId;

      return matchesSearch && matchesStatus && matchesPriority && matchesEmployee;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, selectedEmployeeId]);

  // Derived state for statistics
  const stats: Stats = useMemo(() => {
    const sourceTasks = selectedEmployeeId ? tasks.filter(t => t.assigneeId === selectedEmployeeId) : tasks;
    return {
      total: sourceTasks.length,
      todo: sourceTasks.filter(t => t.status === TaskStatus.TODO).length,
      inProgress: sourceTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      completed: sourceTasks.filter(t => t.status === TaskStatus.COMPLETED).length,
    };
  }, [tasks, selectedEmployeeId]);

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(t => 
        t.id === editingTask.id ? { ...t, ...taskData } as Task : t
      ));
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: `t${Date.now()}`,
        status: taskData.status || TaskStatus.TODO,
        priority: taskData.priority || TaskPriority.MEDIUM,
      } as Task;
      setTasks([newTask, ...tasks]);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleAddEmployee = (name: string) => {
    const names = name.trim().split(' ');
    const initials = names.length > 1 
      ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
    
    // Pick a random color
    const color = EMPLOYEE_COLORS[Math.floor(Math.random() * EMPLOYEE_COLORS.length)];

    const newEmployee: Employee = {
      id: `e${Date.now()}`,
      name: name.trim(),
      initials,
      color
    };

    setEmployees([...employees, newEmployee]);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    
    // If the currently selected employee is deleted, reset view to All Tasks
    if (selectedEmployeeId === id) {
      setSelectedEmployeeId(null);
    }
  };

  const getEmployeeName = () => {
    if (!selectedEmployeeId) return "All Tasks";
    return employees.find(e => e.id === selectedEmployeeId)?.name || "Unknown";
  };

  return (
    <div className="flex h-screen bg-background text-slate-200">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        employees={employees} 
        selectedEmployeeId={selectedEmployeeId}
        onSelectEmployee={(id) => {
            setSelectedEmployeeId(id);
            setIsSidebarOpen(false);
        }}
        onNewTask={handleNewTask}
        onAddEmployee={() => setIsAddEmployeeModalOpen(true)}
        onDeleteEmployee={handleDeleteEmployee}
        isOpen={isSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-background/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{getEmployeeName()}</h2>
              <p className="text-xs text-slate-500">Overview of team workload</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer">
                <Sun size={20} />
             </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                label="Total Tasks" 
                count={stats.total} 
                icon={ClipboardList} 
                colorClass="text-blue-400" 
                bgClass="bg-blue-500/10" 
              />
              <StatCard 
                label="To Do" 
                count={stats.todo} 
                icon={AlertCircle} 
                colorClass="text-slate-400" 
                bgClass="bg-slate-500/10" 
              />
              <StatCard 
                label="In Progress" 
                count={stats.inProgress} 
                icon={Clock} 
                colorClass="text-indigo-400" 
                bgClass="bg-indigo-500/10" 
              />
              <StatCard 
                label="Completed" 
                count={stats.completed} 
                icon={CheckCircle2} 
                colorClass="text-emerald-400" 
                bgClass="bg-emerald-500/10" 
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex gap-4">
                <div className="relative min-w-[140px]">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none bg-background border border-slate-700 rounded-lg pl-9 pr-8 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option>All Status</option>
                    {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="relative min-w-[140px]">
                  <select 
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full appearance-none bg-background border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option>All Priority</option>
                    {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    assignee={employees.find(e => e.id === task.assigneeId)}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                    <ClipboardList className="text-slate-500" size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-white">No tasks found</h3>
                  <p className="text-slate-500 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <NewTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        employees={employees}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        initialTask={editingTask}
      />
      
      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
        onAdd={handleAddEmployee}
      />
    </div>
  );
};

export default App;
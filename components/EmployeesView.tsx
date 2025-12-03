import React from 'react';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { Employee, Task, TaskStatus } from '../types';

interface EmployeesViewProps {
  employees: Employee[];
  tasks: Task[];
  onAdd: () => void;
  onDelete: (id: string) => void;
}

const EmployeesView: React.FC<EmployeesViewProps> = ({ employees, tasks, onAdd, onDelete }) => {
  const getEmployeeStats = (empId: string) => {
    const empTasks = tasks.filter(t => t.assigneeId === empId);
    return {
      total: empTasks.length,
      active: empTasks.filter(t => t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.TODO).length,
      completed: empTasks.filter(t => t.status === TaskStatus.COMPLETED).length
    };
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Team Members</h2>
          <p className="text-slate-400 mt-1">Manage your team and monitor performance</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(emp => {
          const stats = getEmployeeStats(emp.id);
          return (
             <div key={emp.id} className="bg-surface border border-slate-700 rounded-xl p-6 relative group hover:border-slate-600 transition-all">
                {/* Content */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white ${emp.color} shadow-lg`}>
                        {emp.initials}
                    </div>
                     <button
                        onClick={() => {
                           if(window.confirm(`Are you sure you want to remove ${emp.name}?`)) onDelete(emp.id);
                        }}
                        className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove Employee"
                     >
                        <Trash2 size={18} />
                     </button>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">{emp.name}</h3>
                <p className="text-slate-500 text-sm mb-6 flex items-center gap-2">
                    <Briefcase size={14} />
                    Team Member
                </p>

                <div className="grid grid-cols-3 gap-2 border-t border-slate-700/50 pt-5">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mt-1">Total Tasks</div>
                    </div>
                     <div className="text-center border-l border-slate-700/50">
                        <div className="text-2xl font-bold text-blue-400">{stats.active}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mt-1">Active</div>
                    </div>
                     <div className="text-center border-l border-slate-700/50">
                        <div className="text-2xl font-bold text-emerald-400">{stats.completed}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mt-1">Completed</div>
                    </div>
                </div>
             </div>
          );
        })}
        
        {/* Empty State / Add Card */}
        <button 
          onClick={onAdd}
          className="bg-surface/30 border border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center
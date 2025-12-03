import React from 'react';
import { LayoutDashboard, Users, Plus, CheckSquare, Trash2 } from 'lucide-react';
import { Employee } from '../types';

interface SidebarProps {
  employees: Employee[];
  selectedEmployeeId: string | null;
  onSelectEmployee: (id: string | null) => void;
  onNewTask: () => void;
  onAddEmployee: () => void;
  onDeleteEmployee: (id: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  employees, 
  selectedEmployeeId, 
  onSelectEmployee, 
  onNewTask,
  onAddEmployee,
  onDeleteEmployee,
  isOpen
}) => {
  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-20 transition-transform duration-300 ease-in-out w-64 bg-[#0B1120] border-r border-slate-800 flex flex-col h-full`}>
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
            <CheckSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-white tracking-tight">TaskFlow</h1>
          <p className="text-xs text-slate-400">Task Management</p>
        </div>
      </div>

      <div className="px-3 py-2">
        <button 
          onClick={() => onSelectEmployee(null)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            selectedEmployeeId === null ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors">
          <Users size={18} />
          Employees
        </button>
      </div>

      <div className="mt-6 px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Team Members</h3>
          <button 
            onClick={onAddEmployee}
            className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded"
            title="Add Team Member"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="space-y-1 max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
          <button 
             onClick={() => onSelectEmployee(null)}
             className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors ${selectedEmployeeId === null ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <div className="w-6 h-6 rounded flex items-center justify-center bg-slate-700 text-xs shrink-0">
              <Users size={12} />
            </div>
            All Tasks
          </button>
          
          {employees.map((emp) => (
            <div 
              key={emp.id}
              onClick={() => onSelectEmployee(emp.id)}
              className={`group w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors cursor-pointer ${selectedEmployeeId === emp.id ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${emp.color} shrink-0`}>
                {emp.initials}
              </div>
              <span className="truncate flex-1 text-left">{emp.name}</span>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Are you sure you want to remove ${emp.name}?`)) {
                    onDeleteEmployee(emp.id);
                  }
                }}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                title="Remove Employee"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800">
        <button 
          onClick={onNewTask}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
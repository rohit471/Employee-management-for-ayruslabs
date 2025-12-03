import React from 'react';
import { Calendar, ArrowUpCircle, CheckCircle2, Clock, Circle, Trash2, Pencil } from 'lucide-react';
import { Task, TaskPriority, TaskStatus, Employee } from '../types';

interface TaskCardProps {
  task: Task;
  assignee?: Employee;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, assignee, onDelete, onEdit }) => {
  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case TaskPriority.HIGH: return 'text-red-400 bg-red-900/30 border-red-800';
      case TaskPriority.MEDIUM: return 'text-amber-400 bg-amber-900/30 border-amber-800';
      case TaskPriority.LOW: return 'text-blue-400 bg-blue-900/30 border-blue-800';
    }
  };

  const getStatusIcon = (s: TaskStatus) => {
    switch (s) {
      case TaskStatus.COMPLETED: return <CheckCircle2 size={14} />;
      case TaskStatus.IN_PROGRESS: return <Clock size={14} />;
      case TaskStatus.TODO: return <Circle size={14} />;
    }
  };

  const getStatusColor = (s: TaskStatus) => {
    switch (s) {
      case TaskStatus.COMPLETED: return 'text-emerald-400 bg-emerald-950/50 border border-emerald-900';
      case TaskStatus.IN_PROGRESS: return 'text-blue-400 bg-blue-950/50 border border-blue-900';
      case TaskStatus.TODO: return 'text-slate-400 bg-slate-800 border border-slate-700';
    }
  };

  return (
    <div 
      onClick={() => onEdit(task)}
      className="bg-surface rounded-xl p-5 border border-slate-700 hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-900/10 transition-all cursor-pointer group relative"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1 pr-2">
          {task.title}
        </h3>
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${getPriorityColor(task.priority)} flex items-center gap-1 shrink-0`}>
           <ArrowUpCircle size={10} />
           {task.priority}
        </span>
      </div>

      <p className="text-slate-400 text-sm mb-6 line-clamp-2 h-10">
        {task.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-md flex items-center gap-1.5 font-medium ${getStatusColor(task.status)}`}>
                {getStatusIcon(task.status)}
                {task.status}
            </span>
        </div>

        <div className="flex items-center gap-2">
             <div className="flex items-center gap-1.5 text-slate-500 text-xs mr-2">
                <Calendar size={12} />
                {task.dueDate}
            </div>
            
            {assignee && (
                <div 
                    title={assignee.name}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${assignee.color} border border-surface ring-2 ring-surface`}
                >
                    {assignee.initials}
                </div>
            )}

            <div className="flex items-center gap-1 pl-2 border-l border-slate-700/50 ml-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="text-slate-500 hover:text-blue-400 p-1.5 hover:bg-blue-900/20 rounded transition-colors"
                title="Edit Task"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                  }
                }}
                className="text-slate-500 hover:text-red-400 p-1.5 hover:bg-red-900/20 rounded transition-colors"
                title="Delete Task"
              >
                <Trash2 size={14} />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
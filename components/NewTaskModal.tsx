import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Save, Trash2 } from 'lucide-react';
import { Employee, TaskPriority, TaskStatus, Task } from '../types';
import { generateTaskDetails } from '../services/geminiService';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onSave: (task: Partial<Task>) => void;
  onDelete: (id: string) => void;
  initialTask?: Task | null;
}

const NewTaskModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, employees, onSave, onDelete, initialTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Populate form when initialTask changes (Edit Mode)
  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setTitle(initialTask.title);
        setDescription(initialTask.description);
        setPriority(initialTask.priority);
        setStatus(initialTask.status);
        setAssigneeId(initialTask.assigneeId);
        setDueDate(initialTask.dueDate);
      } else {
        // Reset for Create Mode
        setTitle('');
        setDescription('');
        setPriority(TaskPriority.MEDIUM);
        setStatus(TaskStatus.TODO);
        setAssigneeId(employees[0]?.id || '');
        setDueDate('');
      }
    }
  }, [isOpen, initialTask, employees]);

  if (!isOpen) return null;

  const handleAIAutoFill = async () => {
    if (!title) return;
    setIsGenerating(true);
    const result = await generateTaskDetails(title);
    if (result) {
      setDescription(result.description);
      if (Object.values(TaskPriority).includes(result.priority as TaskPriority)) {
        setPriority(result.priority as TaskPriority);
      }
    }
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialTask?.id, // Pass ID if editing
      title,
      description,
      priority,
      status,
      assigneeId,
      dueDate: dueDate || 'No Date'
    });
    onClose();
  };

  const handleDelete = () => {
    if (initialTask && window.confirm('Are you sure you want to delete this task?')) {
      onDelete(initialTask.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {initialTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Task Title</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fix login bug"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!initialTask && (
                <button 
                  type="button"
                  onClick={handleAIAutoFill}
                  disabled={!title || isGenerating}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  title="Generate description with AI"
                >
                  {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  <span className="hidden sm:inline text-sm font-medium">AI Assist</span>
                </button>
              )}
            </div>
            {!initialTask && <p className="text-xs text-slate-500 mt-1">Type a title and click AI Assist to auto-generate details.</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea 
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Task details..."
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(TaskPriority).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(TaskStatus).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date & Assignee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
              <input 
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Dec 15"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-1">Assign To</label>
                <select 
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            {initialTask && (
              <button 
                type="button"
                onClick={handleDelete}
                className="px-4 py-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg border border-red-900/50 transition-colors flex items-center justify-center"
                title="Delete Task"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button 
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
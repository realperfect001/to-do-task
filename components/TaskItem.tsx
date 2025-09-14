import React from 'react';
import { Task, Priority } from '../types';
import { TrashIcon, CalendarIcon, PencilIcon } from './Icons';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onToggleStep: (taskId: string, stepId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit, onToggleStep }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the beginning of today for accurate comparison
  const isOverdue = !task.isCompleted && new Date(task.dueDate) < today;

  const formattedDate = new Date(task.dueDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const priorityStyles: { [key in Priority]: { tag: string; border: string } } = {
    Low:    { tag: 'bg-sky-500/20 text-sky-300',    border: 'border-l-sky-500' },
    Medium: { tag: 'bg-yellow-500/20 text-yellow-300', border: 'border-l-yellow-500' },
    High:   { tag: 'bg-red-500/20 text-red-300',    border: 'border-l-red-500' },
  };
  
  const currentPriority = task.priority || 'Medium';

  return (
    <li className={`bg-slate-800 rounded-lg p-4 flex items-start space-x-4 transition-all duration-300 border-l-4 ${task.isCompleted ? 'opacity-50 border-l-slate-600' : `${priorityStyles[currentPriority].border} hover:bg-slate-700`}`}>
      <button
        onClick={() => onToggleComplete(task.id)}
        className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 transition-colors duration-300 ${task.isCompleted ? 'bg-green-500 border-green-500' : 'border-slate-500 hover:border-green-400'}`}
        aria-label={task.isCompleted ? 'Mark task as incomplete' : 'Mark task as complete'}
      >
        {task.isCompleted && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
      </button>
      <div className="flex-grow">
        <p className={`font-semibold text-white ${task.isCompleted ? 'line-through text-slate-400' : ''}`}>{task.title}</p>
        {task.description && <p className={`text-sm text-slate-400 mt-1 ${task.isCompleted ? 'line-through' : ''}`}>{task.description}</p>}
        
        {(task.progress > 0 || (task.steps && task.steps.length > 0)) && (
            <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-400">Progress</span>
                    <span className="text-xs font-semibold text-blue-300">{task.progress || 0}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${task.progress || 0}%` }}></div>
                </div>
            </div>
        )}

        {task.steps && task.steps.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-700/50">
                <h4 className="text-xs font-semibold text-slate-400 mb-2">Steps:</h4>
                <ul className="space-y-2">
                    {task.steps.map(step => (
                        <li key={step.id} className="flex items-center text-sm text-slate-300">
                            <input
                                type="checkbox"
                                id={`step-${step.id}`}
                                checked={step.isCompleted}
                                onChange={() => onToggleStep(task.id, step.id)}
                                className="w-4 h-4 bg-slate-600 border-slate-500 text-blue-500 focus:ring-blue-500 rounded mr-3 cursor-pointer"
                                disabled={task.isCompleted}
                            />
                            <label htmlFor={`step-${step.id}`} className={`transition ${step.isCompleted ? 'line-through text-slate-500' : ''}`}>
                                {step.text}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <div className="flex items-center justify-between text-xs mt-3">
          <div className={`flex items-center ${isOverdue ? 'text-red-400 font-semibold' : 'text-slate-500'}`}>
            <CalendarIcon className="w-4 h-4 mr-1.5" />
            <span>{formattedDate}</span>
            {isOverdue && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-900 text-red-300 rounded-full">
                Missed
              </span>
            )}
          </div>
          <span className={`px-2 py-0.5 font-semibold rounded-full ${priorityStyles[currentPriority].tag}`}>
            {currentPriority}
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-2 flex-shrink-0">
        <button
            onClick={() => onEdit(task)}
            className="text-slate-500 hover:text-blue-400 transition-colors duration-300 p-1"
            aria-label={`Edit task: ${task.title}`}
        >
            <PencilIcon className="w-5 h-5" />
        </button>
        <button
            onClick={() => onDelete(task.id)}
            className="text-slate-500 hover:text-red-500 transition-colors duration-300 p-1"
            aria-label={`Delete task: ${task.title}`}
        >
            <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
};

export default TaskItem;

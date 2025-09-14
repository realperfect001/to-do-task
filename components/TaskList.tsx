import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { CheckCircleIcon } from './Icons';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onEdit: (task: Task) => void;
  onToggleStep: (taskId: string, stepId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onDelete, searchQuery, onEdit, onToggleStep }) => {
  const searchedTasks = searchQuery
    ? tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : tasks;
  
  const pendingTasks = searchedTasks.filter(task => !task.isCompleted);
  const completedTasks = searchedTasks.filter(task => task.isCompleted);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Pending Tasks</h2>
        {pendingTasks.length > 0 ? (
          <ul className="space-y-3">
            {pendingTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggleComplete={onToggleComplete} onDelete={onDelete} onEdit={onEdit} onToggleStep={onToggleStep} />
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-center py-4 bg-slate-800 rounded-lg">
            {searchQuery ? 'No pending tasks match your search.' : 'You have no pending tasks. Great job!'}
          </p>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <CheckCircleIcon className="w-6 h-6 mr-2 text-green-400" />
            Completed Tasks
        </h2>
        {completedTasks.length > 0 ? (
          <ul className="space-y-3">
            {completedTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggleComplete={onToggleComplete} onDelete={onDelete} onEdit={onEdit} onToggleStep={onToggleStep} />
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-center py-4 bg-slate-800 rounded-lg">
            {searchQuery ? 'No completed tasks match your search.' : 'No tasks completed yet.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskList;

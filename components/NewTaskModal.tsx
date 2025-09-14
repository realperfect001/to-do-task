import React, { useState, useEffect } from 'react';
import { Task, Priority, Step } from '../types';
import { TrashIcon } from './Icons';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Omit<Task, 'id' | 'isCompleted'> | Task) => void;
  selectedDate: Date;
  taskToEdit?: Task | null;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onSaveTask, selectedDate, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [steps, setSteps] = useState<Step[]>([]);
  const [newStepText, setNewStepText] = useState('');
  const [progress, setProgress] = useState(0);

  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const [dueDate, setDueDate] = useState(formatDateForInput(selectedDate));

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setPriority(taskToEdit.priority);
        setDueDate(formatDateForInput(new Date(taskToEdit.dueDate)));
        setSteps(taskToEdit.steps || []);
        setProgress(taskToEdit.progress || 0);
      } else {
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setDueDate(formatDateForInput(selectedDate));
        setSteps([]);
        setProgress(0);
        setNewStepText('');
      }
    }
  }, [isOpen, taskToEdit, selectedDate]);

  const handleAddStep = () => {
    if (newStepText.trim()) {
      const newStep: Step = {
        id: new Date().toISOString() + Math.random(),
        text: newStepText.trim(),
        isCompleted: false,
      };
      setSteps([...steps, newStep]);
      setNewStepText('');
    }
  };

  const handleRemoveStep = (idToRemove: string) => {
    setSteps(steps.filter(step => step.id !== idToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const taskData = { title, description, dueDate: new Date(dueDate).toISOString(), priority, steps, progress };
      if (taskToEdit) {
        onSaveTask({ ...taskToEdit, ...taskData });
      } else {
        onSaveTask(taskData);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6">{taskToEdit ? 'Edit Task' : 'Add New Task'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-slate-400 text-sm font-bold mb-2">Title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-slate-400 text-sm font-bold mb-2">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="dueDate" className="block text-slate-400 text-sm font-bold mb-2">Due Date</label>
              <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label htmlFor="priority" className="block text-slate-400 text-sm font-bold mb-2">Priority</label>
              <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Progress Slider */}
          <div className="mb-6">
            <label htmlFor="progress" className="block text-slate-400 text-sm font-bold mb-2">Progress: <span className="font-semibold text-blue-400">{progress}%</span></label>
            <input id="progress" type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
          </div>

          {/* Steps */}
          <div className="mb-6">
            <label className="block text-slate-400 text-sm font-bold mb-2">Steps to Achieve</label>
            <div className="flex space-x-2">
              <input type="text" value={newStepText} onChange={(e) => setNewStepText(e.target.value)} placeholder="Add a new step" className="flex-grow px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="button" onClick={handleAddStep} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">Add</button>
            </div>
            <ul className="mt-3 space-y-2 max-h-32 overflow-y-auto">
              {steps.map(step => (
                <li key={step.id} className="flex items-center justify-between bg-slate-700 p-2 rounded-md">
                  <span className="text-white">{step.text}</span>
                  <button type="button" onClick={() => handleRemoveStep(step.id)} className="text-slate-500 hover:text-red-500">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;

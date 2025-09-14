import React, { useState, useEffect, useCallback } from 'react';
import { Task } from './types';
import Header from './components/Header';
import Auth from './components/Auth';
import Calendar from './components/Calendar';
import TaskList from './components/TaskList';
import NewTaskModal from './components/NewTaskModal';
import { PlusIcon, BellIcon } from './components/Icons';

// Custom hook for Local Storage
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const App: React.FC = () => {
  const [user, setUser] = useLocalStorage<string | null>('user', null);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [searchQuery, setSearchQuery] = useState('');

  // Effect to migrate old tasks to include new fields
  useEffect(() => {
    const needsMigration = tasks.some(task => !task.steps || typeof task.progress === 'undefined');
    if (needsMigration) {
      setTasks(prevTasks =>
        prevTasks.map(task => ({
          ...task,
          priority: task.priority || 'Medium',
          steps: task.steps || [],
          progress: task.progress || 0,
        }))
      );
    }
  }, [tasks, setTasks]);

  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            setNotificationPermission(permission);
        });
    }
  };
  
  // Effect for notification permissions
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Effect for checking task reminders
  useEffect(() => {
    const checkReminders = () => {
        if (notificationPermission !== 'granted') return;

        const now = new Date();
        tasks.forEach(task => {
            if (!task.isCompleted) {
                const dueDate = new Date(task.dueDate);
                if (dueDate.getFullYear() === now.getFullYear() &&
                    dueDate.getMonth() === now.getMonth() &&
                    dueDate.getDate() === now.getDate()) {
                    if (dueDate < now) {
                        const notifiedTasks = JSON.parse(localStorage.getItem('notifiedTasks') || '[]');
                        if (!notifiedTasks.includes(task.id)) {
                             new Notification('Task Overdue!', {
                                body: `Your task "${task.title}" is overdue.`,
                                icon: '/vite.svg'
                            });
                            localStorage.setItem('notifiedTasks', JSON.stringify([...notifiedTasks, task.id]));
                        }
                    }
                }
            }
        });
    };

    const intervalId = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [tasks, notificationPermission]);

  const handleAuth = (username: string) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
  };

  const handleSaveTask = useCallback((taskData: Omit<Task, 'id' | 'isCompleted'> | Task) => {
    if ('id' in taskData) { // Editing existing task
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskData.id ? { ...task, ...taskData } : task
            )
        );
    } else { // Adding new task
        const newTask: Task = {
            ...taskData,
            id: new Date().toISOString() + Math.random(),
            isCompleted: false,
        };
        setTasks(prevTasks => [...prevTasks, newTask].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    }
    setIsModalOpen(false);
    setEditingTask(null);
  }, [setTasks]);

  const handleStartEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleToggleComplete = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  }, [setTasks]);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, [setTasks]);

  const handleToggleStep = useCallback((taskId: string, stepId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedSteps = task.steps.map(step =>
            step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
          );
          const completedSteps = updatedSteps.filter(s => s.isCompleted).length;
          const newProgress = updatedSteps.length > 0 ? Math.round((completedSteps / updatedSteps.length) * 100) : 0;
          return { ...task, steps: updatedSteps, progress: newProgress };
        }
        return task;
      })
    );
  }, [setTasks]);

  if (!user) {
    return <Auth onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Header username={user} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} tasks={tasks} />
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
          >
            <PlusIcon className="w-6 h-6 mr-2" />
            Add New Task
          </button>
          {notificationPermission !== 'granted' && (
            <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-sm p-3 rounded-lg flex items-start space-x-3">
                <BellIcon className="w-5 h-5 mt-0.5 flex-shrink-0"/>
                <div>
                    <p className="font-semibold">Enable Notifications</p>
                    <p>To get reminders for your tasks, please allow browser notifications.</p>
                    <button onClick={requestNotificationPermission} className="mt-2 font-bold underline hover:text-yellow-100">Enable Now</button>
                </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl">
            <div className="mb-4">
                <h2 className="text-3xl font-bold text-white">All Your Tasks</h2>
                <p className="text-xl text-blue-400">Stay on top of your schedule</p>
            </div>
             <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
            </div>
          <TaskList tasks={tasks} onToggleComplete={handleToggleComplete} onDelete={handleDeleteTask} searchQuery={searchQuery} onEdit={handleStartEdit} onToggleStep={handleToggleStep}/>
        </div>
      </main>

      <NewTaskModal
        isOpen={isModalOpen || !!editingTask}
        onClose={handleCloseModal}
        onSaveTask={handleSaveTask}
        selectedDate={selectedDate}
        taskToEdit={editingTask}
      />
    </div>
  );
};

export default App;

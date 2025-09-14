
import React from 'react';
import { Task } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  tasks: Task[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange, tasks }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = currentMonth.getDay();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const tasksByDate = React.useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(task => {
        const dateKey = new Date(task.dueDate).toDateString();
        map.set(dateKey, (map.get(dateKey) || 0) + 1);
    });
    return map;
  }, [tasks]);

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const hasTasks = tasksByDate.has(date.toDateString());

      days.push(
        <div key={day} className="flex justify-center items-center">
            <button
            onClick={() => onDateChange(date)}
            className={`w-10 h-10 rounded-full flex flex-col justify-center items-center transition-colors duration-200 relative
                ${isSelected ? 'bg-blue-600 text-white' : ''}
                ${!isSelected && isToday ? 'text-blue-400 font-bold' : ''}
                ${!isSelected && !isToday ? 'text-slate-300 hover:bg-slate-700' : ''}
            `}
            >
            {day}
            {hasTasks && <div className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-400'}`}></div>}
            </button>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-700">
          <ChevronLeftIcon className="w-6 h-6 text-slate-400" />
        </button>
        <h2 className="text-lg font-semibold text-white">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-700">
          <ChevronRightIcon className="w-6 h-6 text-slate-400" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-sm text-slate-500 mb-2">
        {weekDays.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-2">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;

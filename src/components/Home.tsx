
import { User, Plus, CheckCircle2, Circle, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Task } from '../App';

interface HomeProps {
  tasks: Task[];
  toggleTask: (id: number) => void;
  onNavigate: (page: string) => void;
}

export function HomeFeed({ tasks, toggleTask, onNavigate }: HomeProps) {
  // Navigation for month view
  const [currentDate, setCurrentDate] = useState(new Date());

  const { todayTasks, stats, calendarDays } = useMemo(() => {
    // Top 3 tasks for today
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const todayTasks = tasks.filter(t => t.created_at && t.created_at.startsWith(todayStr)).slice(0, 3);

    // If no tasks today, fallback so it's not totally empty (optional)
    const displayTasks = todayTasks.length > 0 ? todayTasks : tasks.slice(0, 3);
    
    // Monthly statistics
    const currentMonthTasks = tasks.filter(t => {
      if (!t.created_at) return false;
      const tDate = new Date(t.created_at);
      return tDate.getFullYear() === currentDate.getFullYear() && tDate.getMonth() === currentDate.getMonth();
    });

    const monthlyCompleted = currentMonthTasks.filter(t => t.completed);
    const completionRate = currentMonthTasks.length > 0 
      ? Math.round((monthlyCompleted.length / currentMonthTasks.length) * 100) 
      : 0;

    const monthlyPoints = monthlyCompleted.reduce((acc, curr) => acc + curr.points, 0);

    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const monthlyCompletedDates = Array.from(new Set(
      monthlyCompleted.filter(t => t.created_at).map(t => formatDate(new Date(t.created_at!)))
    ));

    const checkinDays = monthlyCompletedDates.length;

    // Consecutive Check-in (global)
    const allCompletedDates = Array.from(new Set(
      tasks.filter(t => t.completed && t.created_at).map(t => formatDate(new Date(t.created_at!)))
    )).sort((a, b) => a.localeCompare(b));

    let currentStreak = 0;
    if (allCompletedDates.length > 0) {
      currentStreak = 1;
      for (let i = allCompletedDates.length - 1; i > 0; i--) {
        const d1 = new Date(allCompletedDates[i-1]);
        const d2 = new Date(allCompletedDates[i]);
        const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else if (diffDays > 1) {
          break;
        }
      }
      
      // Check if streak is still active today or yesterday
      const lastDateStr = allCompletedDates[allCompletedDates.length - 1];
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDateStr !== formatDate(today) && lastDateStr !== formatDate(yesterday)) {
        currentStreak = 0;
      }
    }

    // Calendar logic
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay(); // 0-6

    const previousMonthLastDay = new Date(year, month, 0).getDate();

    const days = [];
    
    // Prev month days
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: previousMonthLastDay - startingDay + i + 1, isCurrentMonth: false, isCompleted: false, isToday: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isCompleted = monthlyCompletedDates.includes(dateStr);
      const isToday = todayStr === dateStr;
      days.push({ day: i, isCurrentMonth: true, isCompleted, isToday });
    }

    // Next month days to fill 6 rows (42 days) sometimes 35
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
        days.push({ day: i, isCurrentMonth: false, isCompleted: false, isToday: false });
    }

    return { 
      todayTasks: displayTasks, 
      stats: { currentStreak, completionRate, checkinDays, monthlyPoints },
      calendarDays: days
    };
  }, [tasks, currentDate]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="text-xl font-bold">每日任务</div>
        <div 
          onClick={() => onNavigate('profile')} 
          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
        >
          <User size={18} className="text-gray-500" />
        </div>
      </header>

      {/* Consecutive Check-in Card */}
      <div className="p-4">
        <div className="bg-primary rounded-xl p-5 text-white shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">连续打卡</h2>
            <Award size={24} className="text-yellow-300" />
          </div>
          <div className="flex items-baseline mb-4">
            <span className="text-4xl font-bold">{stats.currentStreak}</span>
            <span className="ml-1 text-sm opacity-80">天</span>
          </div>
          <div className="bg-white/20 rounded-full h-2 mb-2 overflow-hidden">
            <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((stats.currentStreak / 21) * 100, 100)}%` }}></div>
          </div>
          <div className="flex justify-between text-xs opacity-80">
            <span>当前进度</span>
            <span>距离目标还差{Math.max(21 - stats.currentStreak, 0)}天</span>
          </div>
        </div>
      </div>

      {/* Today's Tasks Area */}
      <div className="px-4 py-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">今日任务</h3>
          <span 
            className="text-sm text-gray-500 cursor-pointer hover:text-primary transition-colors"
            onClick={() => onNavigate('tasks')}
          >
            全部 &gt;
          </span>
        </div>
        
        <div className="space-y-3">
          {todayTasks.map(task => (
            <div 
              key={task.id} 
              className="bg-white rounded-lg p-4 flex items-center shadow-sm border border-gray-100 cursor-pointer transition-all hover:bg-gray-50"
              onClick={() => toggleTask(task.id)}
            >
              {task.completed ? (
                <CheckCircle2 size={24} className="text-green-500 flex-shrink-0" />
              ) : (
                <Circle size={24} className="text-gray-300 flex-shrink-0" />
              )}
              <div className="ml-3 flex-1">
                <div className={`font-medium transition-all ${task.completed ? 'text-gray-800 line-through opacity-70' : 'text-gray-800'}`}>
                  {task.title}
                </div>
                <div className="text-xs text-gray-400 mt-1">{task.category}</div>
              </div>
              <div className="text-sm text-yellow-500 font-medium">+{task.points} 积分</div>
            </div>
          ))}

          {/* Add Task Button */}
          <button 
            onClick={() => onNavigate('add')}
            className="w-full mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:bg-gray-50 hover:text-primary hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1"
          >
            <Plus size={24} className="opacity-60" />
            <span className="text-sm font-medium">添加新任务</span>
          </button>
        </div>
      </div>

      {/* Monthly Statistics Card */}
      <div className="p-4 mt-2 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">月度统计</h3>
          <span 
            className="text-sm text-gray-500 cursor-pointer hover:text-primary transition-colors"
            onClick={() => onNavigate('stats')}
          >
            详情 &gt;
          </span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center text-center mb-6 pt-2">
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.completionRate}%</div>
              <div className="text-xs text-gray-500 mt-1">完成率</div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.checkinDays}</div>
              <div className="text-xs text-gray-500 mt-1">本月打卡</div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">{stats.monthlyPoints}</div>
              <div className="text-xs text-gray-500 mt-1">获得积分</div>
            </div>
          </div>

          {/* Calendar */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-sm">{currentDate.getFullYear()}年{currentDate.getMonth() + 1}月</span>
              <div className="flex gap-2">
                <ChevronLeft size={16} className="text-gray-400 cursor-pointer hover:text-gray-700" onClick={prevMonth} />
                <ChevronRight size={16} className="text-gray-400 cursor-pointer hover:text-gray-700" onClick={nextMonth} />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
              <div className="text-gray-400">日</div>
              <div className="text-gray-400">一</div>
              <div className="text-gray-400">二</div>
              <div className="text-gray-400">三</div>
              <div className="text-gray-400">四</div>
              <div className="text-gray-400">五</div>
              <div className="text-gray-400">六</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {calendarDays.map((d, i) => {
                let className = "p-1 m-0.5 rounded-full ";
                if (!d.isCurrentMonth) {
                  className += "opacity-40 text-gray-500";
                } else if (d.isToday && d.isCompleted) {
                  className += "bg-primary text-white font-bold shadow-sm";
                } else if (d.isToday) {
                  className += "border border-primary text-primary font-bold";
                } else if (d.isCompleted) {
                  className += "bg-primary/10 text-primary";
                } else {
                  className += "text-gray-700";
                }

                return (
                  <div key={i} className={className}>
                    {d.day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

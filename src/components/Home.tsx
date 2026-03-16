import { User, Plus, CheckCircle2, Award, ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon, CheckSquare } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Task, SubTask } from '../App';

interface HomeProps {
  tasks: Task[];
  toggleTask: (id: number) => void;
  onNavigate: (page: string) => void;
  updateTaskProgress?: (id: number, current_progress: number, subtasks?: SubTask[]) => void;
}

export function HomeFeed({ tasks, toggleTask, onNavigate, updateTaskProgress }: HomeProps) {
  // Navigation for month view
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const { todayTasks, stats, calendarDays } = useMemo(() => {
    // Top 3 tasks for today that are NOT completed
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const todayTasks = tasks.filter(t => t.created_at && t.created_at.startsWith(todayStr) && !t.completed).slice(0, 3);

    // If no uncompleted tasks today, fallback so it's not totally empty (optional)
    const displayTasks = todayTasks.length > 0 ? todayTasks : tasks.filter(t => !t.completed).slice(0, 3);
    
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
    <div className="flex-1 overflow-y-auto pb-20 relative bg-dot-grid">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-4 bg-background sticky top-0 z-10 border-b-2 border-foreground shadow-[0_4px_0_0_var(--color-foreground)]">
        <div className="text-2xl font-bold font-heading flex items-center gap-2">
          今日任务
        </div>
        <div 
          onClick={() => onNavigate('profile')} 
          className="w-10 h-10 bg-tertiary border-chunky rounded-full flex items-center justify-center cursor-pointer shadow-[4px_4px_0_0_#1E293B] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#1E293B] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#1E293B] transition-all group"
        >
          <User size={20} className="text-foreground group-hover:rotate-12 transition-transform" />
        </div>
      </header>

      {/* Consecutive Check-in Card */}
      <div className="p-4 mt-2">
        <div className="card-sticker p-5 card-sticker-interactive" style={{ backgroundColor: '#8B5CF6', color: 'white' }}>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold font-heading">连续打卡</h2>
            <div className="w-10 h-10 bg-card rounded-full border-chunky flex items-center justify-center -mt-2 -mr-2 shadow-[2px_2px_0_0_#1E293B] rotate-12">
              <Award size={20} className="text-tertiary" />
            </div>
          </div>
          <div className="flex items-baseline mb-4">
            <span className="text-5xl font-bold font-heading">{stats.currentStreak}</span>
            <span className="ml-1 text-sm font-bold opacity-90">天</span>
          </div>
          <div className="bg-foreground rounded-full h-3 mb-2 overflow-hidden border-2 border-foreground relative">
            <div className="bg-tertiary h-full rounded-full transition-all duration-1000 border-r-2 border-foreground" style={{ width: `${Math.max(Math.min((stats.currentStreak / 21) * 100, 100), 5)}%` }}></div>
          </div>
          <div className="flex justify-between text-xs font-bold opacity-90">
            <span>当前进度</span>
            <span>距离目标还差{Math.max(21 - stats.currentStreak, 0)}天</span>
          </div>
        </div>
      </div>

      {/* Today's Tasks Area */}
      <div className="px-4 py-2">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xl font-bold font-heading relative z-10 w-fit">
            <span className="relative z-10">今日任务</span>
            <div className="absolute bottom-1 left-0 w-full h-3 bg-secondary/50 -z-10 -rotate-1 skew-x-12"></div>
          </h3>
          <button 
            className="text-sm font-bold text-foreground hover:text-accent border-2 border-transparent hover:border-foreground rounded-full px-2 py-1 transition-all"
            onClick={() => onNavigate('tasks')}
          >
            全部 &gt;
          </button>
        </div>
        
        <div className="space-y-4 relative">
          {todayTasks.map(task => {
            const isExpanded = expandedTaskId === task.id;
            return (
            <div key={task.id} className="relative">
              <div 
                className="card-sticker p-4 cursor-pointer hover:-rotate-1 hover:scale-[1.02] transition-all bg-card"
                onClick={() => {
                  if (task.type === 'progress') {
                    setExpandedTaskId(isExpanded ? null : task.id);
                  } else {
                    toggleTask(task.id);
                  }
                }}
              >
                <div className="flex items-center">
                  {task.type === 'progress' ? (
                    <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-transform">
                       <ChevronRightIcon size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  ) : (
                    task.completed ? (
                      <div className="w-6 h-6 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_0_#1E293B]">
                        <CheckCircle2 size={16} className="text-foreground" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-foreground flex-shrink-0 bg-white shadow-[2px_2px_0_0_#1E293B]" />
                    )
                  )}
                  <div className="ml-3 flex-1">
                    <div className={`font-bold text-lg transition-all ${task.completed ? 'text-muted-foreground line-through decoration-2 opacity-70' : 'text-foreground'}`}>
                      {task.title}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground mt-0.5">{task.category}</div>
                  </div>
                  {task.type === 'progress' && !task.completed && (
                    <div className="mr-3 text-xs font-bold font-heading text-secondary shrink-0 flex flex-col items-end">
                      {task.subtasks ? (
                        <span>{task.current_progress || 0}/{task.target_progress || 1}</span>
                      ) : (
                        <span>{task.current_progress || 0}/{task.target_progress || 100}</span>
                      )}
                    </div>
                  )}
                  <div className="text-sm font-bold bg-tertiary px-2 py-1 rounded-md border-2 border-foreground shadow-[2px_2px_0_0_#1E293B]">+{task.points} 积分</div>
                </div>

                {/* Progress bar line */}
                {task.type === 'progress' && !task.completed && (
                  <div className="mt-3">
                    <div className="w-full h-2.5 bg-muted rounded-full border-2 border-foreground overflow-hidden">
                      <div 
                        className="h-full bg-secondary transition-all" 
                        style={{ width: `${Math.min(100, ((task.current_progress || 0) / (task.target_progress || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Area for Progress Task */}
              {task.type === 'progress' && !task.completed && isExpanded && (
                <div className="mt-2 bg-white border-2 border-foreground rounded-xl p-3 shadow-[4px_4px_0_0_#1E293B] relative -top-3 z-0 pt-5 mx-2 animate-in slide-in-from-top-2">
                   {task.subtasks ? (
                     <div className="space-y-2">
                       {task.subtasks.map((st, i) => (
                         <div 
                           key={st.id} 
                           className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
                           onClick={(e) => {
                             e.stopPropagation();
                             if (st.completed) return;
                             
                             const newSubtasks = [...task.subtasks!];
                             newSubtasks[i].completed = !newSubtasks[i].completed;
                             const current = newSubtasks.filter(s => s.completed).length;
                             updateTaskProgress?.(task.id, current, newSubtasks);
                           }}
                         >
                           {st.completed ? (
                             <CheckSquare size={18} className="text-secondary" />
                           ) : (
                             <div className="w-[18px] h-[18px] border-2 border-foreground rounded" />
                           )}
                           <span className={`text-sm font-bold ${st.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                             {st.title}
                           </span>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="flex justify-between items-center px-2">
                       <span className="text-sm font-bold text-muted-foreground">当前进度</span>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           updateTaskProgress?.(task.id, (task.current_progress || 0) + 1);
                         }}
                         className="px-4 py-1.5 bg-quaternary border-2 border-foreground rounded-full text-foreground shadow-[2px_2px_0_0_#1E293B] font-bold active:translate-y-0.5 active:shadow-none transition-all"
                       >
                         +1 进度
                       </button>
                     </div>
                   )}
                </div>
              )}
            </div>
            );
          })}

          {/* Add Task Button */}
          <button 
            onClick={() => onNavigate('add')}
            className="w-full mt-4 border-chunky border-dashed rounded-xl p-4 text-center text-foreground font-bold font-heading hover:bg-tertiary hover:border-solid transition-all flex flex-col items-center justify-center gap-1 hover:shadow-pop hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            <Plus size={28} />
            <span className="text-base">添加新任务</span>
          </button>
        </div>
      </div>

      {/* Monthly Statistics Card */}
      <div className="p-4 mt-2 mb-6">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xl font-bold font-heading relative z-10 w-fit">
            <span className="relative z-10">月度统计</span>
            <div className="absolute bottom-1 left-0 w-full h-3 bg-quaternary/50 -z-10 -rotate-2 -skew-x-12"></div>
          </h3>
          <button 
            className="text-sm font-bold text-foreground hover:text-accent border-2 border-transparent hover:border-foreground rounded-full px-2 py-1 transition-all"
            onClick={() => onNavigate('stats')}
          >
            详情 &gt;
          </button>
        </div>
        
        <div className="card-sticker-pink p-4">
          <div className="flex justify-between items-center text-center mb-6 pt-2">
            <div>
              <div className="text-3xl font-black font-heading text-foreground">{stats.completionRate}%</div>
              <div className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wide">完成率</div>
            </div>
            <div className="w-0.5 h-12 bg-foreground rounded-full rotate-12 bg-opacity-20 border-l border-foreground"></div>
            <div>
              <div className="text-3xl font-black font-heading text-foreground">{stats.checkinDays}</div>
              <div className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wide">本月打卡</div>
            </div>
            <div className="w-0.5 h-12 bg-foreground rounded-full -rotate-12 bg-opacity-20 border-l border-foreground"></div>
            <div>
              <div className="text-3xl font-black font-heading text-tertiary" style={{ textShadow: '1px 1px 0 #1E293B, -1px -1px 0 #1E293B, 1px -1px 0 #1E293B, -1px 1px 0 #1E293B, 2px 2px 0 #1E293B' }}>{stats.monthlyPoints}</div>
              <div className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wide">获得积分</div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white border-2 border-foreground rounded-lg p-3 shadow-[4px_4px_0_0_#1E293B]">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-base font-heading">{currentDate.getFullYear()}年{currentDate.getMonth() + 1}月</span>
              <div className="flex gap-2">
                <button className="w-7 h-7 flex items-center justify-center bg-muted border-2 border-foreground rounded-full hover:bg-secondary hover:text-white transition-colors" onClick={prevMonth}>
                  <ChevronLeft size={16} />
                </button>
                <button className="w-7 h-7 flex items-center justify-center bg-muted border-2 border-foreground rounded-full hover:bg-secondary hover:text-white transition-colors" onClick={nextMonth}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold mb-2">
              <div className="text-muted-foreground">日</div>
              <div className="text-muted-foreground">一</div>
              <div className="text-muted-foreground">二</div>
              <div className="text-muted-foreground">三</div>
              <div className="text-muted-foreground">四</div>
              <div className="text-muted-foreground">五</div>
              <div className="text-muted-foreground">六</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-sm">
              {calendarDays.map((d, i) => {
                let className = "py-1.5 w-full flex justify-center items-center rounded-blob border-2 border-transparent transition-all ";
                if (!d.isCurrentMonth) {
                  className += "opacity-40 text-muted-foreground";
                } else if (d.isToday && d.isCompleted) {
                  className += "bg-quaternary border-foreground text-foreground shadow-[2px_2px_0_0_#1E293B] scale-110 rotate-3";
                } else if (d.isToday) {
                  className += "bg-white border-foreground text-foreground shadow-[2px_2px_0_0_#1E293B] scale-110";
                } else if (d.isCompleted) {
                  className += "bg-tertiary/60 border-foreground text-foreground rounded-full";
                } else {
                  className += "text-foreground hover:bg-muted";
                }

                return (
                  <div key={i} className="flex justify-center items-center">
                    <span className={className}>
                      {d.day}
                    </span>
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

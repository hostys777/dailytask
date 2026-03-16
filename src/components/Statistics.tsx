import { Award, TrendingUp, Target } from 'lucide-react';
import { useState, useMemo } from 'react';

export interface Task {
  id: number;
  title: string;
  category: string;
  points: number;
  completed: boolean;
  created_at?: string;
}

interface StatisticsProps {
  tasks: Task[];
}

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export function Statistics({ tasks = [] }: StatisticsProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed);
    const totalCompleted = completedTasks.length;
    const totalPoints = completedTasks.reduce((acc, curr) => acc + curr.points, 0);
    const completionRate = tasks.length > 0 
      ? Math.round((totalCompleted / tasks.length) * 100) 
      : 0;

    // Get unique active dates
    const completedDates = Array.from(new Set(
      completedTasks
        .filter(t => t.created_at)
        .map(t => formatDate(new Date(t.created_at!)))
    )).sort((a, b) => a.localeCompare(b));

    // Calculate max streak
    let maxStreak = completedDates.length > 0 ? 1 : 0;
    let currentStreak = completedDates.length > 0 ? 1 : 0;

    for (let i = 1; i < completedDates.length; i++) {
        const d1 = new Date(completedDates[i-1]);
        const d2 = new Date(completedDates[i]);
        const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else if (diffDays > 1) {
            currentStreak = 1;
        }
    }

    // 7-Day Trend Chart
    const targetDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    let maxTrendValue = 0;
    const trendData = targetDates.map(date => {
      const dateStr = formatDate(date);
      // tasks created on this date
      const daysTasks = tasks.filter(t => t.created_at && formatDate(new Date(t.created_at)) === dateStr);
      const completedCount = daysTasks.filter(t => t.completed).length;
      if (completedCount > maxTrendValue) maxTrendValue = completedCount;

      return {
        label: `${date.getMonth() + 1}/${date.getDate()}`,
        dateStr,
        completedCount,
        totalCount: daysTasks.length
      };
    });

    return {
      totalCompleted,
      totalPoints,
      completionRate,
      maxStreak,
      trendData,
      maxTrendValue: maxTrendValue > 0 ? maxTrendValue : 5 // fallback scale to 5 if empty
    };
  }, [tasks]);

  return (
    <div className="flex-1 overflow-y-auto pb-20 bg-background relative pt-0">
      <header className="px-4 py-4 bg-card sticky top-0 z-10 border-b-2 border-foreground shadow-[0_4px_0_0_var(--color-foreground)] flex justify-center items-center">
        <h1 className="text-2xl font-bold font-heading">统计分析</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Overall Data Card */}
        <div className="card-sticker bg-quaternary text-foreground p-6 card-sticker-interactive">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full border-2 border-foreground bg-white flex items-center justify-center shadow-[2px_2px_0_0_#1E293B]">
               <Target size={18} />
            </div>
            <h2 className="text-lg font-bold font-heading">总体数据</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 gap-y-6">
            <div className="bg-white/40 rounded-xl p-3 border-2 border-foreground shadow-[4px_4px_0_0_#1E293B]">
              <div className="text-3xl font-black font-heading">{stats.totalCompleted}</div>
              <div className="text-xs font-bold mt-1 uppercase tracking-wide">累计完成任务</div>
            </div>
            <div className="bg-white/40 rounded-xl p-3 border-2 border-foreground shadow-[4px_4px_0_0_#1E293B]">
              <div className="text-3xl font-black font-heading text-tertiary" style={{ textShadow: '1px 1px 0 #1E293B, -1px -1px 0 #1E293B, 1px -1px 0 #1E293B, -1px 1px 0 #1E293B' }}>{stats.totalPoints.toLocaleString()}</div>
              <div className="text-xs font-bold mt-1 uppercase tracking-wide">累计获得积分</div>
            </div>
            <div className="bg-white/40 rounded-xl p-3 border-2 border-foreground shadow-[4px_4px_0_0_#1E293B]">
              <div className="text-2xl font-black font-heading">{stats.maxStreak}天</div>
              <div className="text-xs font-bold mt-1 uppercase tracking-wide">最长连续打卡</div>
            </div>
            <div className="bg-white/40 rounded-xl p-3 border-2 border-foreground shadow-[4px_4px_0_0_#1E293B]">
              <div className="text-2xl font-black font-heading">{stats.completionRate}%</div>
              <div className="text-xs font-bold mt-1 uppercase tracking-wide">平均完成率</div>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="card-sticker p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold font-heading text-lg">近七天打卡趋势</h3>
            <div className="w-8 h-8 rounded-full border-2 border-foreground bg-tertiary flex items-center justify-center shadow-[2px_2px_0_0_#1E293B]">
              <TrendingUp size={18} className="text-foreground" />
            </div>
          </div>
          <div className="h-56 mt-4 relative">
            <div className="absolute inset-0 pb-10 pt-6 px-3">
              <div className="relative w-full h-full">
                {/* SVG Line Chart */}
                <svg className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E293B" stopOpacity="0.2"></stop>
                      <stop offset="100%" stopColor="#1E293B" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="url(#line-gradient)"
                    stroke="none"
                    points={`0,100 ${stats.trendData.map((d, i) => `${(i / 6) * 100},${100 - (d.completedCount / stats.maxTrendValue) * 100}`).join(' ')} 100,100`}
                    vectorEffect="non-scaling-stroke"
                  />
                  <polyline
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={stats.trendData.map((d, i) => `${(i / 6) * 100},${100 - (d.completedCount / stats.maxTrendValue) * 100}`).join(' ')}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                
                <div className="absolute inset-0">
                  {stats.trendData.map((dayData, i) => {
                    const xPercent = (i / 6) * 100;
                    const yPercent = 100 - (dayData.completedCount / stats.maxTrendValue) * 100;
                    const isSelected = selectedDay === i;
                    
                    return (
                      <div 
                        key={i} 
                        className="absolute flex flex-col items-center cursor-pointer group z-10"
                        style={{ left: `${xPercent}%`, top: 0, height: '100%', width: '40px', transform: 'translateX(-50%)' }}
                        onClick={() => setSelectedDay(isSelected ? null : i)}
                      >
                        {/* Interactive Hover Area (Transparent) */}
                        <div className="absolute w-full h-full"></div>
                        
                        {isSelected && (
                          <div className="absolute top-1/2 -translate-y-[calc(100%+20px)] left-1/2 -translate-x-1/2 bg-foreground text-white text-xs font-bold font-heading px-3 py-1.5 border-2 border-foreground rounded-blob shadow-[2px_2px_0_0_#1E293B] whitespace-nowrap z-20"
                               style={{ marginTop: `${yPercent}%` }}>
                            完成了 {dayData.completedCount} 项
                          </div>
                        )}
                        
                        {/* Chart Data Point */}
                        <div 
                          className={`absolute w-4 h-4 rounded-full border-[3px] border-foreground transition-all duration-300 ${isSelected ? 'bg-tertiary scale-125 shadow-[2px_2px_0_0_#1E293B]' : 'bg-white group-hover:scale-110 shadow-[2px_2px_0_0_#1E293B]'}`}
                          style={{ top: `calc(${yPercent}% - 8px)`, left: '50%', transform: 'translateX(-50%)' }}
                        ></div>
                        
                        {/* X-axis Label */}
                        <div className={`absolute bottom-[-32px] text-xs uppercase font-bold tracking-wider w-12 text-center -translate-x-1/2 left-1/2 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {dayData.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medals & Achievements */}
        <div className="card-sticker bg-secondary mt-8 pl-4 pr-4 pt-4 pb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full border-2 border-foreground bg-white flex items-center justify-center shadow-[2px_2px_0_0_#1E293B]">
              <Award size={18} className="text-foreground" />
            </div>
            <h3 className="font-bold font-heading text-lg text-foreground tracking-wide">成就与徽章</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center mt-2">
            <div className={`flex flex-col items-center group ${stats.maxStreak >= 3 ? '' : 'opacity-40 grayscale'} hover:-translate-y-1 transition-transform`}>
              <div className="w-16 h-16 rounded-blob bg-primary border-2 border-foreground flex items-center justify-center mb-3 shadow-[4px_4px_0_0_#1E293B]">
                <span className="text-3xl">🌟</span>
              </div>
              <span className="text-xs font-bold font-heading uppercase tracking-wide text-foreground">初露锋芒</span>
              <span className="text-[10px] font-bold text-muted-foreground mt-1">打卡3天</span>
            </div>
            <div className={`flex flex-col items-center group ${stats.maxStreak >= 7 ? '' : 'opacity-40 grayscale'} hover:-translate-y-1 transition-transform`}>
              <div className="w-16 h-16 rounded-blob bg-tertiary border-2 border-foreground flex items-center justify-center mb-3 shadow-[4px_4px_0_0_#1E293B]">
                <span className="text-3xl">🔥</span>
              </div>
              <span className="text-xs font-bold font-heading uppercase tracking-wide text-foreground">火力全开</span>
              <span className="text-[10px] font-bold text-muted-foreground mt-1">打卡7天</span>
            </div>
            <div className={`flex flex-col items-center group ${stats.maxStreak >= 30 ? '' : 'opacity-40 grayscale'} hover:-translate-y-1 transition-transform`}>
              <div className="w-16 h-16 rounded-blob bg-[#8B5CF6] border-2 border-foreground flex items-center justify-center mb-3 shadow-[4px_4px_0_0_#1E293B]">
                <span className="text-3xl opacity-100">👑</span>
              </div>
              <span className="text-xs font-bold font-heading uppercase tracking-wide text-foreground">毅力王者</span>
              <span className="text-[10px] font-bold text-muted-foreground mt-1">打卡30天</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

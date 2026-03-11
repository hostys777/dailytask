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
    <div className="flex-1 overflow-y-auto pb-20 bg-gray-50">
      <header className="px-4 py-4 bg-white sticky top-0 z-10 shadow-sm text-center">
        <h1 className="text-xl font-bold">统计分析</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Overall Data Card */}
        <div className="bg-primary text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-4 opacity-90">
            <Target size={18} />
            <h2 className="text-sm font-medium">总体数据</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold">{stats.totalCompleted}</div>
              <div className="text-xs mt-1 opacity-80">累计完成任务</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.totalPoints.toLocaleString()}</div>
              <div className="text-xs mt-1 opacity-80">累计获得积分</div>
            </div>
            <div>
              <div className="text-xl font-bold">{stats.maxStreak}天</div>
              <div className="text-xs mt-1 opacity-80">最长连续打卡</div>
            </div>
            <div>
              <div className="text-xl font-bold">{stats.completionRate}%</div>
              <div className="text-xs mt-1 opacity-80">平均完成率</div>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">近七天打卡趋势</h3>
            <TrendingUp size={18} className="text-gray-400" />
          </div>
          <div className="h-40 flex items-end justify-between gap-2 mt-4 relative pt-6">
            {stats.trendData.map((dayData, i) => {
              const heightStr = `${Math.max((dayData.completedCount / stats.maxTrendValue) * 100, 4)}%`; // 4% is minimum bar height
              const isSelected = selectedDay === i;
              
              return (
                <div 
                  key={i} 
                  className="w-full flex flex-col items-center gap-2 relative cursor-pointer"
                  onClick={() => setSelectedDay(isSelected ? null : i)}
                >
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${isSelected ? 'bg-primary/80' : 'bg-primary/20 hover:bg-primary/40'}`}
                    style={{ height: heightStr }}
                  />
                  {isSelected && (
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-20">
                       完成了 {dayData.completedCount} 项
                       <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                     </div>
                  )}
                  <div className={`text-[10px] ${isSelected ? 'text-primary font-bold' : 'text-gray-400'}`}>
                    {dayData.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medals & Achievements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">成就与徽章</h3>
            <Award size={18} className="text-gray-400" />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className={`flex flex-col items-center group ${stats.maxStreak >= 3 ? '' : 'opacity-50 grayscale'}`}>
              <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-2 shadow-sm transition-transform">
                <span className="text-2xl">🌟</span>
              </div>
              <span className="text-xs font-medium text-gray-700">初露锋芒</span>
              <span className="text-[10px] text-gray-400 mt-1">打卡3天</span>
            </div>
            <div className={`flex flex-col items-center group ${stats.maxStreak >= 7 ? '' : 'opacity-50 grayscale'}`}>
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-2 shadow-sm transition-transform">
                <span className="text-2xl">🔥</span>
              </div>
              <span className="text-xs font-medium text-gray-700">火力全开</span>
              <span className="text-[10px] text-gray-400 mt-1">打卡7天</span>
            </div>
            <div className={`flex flex-col items-center group ${stats.maxStreak >= 30 ? '' : 'opacity-50 grayscale'}`}>
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2 border-2 border-dashed border-gray-300">
                <span className="text-2xl">👑</span>
              </div>
              <span className="text-xs font-medium text-gray-700">毅力王者</span>
              <span className="text-[10px] text-gray-400 mt-1">打卡30天</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

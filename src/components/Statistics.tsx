import React from 'react';
import { Award, TrendingUp, CheckSquare, Target } from 'lucide-react';

export function Statistics() {
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
              <div className="text-3xl font-bold">128</div>
              <div className="text-xs mt-1 opacity-80">累计完成任务</div>
            </div>
            <div>
              <div className="text-3xl font-bold">1,450</div>
              <div className="text-xs mt-1 opacity-80">累计获得积分</div>
            </div>
            <div>
              <div className="text-xl font-bold">12天</div>
              <div className="text-xs mt-1 opacity-80">最长连续打卡</div>
            </div>
            <div>
              <div className="text-xl font-bold">85%</div>
              <div className="text-xs mt-1 opacity-80">平均完成率</div>
            </div>
          </div>
        </div>

        {/* Trend Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">近七天打卡趋势</h3>
            <TrendingUp size={18} className="text-gray-400" />
          </div>
          <div className="h-40 flex items-end justify-between gap-2 mt-4 relative pt-6">
            {/* Simple Bar Chart */}
            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-primary/20 rounded-t-md relative group hover:bg-primary/40 transition-colors"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                  </div>
                </div>
                <div className="text-[10px] text-gray-400">3/{i+1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Medals & Achievements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">成就与徽章</h3>
            <Award size={18} className="text-gray-400" />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-2xl">🌟</span>
              </div>
              <span className="text-xs font-medium text-gray-700">初露锋芒</span>
              <span className="text-[10px] text-gray-400 mt-1">打卡3天</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-2xl">🔥</span>
              </div>
              <span className="text-xs font-medium text-gray-700">火力全开</span>
              <span className="text-[10px] text-gray-400 mt-1">打卡7天</span>
            </div>
            <div className="flex flex-col items-center group cursor-pointer opacity-50 grayscale">
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

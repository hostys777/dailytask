import React, { useState } from 'react';
import { Home, CheckSquare, BarChart2, User, Plus, CheckCircle2, Circle, Award, ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [tasks, setTasks] = useState([
    { id: 1, title: '早起喝一杯排毒水', category: '健康生活', points: 10, completed: true },
    { id: 2, title: '学习React两小时', category: '自我提升', points: 20, completed: false },
    { id: 3, title: '跑步3公里', category: '运动健身', points: 15, completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen pb-20 font-sans shadow-lg overflow-hidden flex flex-col relative">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center px-4 py-4 bg-white sticky top-0 z-10 shadow-sm">
          <div className="text-xl font-bold">每日任务</div>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
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
              <span className="text-4xl font-bold">12</span>
              <span className="ml-1 text-sm opacity-80">天</span>
            </div>
            <div className="bg-white/20 rounded-full h-2 mb-2 overflow-hidden">
              <div className="bg-white h-full rounded-full" style={{ width: '60%' }}></div>
            </div>
            <div className="flex justify-between text-xs opacity-80">
              <span>当前进度</span>
              <span>距离目标还差8天</span>
            </div>
          </div>
        </div>

        {/* Today's Tasks Area */}
        <div className="px-4 py-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">今日任务</h3>
            <span className="text-sm text-gray-500 cursor-pointer">全部 &gt;</span>
          </div>
          
          <div className="space-y-3">
            {tasks.map(task => (
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
                  <div className={`font-medium ${task.completed ? 'text-gray-800 line-through opacity-70' : 'text-gray-800'}`}>
                    {task.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{task.category}</div>
                </div>
                <div className="text-sm text-yellow-500 font-medium">+{task.points} 积分</div>
              </div>
            ))}

            {/* Add Task Button */}
            <button className="w-full mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-1">
              <Plus size={24} className="text-primary opacity-60" />
              <span className="text-sm font-medium">添加新任务</span>
            </button>
          </div>
        </div>

        {/* Monthly Statistics Card */}
        <div className="p-4 mt-2 mb-6">
          <h3 className="text-lg font-bold mb-4">月度统计</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-center text-center mb-6 pt-2">
              <div>
                <div className="text-2xl font-bold text-gray-800">85%</div>
                <div className="text-xs text-gray-500 mt-1">完成率</div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-gray-800">24</div>
                <div className="text-xs text-gray-500 mt-1">本月打卡</div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">320</div>
                <div className="text-xs text-gray-500 mt-1">获得积分</div>
              </div>
            </div>

            {/* Calendar */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-sm">2026年3月</span>
                <div className="flex gap-2">
                  <ChevronLeft size={16} className="text-gray-400" />
                  <ChevronRight size={16} className="text-gray-400" />
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
                <div className="p-1 opacity-40">22</div>
                <div className="p-1 opacity-40">23</div>
                {[...Array(6)].map((_, i) => (
                  <div key={`d1-${i}`} className="p-1 m-0.5 rounded-full bg-primary/10 text-primary">
                    {i + 24}
                  </div>
                ))}
                <div className="p-1 m-0.5 rounded-full bg-gray-100 text-gray-700">2</div>
                {[...Array(4)].map((_, i) => (
                  <div key={`d2-${i}`} className="p-1 m-0.5 rounded-full bg-primary/10 text-primary">
                    {i + 3}
                  </div>
                ))}
                <div className="p-1 m-0.5 rounded-full bg-gray-100 text-gray-700">7</div>
                {[...Array(2)].map((_, i) => (
                  <div key={`d3-${i}`} className="p-1 m-0.5 rounded-full bg-primary/10 text-primary">
                    {i + 8}
                  </div>
                ))}
                {[...Array(14)].map((_, i) => (
                  <div key={`u-${i}`} className={`p-1 m-0.5 rounded-full ${i===0 ? 'bg-primary text-white font-bold' : ''}`}>
                    {i + 10}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="bg-white border-t border-gray-200 flex justify-around items-center absolute bottom-0 w-full z-10 pb-safe">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-3 px-4 ${activeTab === 'home' ? 'text-primary' : 'text-gray-400'}`}
        >
          <Home size={24} />
          <span className="text-[10px] mt-1 font-medium">首页</span>
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center py-3 px-4 ${activeTab === 'tasks' ? 'text-primary' : 'text-gray-400'}`}
        >
          <CheckSquare size={24} />
          <span className="text-[10px] mt-1">任务</span>
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center py-3 px-4 ${activeTab === 'stats' ? 'text-primary' : 'text-gray-400'}`}
        >
          <BarChart2 size={24} />
          <span className="text-[10px] mt-1">统计</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-3 px-4 ${activeTab === 'profile' ? 'text-primary' : 'text-gray-400'}`}
        >
          <User size={24} />
          <span className="text-[10px] mt-1">我的</span>
        </button>
      </nav>
    </div>
  );
}

export default App;

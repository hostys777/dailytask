import React, { useState } from 'react';
import { Home, CheckSquare, BarChart2, User } from 'lucide-react';
import { HomeFeed } from './components/Home';
import { Tasks } from './components/Tasks';
import { Statistics } from './components/Statistics';
import { Profile } from './components/Profile';
import { AddTask } from './components/AddTask';
import { AuthPage } from './components/AuthPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('login'); // Start with login
  const [tasks, setTasks] = useState([
    { id: 1, title: '早起喝一杯排毒水', category: '健康生活', points: 10, completed: true },
    { id: 2, title: '学习React两小时', category: '自我提升', points: 20, completed: false },
    { id: 3, title: '跑步3公里', category: '运动健身', points: 15, completed: false },
    { id: 4, title: '阅读10页书', category: '自我提升', points: 10, completed: false },
    { id: 5, title: '清理桌面工作区', category: '其他', points: 5, completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (newTask: { title: string; category: string; points: number }) => {
    setTasks([...tasks, { id: Date.now(), ...newTask, completed: false }]);
  };

  // Pages that don't need BottomNav
  if (activeTab === 'login' || activeTab === 'register') {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen shadow-lg font-sans flex flex-col relative overflow-hidden">
        <AuthPage isLogin={activeTab === 'login'} onNavigate={setActiveTab} />
      </div>
    );
  }

  if (activeTab === 'add') {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen shadow-lg font-sans flex flex-col relative overflow-hidden bg-gray-50">
        <AddTask onBack={() => setActiveTab('home')} onAdd={addTask} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen font-sans shadow-lg overflow-hidden flex flex-col relative">
      {/* Current Page Content */}
      {activeTab === 'home' && <HomeFeed tasks={tasks} toggleTask={toggleTask} onNavigate={setActiveTab} />}
      {activeTab === 'tasks' && <Tasks tasks={tasks} toggleTask={toggleTask} />}
      {activeTab === 'stats' && <Statistics />}
      {activeTab === 'profile' && <Profile onNavigate={setActiveTab} />}

      {/* Bottom Nav */}
      <nav className="bg-white border-t border-gray-200 flex justify-around items-center absolute bottom-0 w-full z-10 pb-1 text-sm">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-3 px-4 ${activeTab === 'home' ? 'text-primary drop-shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Home size={24} />
          <span className="text-[10px] mt-1 font-medium">首页</span>
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center py-3 px-4 ${activeTab === 'tasks' ? 'text-primary drop-shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <CheckSquare size={24} />
          <span className="text-[10px] mt-1 font-medium">任务</span>
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center py-3 px-4 ${activeTab === 'stats' ? 'text-primary drop-shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <BarChart2 size={24} />
          <span className="text-[10px] mt-1 font-medium">统计</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-3 px-4 ${activeTab === 'profile' ? 'text-primary drop-shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <User size={24} />
          <span className="text-[10px] mt-1 font-medium">我的</span>
        </button>
      </nav>
    </div>
  );
}

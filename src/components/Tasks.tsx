import { useState } from 'react';
import { Search, CheckCircle2, Circle } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  category: string;
  points: number;
  completed: boolean;
}

interface TasksProps {
  tasks: Task[];
  toggleTask: (id: number) => void;
}

export function Tasks({ tasks, toggleTask }: TasksProps) {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['全部', '健康生活', '自我提升', '运动健身', '其他'];

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = activeCategory === '全部' || task.category === activeCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto pb-20 bg-gray-50">
      <header className="px-4 py-4 bg-white sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-center">任务管理</h1>
      </header>

      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="搜索任务..."
            className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="text-gray-400 absolute left-3.5 top-3" />
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
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
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">
              没有找到相关任务
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

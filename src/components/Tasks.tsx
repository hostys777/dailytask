import { useState } from 'react';
import { Search, CheckCircle2, Circle, CheckSquare, Trash2, X, CheckSquare2 } from 'lucide-react';

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
  deleteTasks?: (ids: number[]) => Promise<void>;
  completeTasks?: (ids: number[]) => Promise<void>;
}

export function Tasks({ tasks, toggleTask, deleteTasks, completeTasks }: TasksProps) {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Batch management states
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);

  const categories = ['全部', '健康生活', '自我提升', '运动健身', '其他'];

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = activeCategory === '全部' || task.category === activeCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTaskClick = (id: number) => {
    if (isBatchMode) {
      // Toggle selection
      setSelectedTaskIds(prev => 
        prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
      );
    } else {
      // Normal toggle
      toggleTask(id);
    }
  };

  const toggleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map(t => t.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (deleteTasks && selectedTaskIds.length > 0) {
      if (confirm(`确定要删除选中的 ${selectedTaskIds.length} 个任务吗？`)) {
        await deleteTasks(selectedTaskIds);
        setSelectedTaskIds([]);
        setIsBatchMode(false);
      }
    }
  };

  const handleCompleteSelected = async () => {
    if (completeTasks && selectedTaskIds.length > 0) {
      await completeTasks(selectedTaskIds);
      setSelectedTaskIds([]);
      setIsBatchMode(false);
    }
  };

  const exitBatchMode = () => {
    setIsBatchMode(false);
    setSelectedTaskIds([]);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 bg-gray-50 relative">
      <header className="px-4 py-4 bg-white sticky top-0 z-10 shadow-sm flex items-center justify-between">
        {isBatchMode ? (
          <button onClick={exitBatchMode} className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <X size={20} /> <span className="text-sm">取消</span>
          </button>
        ) : (
          <div className="w-10"></div> // Spacer
        )}
        <h1 className="text-xl font-bold text-center flex-1">任务管理</h1>
        {!isBatchMode ? (
          <button 
            onClick={() => setIsBatchMode(true)}
            className="text-primary text-sm font-medium hover:text-primary/80"
          >
            批量管理
          </button>
        ) : (
          <button 
            onClick={toggleSelectAll}
            className="text-primary text-sm font-medium hover:text-primary/80"
          >
            {selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0 ? '全不选' : '全选'}
          </button>
        )}
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
            disabled={isBatchMode}
          />
          <Search size={18} className="text-gray-400 absolute left-3.5 top-3" />
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              disabled={isBatchMode}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200'
              } ${isBatchMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => {
              const isSelected = selectedTaskIds.includes(task.id);
              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-lg p-4 flex items-center shadow-sm border cursor-pointer transition-all hover:bg-gray-50 ${
                    isSelected ? 'border-primary ring-1 ring-primary/20' : 'border-gray-100'
                  }`}
                  onClick={() => handleTaskClick(task.id)}
                >
                  {isBatchMode ? (
                    <div className="mr-3">
                      {isSelected ? (
                        <CheckSquare className="text-primary" size={20} />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0" />
                      )}
                    </div>
                  ) : (
                    task.completed ? (
                      <CheckCircle2 size={24} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle size={24} className="text-gray-300 flex-shrink-0" />
                    )
                  )}
                  
                  <div className={`ml-1 flex-1 ${isBatchMode ? '' : 'ml-3'}`}>
                    <div className={`font-medium ${task.completed ? 'text-gray-800 line-through opacity-70' : 'text-gray-800'}`}>
                      {task.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{task.category}</div>
                  </div>
                  <div className="text-sm text-yellow-500 font-medium">+{task.points} 积分</div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">
              没有找到相关任务
            </div>
          )}
        </div>
      </div>

      {/* Batch Action Floating Bar */}
      {isBatchMode && (
        <div className="fixed bottom-[4rem] left-0 right-0 max-w-md mx-auto p-4 animate-in slide-in-from-bottom-5">
          <div className="bg-gray-900 text-white rounded-xl shadow-xl flex items-center justify-between p-3 px-5">
            <span className="text-sm font-medium">已选择 {selectedTaskIds.length} 项</span>
            <div className="flex gap-3">
              <button 
                onClick={handleCompleteSelected}
                disabled={selectedTaskIds.length === 0}
                className="p-2 rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors flex flex-col items-center gap-1"
                title="标记为完成"
              >
                <CheckSquare2 size={18} />
              </button>
              <button 
                onClick={handleDeleteSelected}
                disabled={selectedTaskIds.length === 0}
                className="p-2 rounded-lg text-red-400 hover:bg-white/20 disabled:opacity-50 transition-colors flex flex-col items-center gap-1"
                title="删除"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

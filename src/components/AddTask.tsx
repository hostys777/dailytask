import React, { useState } from 'react';
import { ArrowLeft, Check, ListTodo, Hash } from 'lucide-react';

interface AddTaskProps {
  onBack: () => void;
  onAdd: (task: { title: string; category: string; points: number }) => void;
}

export function AddTask({ onBack, onAdd }: AddTaskProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('健康生活');
  const [points, setPoints] = useState(10);

  const categories = ['健康生活', '自我提升', '运动健身', '其他'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title,
      category,
      points: Number(points)
    });
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen relative z-40">
      <header className="px-4 py-4 bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">新建任务</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6 flex-1 flex flex-col">
        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">
          {/* Title Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <ListTodo size={16} className="text-primary" />
              任务名称
            </label>
            <input
              type="text"
              placeholder="例如：每天喝8杯水"
              className="w-full border-b-2 border-gray-200 focus:border-primary py-2 text-lg text-gray-800 placeholder-gray-300 focus:outline-none bg-transparent transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2 mt-4">
              <Hash size={16} className="text-primary" />
              分类标签
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    category === cat
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Points Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 mt-4">
              <span className="text-yellow-500 font-bold">✨</span>
              完成奖励（积分）
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                className="flex-1 accent-primary"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
              />
              <div className="w-12 text-center font-bold text-yellow-500 bg-yellow-50 py-1 rounded-md">
                {points}
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
              <span>简单 (5)</span>
              <span>困难 (50)</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-auto pb-4">
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full bg-primary disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={20} />
            保存任务
          </button>
        </div>
      </form>
    </div>
  );
}

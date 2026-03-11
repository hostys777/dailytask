import { useState } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import 'remixicon/fonts/remixicon.css';

interface AddTaskProps {
  onBack: () => void;
  onAdd: (task: { title: string; category: string; points: number; [key: string]: any }) => void;
}

const PRESET_ICONS = [
  'ri-book-read-line',
  'ri-run-line',
  'ri-macbook-line',
  'ri-cup-line',
  'ri-music-2-line',
  'ri-heart-pulse-line',
  'ri-star-line',
  'ri-sun-line'
];

const PRESET_CATEGORIES = ['日常习惯', '学习提升', '健康运动', '工作效率'];
const REPEAT_CYCLES = ['每日', '每周', '每月', '自定义'];

export function AddTask({ onBack, onAdd }: AddTaskProps) {
  // 1. Form State
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(PRESET_ICONS[0]);
  
  const [category, setCategory] = useState('学习提升');
  const [customCategoryStr, setCustomCategoryStr] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const [repeatCycle, setRepeatCycle] = useState('每日');
  
  const [enableReminder, setEnableReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('');

  const [description, setDescription] = useState('');

  const [enableGoal, setEnableGoal] = useState(false);
  const [continuousGoal, setContinuousGoal] = useState(7);
  const [weeklyGoal, setWeeklyGoal] = useState(3);

  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Check if form changed (for exit prompt)
  const isDirty = title !== '' || 
                  selectedIcon !== PRESET_ICONS[0] ||
                  category !== '学习提升' || 
                  repeatCycle !== '每日' ||
                  enableReminder !== false ||
                  description !== '' ||
                  enableGoal !== false;

  const handleBackClick = () => {
    if (isDirty) {
      setShowConfirmExit(true);
    } else {
      onBack();
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("请输入任务名称");
      setTitleError(true);
      return;
    }
    if (title.length > 50) {
      alert("任务名称不能超过50个字符");
      return;
    }
    if (enableReminder && !reminderTime) {
      alert("请选择有效的提醒时间");
      return;
    }

    // Save Logic
    onAdd({
      title,
      category: category === '自定义' ? customCategoryStr : category,
      points: 10, // Default passing to App
      icon: selectedIcon,
      repeatCycle,
      reminderTime: enableReminder ? reminderTime : null,
      description,
      continuousGoal: enableGoal ? continuousGoal : null,
      weeklyGoal: enableGoal ? weeklyGoal : null
    });

    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
      onBack();
    }, 1000);
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen relative z-40 pb-24">
      {/* 2.1 顶部导航栏 */}
      <header className="px-4 py-3 bg-white flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <button onClick={handleBackClick} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">新建任务</h1>
        <button onClick={handleSave} className="text-[#3B82F6] font-medium text-sm px-2">
          保存
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        
        {/* 2.2 任务名称 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <input
            type="text"
            placeholder="输入任务名称..."
            maxLength={50}
            className={`w-full text-lg border-b-2 py-2 focus:outline-none transition-colors ${
              titleError ? 'border-red-500' : 'border-gray-200 focus:border-[#3B82F6]'
            }`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setTitleError(false);
            }}
          />
          {titleError && <p className="text-red-500 text-xs mt-1">名称不能为空</p>}
        </div>

        {/* 2.3 任务图标选择 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">任务图标</h2>
          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {PRESET_ICONS.map((iconClass, i) => {
              const isSelected = selectedIcon === iconClass;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedIcon(iconClass)}
                  className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-all ${
                    isSelected 
                    ? 'bg-[#DBEAFE] border-2 border-[#3B82F6] text-[#3B82F6]' 
                    : 'bg-[#F3F4F6] border-2 border-transparent text-gray-500'
                  }`}
                >
                  <i className={`${iconClass} text-xl`}></i>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2.4 任务分类 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">任务分类</h2>
          <div className="flex flex-wrap gap-2">
            {PRESET_CATEGORIES.map(cat => {
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setShowCustomCategory(false); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    isSelected
                    ? 'bg-[#EFF6FF] text-[#3B82F6] border-[#BFDBFE]'
                    : 'bg-white text-gray-600 border-[#E5E7EB]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
            <button
              onClick={() => { setCategory('自定义'); setShowCustomCategory(true); }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center ${
                category === '自定义'
                ? 'bg-[#EFF6FF] text-[#3B82F6] border-[#BFDBFE]'
                : 'bg-white text-gray-600 border-[#E5E7EB]'
              }`}
            >
              + 自定义
            </button>
          </div>
          
          {showCustomCategory && (
            <input
              type="text"
              placeholder="输入自定义分类"
              className="mt-3 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B82F6]"
              value={customCategoryStr}
              onChange={e => setCustomCategoryStr(e.target.value)}
            />
          )}
        </div>

        {/* 2.5 重复周期 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">重复周期</h2>
          <div className="grid grid-cols-4 gap-2">
            {REPEAT_CYCLES.map(cycle => {
              const isSelected = repeatCycle === cycle;
              return (
                <button
                  key={cycle}
                  onClick={() => setRepeatCycle(cycle)}
                  className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                    isSelected
                    ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                    : 'bg-white text-gray-500 border-gray-200'
                  }`}
                >
                  {cycle}
                </button>
              );
            })}
          </div>
          {repeatCycle === '自定义' && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 text-center border border-dashed border-gray-300">
              展开高级周期配置（周几/日期等）...
            </div>
          )}
        </div>

        {/* 2.6 提醒时间 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <i className="ri-alarm-line text-lg text-gray-400"></i>
              提醒时间
            </h2>
            {/* Toggle Switch */}
            <div 
              className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enableReminder ? 'bg-[#3B82F6]' : 'bg-gray-300'}`}
              onClick={() => setEnableReminder(!enableReminder)}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${enableReminder ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
          </div>
          
          {enableReminder && (
            <div className="mt-4 pt-3 border-t border-gray-100 relative">
               <input
                type="time"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] block p-3"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                placeholder="选择时间..."
              />
            </div>
          )}
        </div>

        {/* 2.7 任务描述 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">任务描述 <span className="text-gray-400 font-normal text-xs">(选填)</span></h2>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#3B82F6] resize-none"
            rows={3}
            placeholder="添加任务描述..."
            maxLength={200}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div className="text-right text-[10px] text-gray-400 mt-1">{description.length}/200</div>
        </div>

        {/* 2.8 目标设置 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-sm font-semibold text-gray-700">配置目标 <span className="text-gray-400 font-normal text-xs">(选填)</span></h2>
            <div 
              className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enableGoal ? 'bg-[#3B82F6]' : 'bg-gray-300'}`}
              onClick={() => setEnableGoal(!enableGoal)}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${enableGoal ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
          </div>
          
          {enableGoal && (
            <div className="mt-4 space-y-4 pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">连续打卡目标 (天)</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setContinuousGoal(Math.max(1, continuousGoal - 1))}
                    disabled={continuousGoal <= 1}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  ><Minus size={14} /></button>
                  <span className="w-6 text-center font-medium text-sm">{continuousGoal}</span>
                  <button 
                    onClick={() => setContinuousGoal(Math.min(30, continuousGoal + 1))}
                    disabled={continuousGoal >= 30}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  ><Plus size={14} /></button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">每周打卡目标 (次)</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setWeeklyGoal(Math.max(1, weeklyGoal - 1))}
                    disabled={weeklyGoal <= 1}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  ><Minus size={14} /></button>
                  <span className="w-6 text-center font-medium text-sm">{weeklyGoal}</span>
                  <button 
                    onClick={() => setWeeklyGoal(Math.min(7, weeklyGoal + 1))}
                    disabled={weeklyGoal >= 7}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  ><Plus size={14} /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2.9 创建任务按钮 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/90 backdrop-blur border-t border-gray-100 z-10">
        <button
          onClick={handleSave}
          className="w-full bg-[#3B82F6] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-blue-600 active:scale-[0.98] transition-all"
        >
          创建任务
        </button>
      </div>

      {/* 退出确认弹窗 */}
      {showConfirmExit && (
        <div className="fixed inset-0 min-h-screen bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl font-sans">
            <h3 className="text-lg font-bold text-gray-800 mb-2">放弃编辑？</h3>
            <p className="text-sm text-gray-500 mb-6">当前有未保存的内容，退出将丢失这些修改。</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmExit(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => { setShowConfirmExit(false); onBack(); }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                放弃
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 创建成功 Toast */}
      {isToastVisible && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-5 py-3 rounded-xl shadow-xl z-50 flex flex-col items-center gap-2 max-w-[200px] w-full animate-in fade-in zoom-in duration-200">
          <i className="ri-checkbox-circle-fill text-3xl text-green-400"></i>
          <span className="font-medium text-sm">创建成功</span>
        </div>
      )}
      
    </div>
  );
}

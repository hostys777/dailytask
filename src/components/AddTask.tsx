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
    <div className="flex flex-col bg-background min-h-screen relative z-40 pb-24 bg-dot-grid">
      {/* 2.1 顶部导航栏 */}
      <header className="px-4 py-3 bg-card flex items-center justify-between sticky top-0 z-20 border-b-2 border-foreground shadow-[0_4px_0_0_#1E293B]">
        <button onClick={handleBackClick} className="p-2 -ml-2 rounded-full hover:bg-quaternary border-2 border-transparent hover:border-foreground transition-all">
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold font-heading text-foreground uppercase tracking-wide">新建任务</h1>
        <button onClick={handleSave} className="text-foreground font-bold font-heading text-sm px-4 py-1.5 bg-primary border-2 border-foreground rounded-blob shadow-[2px_2px_0_0_#1E293B] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all active:scale-95">
          保存
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        
        {/* 2.2 任务名称 */}
        <div className="card-sticker bg-white p-4">
          <input
            type="text"
            placeholder="输入任务名称..."
            maxLength={50}
            className={`w-full text-lg font-heading font-bold bg-transparent border-b-4 py-2 focus:outline-none transition-colors ${
              titleError ? 'border-destructive' : 'border-foreground focus:border-tertiary'
            }`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setTitleError(false);
            }}
          />
          {titleError && <p className="text-destructive font-bold text-xs mt-2 font-heading">名称不能为空</p>}
        </div>

        {/* 2.3 任务图标选择 */}
        <div className="card-sticker bg-white p-4">
          <h2 className="text-sm font-bold font-heading text-foreground mb-3 uppercase tracking-wide">任务图标</h2>
          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {PRESET_ICONS.map((iconClass, i) => {
              const isSelected = selectedIcon === iconClass;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedIcon(iconClass)}
                  className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-blob cursor-pointer transition-all border-2 border-foreground ${
                    isSelected 
                    ? 'bg-tertiary text-foreground shadow-[2px_2px_0_0_#1E293B] -translate-y-1' 
                    : 'bg-muted/10 text-muted-foregroundhover:bg-muted/20'
                  }`}
                >
                  <i className={`${iconClass} text-2xl`}></i>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2.4 任务分类 */}
        <div className="card-sticker bg-white p-4">
          <h2 className="text-sm font-bold font-heading text-foreground mb-3 uppercase tracking-wide">任务分类</h2>
          <div className="flex flex-wrap gap-3">
            {PRESET_CATEGORIES.map(cat => {
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setShowCustomCategory(false); }}
                  className={`px-4 py-2 rounded-full text-xs font-bold font-heading uppercase tracking-wide border-2 border-foreground transition-all ${
                    isSelected
                    ? 'bg-primary text-foreground shadow-[2px_2px_0_0_#1E293B] -translate-y-0.5'
                    : 'bg-white text-muted-foregroundhover:bg-quaternary'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
            <button
              onClick={() => { setCategory('自定义'); setShowCustomCategory(true); }}
              className={`px-4 py-2 rounded-full text-xs font-bold font-heading uppercase tracking-wide border-2 border-foreground transition-all flex items-center ${
                category === '自定义'
                ? 'bg-primary text-foreground shadow-[2px_2px_0_0_#1E293B] -translate-y-0.5'
                : 'bg-white text-muted-foregroundhover:bg-quaternary'
              }`}
            >
              + 自定义
            </button>
          </div>
          
          {showCustomCategory && (
            <input
              type="text"
              placeholder="输入自定义分类"
              className="mt-4 w-full border-2 border-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:shadow-[4px_4px_0_0_#1E293B] transition-shadow font-bold bg-muted/10"
              value={customCategoryStr}
              onChange={e => setCustomCategoryStr(e.target.value)}
            />
          )}
        </div>

        {/* 2.5 重复周期 */}
        <div className="card-sticker bg-white p-4">
          <h2 className="text-sm font-bold font-heading text-foreground mb-3 uppercase tracking-wide">重复周期</h2>
          <div className="grid grid-cols-4 gap-3">
            {REPEAT_CYCLES.map(cycle => {
              const isSelected = repeatCycle === cycle;
              return (
                <button
                  key={cycle}
                  onClick={() => setRepeatCycle(cycle)}
                  className={`py-3 rounded-blob text-xs font-bold font-heading border-2 transition-all ${
                    isSelected
                    ? 'bg-foreground text-white border-foreground shadow-[2px_2px_0_0_var(--color-primary)] -translate-y-0.5'
                    : 'bg-white text-foreground border-foreground hover:bg-quaternary'
                  }`}
                >
                  {cycle}
                </button>
              );
            })}
          </div>
          {repeatCycle === '自定义' && (
            <div className="mt-4 p-4 bg-quaternary rounded-xl text-xs font-bold text-foreground text-center border-2 border-dashed border-foreground">
              展开高级周期配置（周几/日期等）...
            </div>
          )}
        </div>

        {/* 2.6 提醒时间 */}
        <div className="card-sticker bg-white p-4 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2 uppercase tracking-wide">
              <i className="ri-alarm-line text-xl"></i>
              提醒时间
            </h2>
            {/* Toggle Switch */}
            <div 
              className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors border-2 border-foreground ${enableReminder ? 'bg-primary' : 'bg-muted'}`}
              onClick={() => setEnableReminder(!enableReminder)}
            >
              <div className={`bg-white border-2 border-foreground w-5 h-5 rounded-full transform transition-transform ${enableReminder ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
          </div>
          
          {enableReminder && (
            <div className="mt-4 pt-4 border-t-2 border-dashed border-foreground relative">
               <input
                type="time"
                className="w-full bg-background border-2 border-foreground text-foreground font-bold text-lg rounded-xl focus:outline-none focus:shadow-[4px_4px_0_0_#1E293B] block p-3 transition-shadow"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                placeholder="选择时间..."
              />
            </div>
          )}
        </div>

        {/* 2.7 任务描述 */}
        <div className="card-sticker bg-white p-4">
          <h2 className="text-sm font-bold font-heading text-foreground mb-3 uppercase tracking-wide">任务描述 <span className="text-muted-foregroundfont-normal text-xs">(选填)</span></h2>
          <textarea
            className="w-full border-2 border-foreground rounded-xl p-4 text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0_0_#1E293B] transition-shadow resize-none bg-background"
            rows={3}
            placeholder="添加任务描述..."
            maxLength={200}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div className="text-right text-[10px] font-bold text-muted-foregroundmt-2">{description.length}/200</div>
        </div>

        {/* 2.8 目标设置 */}
        <div className="card-sticker bg-white p-4">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-sm font-bold font-heading text-foreground uppercase tracking-wide">配置目标 <span className="text-muted-foregroundfont-normal text-xs">(选填)</span></h2>
            <div 
              className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors border-2 border-foreground ${enableGoal ? 'bg-primary' : 'bg-muted'}`}
              onClick={() => setEnableGoal(!enableGoal)}
            >
              <div className={`bg-white border-2 border-foreground w-5 h-5 rounded-full transform transition-transform ${enableGoal ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
          </div>
          
          {enableGoal && (
            <div className="mt-4 space-y-4 pt-4 border-t-2 border-dashed border-foreground">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-foreground">连续打卡目标 (天)</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setContinuousGoal(Math.max(1, continuousGoal - 1))}
                    disabled={continuousGoal <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-foreground text-foreground shadow-[2px_2px_0_0_#1E293B] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none disabled:opacity-50 disabled:shadow-none transition-all"
                  ><Minus size={16} strokeWidth={3} /></button>
                  <span className="w-8 text-center font-black font-heading text-lg">{continuousGoal}</span>
                  <button 
                    onClick={() => setContinuousGoal(Math.min(30, continuousGoal + 1))}
                    disabled={continuousGoal >= 30}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-foreground text-foreground shadow-[2px_2px_0_0_#1E293B] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none disabled:opacity-50 disabled:shadow-none transition-all"
                  ><Plus size={16} strokeWidth={3} /></button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-foreground">每周打卡目标 (次)</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setWeeklyGoal(Math.max(1, weeklyGoal - 1))}
                    disabled={weeklyGoal <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-foreground text-foreground shadow-[2px_2px_0_0_#1E293B] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none disabled:opacity-50 disabled:shadow-none transition-all"
                  ><Minus size={16} strokeWidth={3} /></button>
                  <span className="w-8 text-center font-black font-heading text-lg">{weeklyGoal}</span>
                  <button 
                    onClick={() => setWeeklyGoal(Math.min(7, weeklyGoal + 1))}
                    disabled={weeklyGoal >= 7}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white border-2 border-foreground text-foreground shadow-[2px_2px_0_0_#1E293B] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none disabled:opacity-50 disabled:shadow-none transition-all"
                  ><Plus size={16} strokeWidth={3} /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2.9 创建任务按钮 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-background z-10 border-t-2 border-foreground">
        <button
          onClick={handleSave}
          className="btn-candy w-full py-4 text-lg font-black tracking-widest text-foreground bg-primary border-2 border-foreground"
        >
          创建任务
        </button>
      </div>

      {/* 退出确认弹窗 */}
      {showConfirmExit && (
        <div className="fixed inset-0 min-h-screen bg-foreground/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-sticker bg-white p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold font-heading text-foreground mb-4">放弃编辑？</h3>
            <p className="text-sm font-bold text-muted-foregroundmb-8">当前有未保存的内容，退出将丢失这些修改。</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirmExit(false)}
                className="flex-1 py-3 rounded-blob bg-white border-2 border-foreground text-foreground font-bold font-heading shadow-[4px_4px_0_0_#1E293B] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
              >
                取消
              </button>
              <button 
                onClick={() => { setShowConfirmExit(false); onBack(); }}
                className="flex-1 py-3 rounded-blob bg-destructive border-2 border-foreground text-white font-bold font-heading shadow-[4px_4px_0_0_#1E293B] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
              >
                放弃
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 创建成功 Toast */}
      {isToastVisible && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 card-sticker bg-foreground text-white px-6 py-4 z-50 flex flex-col items-center gap-3 max-w-[200px] w-full animate-in fade-in zoom-in duration-200">
          <i className="ri-checkbox-circle-fill text-4xl text-primary drop-shadow-[2px_2px_0_rgba(0,0,0,1)]"></i>
          <span className="font-bold font-heading text-base tracking-widest">创建成功</span>
        </div>
      )}
      
    </div>
  );
}

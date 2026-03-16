import { useState } from 'react';
import { Search, CheckCircle2, CheckSquare, Trash2, X, ChevronRight } from 'lucide-react';
import type { Task, SubTask } from '../App';

interface TasksProps {
  tasks: Task[];
  toggleTask: (id: number) => void;
  deleteTasks?: (ids: number[]) => Promise<void>;
  completeTasks?: (ids: number[]) => Promise<void>;
  updateTaskProgress?: (id: number, current_progress: number, subtasks?: SubTask[]) => void;
}

export function Tasks({ tasks, toggleTask, deleteTasks, completeTasks, updateTaskProgress }: TasksProps) {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Batch management states
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const categories = ['全部', '健康生活', '自我提升', '运动健身', '其他'];

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = activeCategory === '全部' || task.category === activeCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTaskClick = (task: Task) => {
    if (isBatchMode) {
      // Toggle selection
      setSelectedTaskIds(prev => 
        prev.includes(task.id) ? prev.filter(tid => tid !== task.id) : [...prev, task.id]
      );
    } else {
      if (task.type === 'progress') {
        setExpandedTaskId(expandedTaskId === task.id ? null : task.id);
      } else {
        // Normal toggle
        toggleTask(task.id);
      }
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
      if (confirm(`确定要删除选中�?${selectedTaskIds.length} 个任务吗？`)) {
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
    <div className="flex-1 overflow-y-auto pb-20 bg-background relative pt-0">
      <header className="px-4 py-4 bg-card sticky top-0 z-10 border-b-2 border-foreground shadow-[0_4px_0_0_var(--color-foreground)] flex items-center justify-between">
        {isBatchMode ? (
          <button onClick={exitBatchMode} className="text-foreground font-bold flex items-center gap-1 hover:text-secondary transition-colors">
            <X size={20} strokeWidth={3} /> <span className="text-sm font-heading">取消</span>
          </button>
        ) : (
          <div className="w-10"></div> // Spacer
        )}
        <h1 className="text-2xl font-bold font-heading text-center flex-1">任务管理</h1>
        {!isBatchMode ? (
          <button 
            onClick={() => setIsBatchMode(true)}
            className="text-accent text-sm font-bold border-2 border-transparent hover:border-foreground rounded-full px-2 py-1 transition-all"
          >
            批量管理
          </button>
        ) : (
          <button 
            onClick={toggleSelectAll}
            className="text-secondary text-sm font-bold border-2 border-secondary rounded-full px-2 py-1 hover:bg-secondary hover:text-white transition-all shadow-[2px_2px_0_0_var(--color-secondary)]"
          >
            {selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0 ? '全不选' : '全选'}
          </button>
        )}
      </header>

      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="搜索任务..."
            className="w-full bg-input border-2 border-foreground rounded-lg py-3 pl-10 pr-4 text-sm font-bold placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-accent shadow-[4px_4px_0px_transparent] focus:shadow-[4px_4px_0px_var(--color-accent)] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isBatchMode}
          />
          <Search size={20} className="text-slate-400 absolute left-3 top-3.5" />
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-3 mb-6 pb-2 scrollbar-hide px-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              disabled={isBatchMode}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold font-heading transition-all border-2 border-foreground ${
                activeCategory === cat
                  ? 'bg-accent text-white shadow-[4px_4px_0_0_#1E293B]'
                  : 'bg-card text-foreground shadow-[2px_2px_0_0_#1E293B] hover:bg-quaternary hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_#1E293B]'
              } ${isBatchMode ? 'opacity-50 cursor-not-allowed transform-none shadow-none' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => {
              const isSelected = selectedTaskIds.includes(task.id);
              const isExpanded = expandedTaskId === task.id;
              
              return (
                <div key={task.id} className="relative">
                  <div
                    className={`card-sticker p-4 cursor-pointer transition-all hover:-rotate-1 hover:scale-[1.02] ${
                      isSelected ? 'border-accent shadow-[6px_6px_0_0_var(--color-accent)] -translate-y-1' : ''
                    }`}
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="flex items-center">
                      {isBatchMode ? (
                        <div className="mr-3">
                          {isSelected ? (
                            <div className="w-6 h-6 bg-accent border-2 border-foreground flex items-center justify-center rounded shadow-[2px_2px_0_0_#1E293B]">
                              <CheckSquare className="text-white" size={16} strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-foreground rounded bg-white shadow-[2px_2px_0_0_#1E293B]" />
                          )}
                        </div>
                      ) : (
                        task.type === 'progress' ? (
                          <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-transform">
                             <ChevronRight size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                          </div>
                        ) : (
                          task.completed ? (
                            <div className="w-6 h-6 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_0_#1E293B]">
                              <CheckCircle2 size={16} className="text-foreground" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-foreground flex-shrink-0 bg-white shadow-[2px_2px_0_0_#1E293B]" />
                          )
                        )
                      )}
                      
                      <div className={`ml-1 flex-1 ${isBatchMode ? '' : 'ml-3'}`}>
                        <div className={`font-bold text-lg transition-all ${task.completed ? 'text-muted-foreground line-through decoration-2 opacity-70' : 'text-foreground'}`}>
                          {task.title}
                        </div>
                        <div className="text-xs font-bold text-muted-foreground mt-0.5">{task.category}</div>
                      </div>

                      {task.type === 'progress' && !task.completed && (
                        <div className="mr-3 text-xs font-bold font-heading text-secondary shrink-0 flex flex-col items-end">
                          {task.subtasks ? (
                            <span>{task.current_progress || 0}/{task.target_progress || 1}</span>
                          ) : (
                            <span>{task.current_progress || 0}/{task.target_progress || 100}</span>
                          )}
                        </div>
                      )}
                      <div className="text-sm font-bold bg-tertiary px-2 py-1 rounded-md border-2 border-foreground shadow-[2px_2px_0_0_#1E293B]">+{task.points} 积分</div>
                    </div>
                    
                    {/* Render Progress Logic Inside Card */}
                    {task.type === 'progress' && !task.completed && (
                       <div className="mt-3">
                         <div className="w-full h-3 bg-muted rounded-full border-2 border-foreground overflow-hidden">
                           <div 
                             className="h-full bg-secondary transition-all" 
                             style={{ width: `${Math.min(100, ((task.current_progress || 0) / (task.target_progress || 1)) * 100)}%` }}
                           />
                         </div>
                       </div>
                    )}
                  </div>
                  
                  {/* Expanded Subtasks / Quick Add */}
                  {task.type === 'progress' && !task.completed && isExpanded && !isBatchMode && (
                    <div className="mt-2 bg-white border-2 border-foreground rounded-xl p-3 shadow-[4px_4px_0_0_#1E293B] relative -top-3 z-0 pt-5 mx-2 animate-in slide-in-from-top-2">
                       {task.subtasks ? (
                         <div className="space-y-2">
                           {task.subtasks.map((st, i) => (
                             <div 
                               key={st.id} 
                               className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 if (st.completed) return;
                                 
                                 const newSubtasks = [...task.subtasks!];
                                 newSubtasks[i].completed = !newSubtasks[i].completed;
                                 const current = newSubtasks.filter(s => s.completed).length;
                                 updateTaskProgress?.(task.id, current, newSubtasks);
                               }}
                             >
                               {st.completed ? (
                                 <CheckSquare size={18} className="text-secondary" />
                               ) : (
                                 <div className="w-[18px] h-[18px] border-2 border-foreground rounded" />
                               )}
                               <span className={`text-sm font-bold ${st.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                 {st.title}
                               </span>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="flex justify-between items-center px-2">
                           <span className="text-sm font-bold text-muted-foreground">当前进度</span>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               updateTaskProgress?.(task.id, (task.current_progress || 0) + 1);
                             }}
                             className="px-4 py-1.5 bg-quaternary border-2 border-foreground rounded-full text-foreground shadow-[2px_2px_0_0_#1E293B] font-bold active:translate-y-0.5 active:shadow-none transition-all"
                           >
                             +1 进度
                           </button>
                         </div>
                       )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <div className="inline-block w-20 h-20 bg-muted border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center mb-4 rotate-12">
                 <Search size={32} className="text-slate-400 -rotate-12" />
              </div>
              <div className="text-muted-foreground font-bold font-heading">没有找到相关任务</div>
            </div>
          )}
        </div>
      </div>

      {/* Batch Action Floating Bar */}
      {isBatchMode && (
        <div className="fixed bottom-[4.5rem] left-0 right-0 max-w-md mx-auto p-4 animate-in slide-in-from-bottom-5">
          <div className="bg-foreground text-white rounded-xl border-2 border-foreground shadow-[6px_6px_0_0_var(--color-secondary)] flex items-center justify-between p-3 px-5">
            <span className="text-sm font-bold font-heading">已选择 {selectedTaskIds.length} 项</span>
            <div className="flex gap-3">
              <button 
                onClick={handleCompleteSelected}
                disabled={selectedTaskIds.length === 0}
                className="p-2 rounded-lg bg-quaternary text-foreground border-2 border-foreground shadow-[2px_2px_0_0_#1E293B] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#1E293B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_#1E293B] disabled:opacity-50 disabled:shadow-none disabled:transform-none transition-all flex flex-col items-center gap-1"
                title="标记为完成"
              >
                <CheckSquare size={18} />
              </button>
              <button 
                onClick={handleDeleteSelected}
                disabled={selectedTaskIds.length === 0}
                className="p-2 rounded-lg bg-secondary text-white border-2 border-foreground shadow-[2px_2px_0_0_#1E293B] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#1E293B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_0_#1E293B] disabled:opacity-50 disabled:shadow-none disabled:transform-none transition-all flex flex-col items-center gap-1"
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

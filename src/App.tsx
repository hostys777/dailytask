import { useState, useEffect } from 'react';
import { Home, CheckSquare, BarChart2, User as UserIcon } from 'lucide-react';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { HomeFeed } from './components/Home';
import { Tasks } from './components/Tasks';
import { Statistics } from './components/Statistics';
import { Profile } from './components/Profile';
import { AddTask } from './components/AddTask';
import { AuthPage } from './components/AuthPage';
import { supabase } from './lib/supabase';

export interface Task {
  id: number;
  title: string;
  category: string;
  points: number;
  completed: boolean;
  created_at?: string;
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState('login'); // Start with login
  const [tasks, setTasks] = useState<Task[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session);
      if (session) {
        setActiveTab((currentTab) => 
          (currentTab === 'login' || currentTab === 'register') ? 'home' : currentTab
        );
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      if (session) {
        setActiveTab((currentTab) => {
          if (currentTab === 'login' || currentTab === 'register') return 'home';
          return currentTab;
        });
      } else {
        setActiveTab((currentTab) => {
          if (currentTab !== 'login' && currentTab !== 'register') return 'login';
          return currentTab;
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch tasks from Supabase
  const fetchTasks = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchTasks(session.user.id);
    } else {
      setTasks([]);
    }
  }, [session?.user?.id]);

  const toggleTask = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Optimistic update
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

    // Update in Supabase
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert if error
      if (session?.user?.id) fetchTasks(session.user.id);
    }
  };

  const addTask = async (newTask: { title: string; category: string; points: number; [key: string]: any }) => {
    if (!session?.user?.id) {
      console.warn('Cannot add task: User is not logged in.');
      return;
    }

    const taskPayload = { 
      title: newTask.title, 
      category: newTask.category, 
      points: newTask.points, 
      completed: false,
      user_id: session.user.id
    };
    
    console.log('Sending new task to Supabase:', taskPayload);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskPayload])

      if (error) throw error;
      if (data) {
        setTasks([...tasks, data[0]]);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTasks = async (ids: number[]) => {
    if (!session?.user?.id || ids.length === 0) return;

    // Optimistic update
    setTasks((prevTasks) => prevTasks.filter(t => !ids.includes(t.id)));

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', ids);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting tasks:', error);
      if (session?.user?.id) fetchTasks(session.user.id);
    }
  };

  const completeTasks = async (ids: number[]) => {
    if (!session?.user?.id || ids.length === 0) return;

    // Optimistic update
    setTasks((prevTasks) => prevTasks.map(t => ids.includes(t.id) ? { ...t, completed: true } : t));

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: true })
        .in('id', ids);
      if (error) throw error;
    } catch (error) {
      console.error('Error completing tasks:', error);
      if (session?.user?.id) fetchTasks(session.user.id);
    }
  };

  // Pages that don't need BottomNav
  if (activeTab === 'login' || activeTab === 'register') {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen bg-background text-foreground shadow-xl flex flex-col relative overflow-hidden">
        <AuthPage isLogin={activeTab === 'login'} onNavigate={setActiveTab} />
      </div>
    );
  }

  if (activeTab === 'add') {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen bg-background text-foreground shadow-xl flex flex-col relative overflow-hidden">
        <AddTask onBack={() => setActiveTab('home')} onAdd={addTask} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-background text-foreground min-h-screen shadow-xl overflow-hidden flex flex-col relative">
      {/* Current Page Content */}
      {activeTab === 'home' && <HomeFeed tasks={tasks} toggleTask={toggleTask} onNavigate={setActiveTab} />}
      {activeTab === 'tasks' && <Tasks tasks={tasks} toggleTask={toggleTask} deleteTasks={deleteTasks} completeTasks={completeTasks} />}
      {activeTab === 'stats' && <Statistics tasks={tasks} />}
      {activeTab === 'profile' && <Profile onNavigate={setActiveTab} tasks={tasks} />}

      {/* Bottom Nav */}
      <nav className="bg-card border-t-2 border-foreground flex justify-around items-center absolute bottom-0 w-full z-10 pb-1 text-sm shadow-[0_-4px_0_0_#E2E8F0]">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-3 px-4 transition-transform active:scale-95 ${activeTab === 'home' ? 'text-accent' : 'text-slate-400 hover:text-slate-800'}`}
        >
          <Home size={24} />
          <span className="text-[10px] mt-1 font-bold font-heading">首页</span>
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center py-3 px-4 transition-transform active:scale-95 ${activeTab === 'tasks' ? 'text-accent' : 'text-slate-400 hover:text-slate-800'}`}
        >
          <CheckSquare size={24} />
          <span className="text-[10px] mt-1 font-bold font-heading">任务</span>
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center py-3 px-4 transition-transform active:scale-95 ${activeTab === 'stats' ? 'text-accent' : 'text-slate-400 hover:text-slate-800'}`}
        >
          <BarChart2 size={24} />
          <span className="text-[10px] mt-1 font-bold font-heading">统计</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-3 px-4 transition-transform active:scale-95 ${activeTab === 'profile' ? 'text-accent' : 'text-slate-400 hover:text-slate-800'}`}
        >
          <UserIcon size={24} />
          <span className="text-[10px] mt-1 font-bold font-heading">我的</span>
        </button>
      </nav>
    </div>
  );
}

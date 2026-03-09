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

  const addTask = async (newTask: { title: string; category: string; points: number }) => {
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
          <UserIcon size={24} />
          <span className="text-[10px] mt-1 font-medium">我的</span>
        </button>
      </nav>
    </div>
  );
}

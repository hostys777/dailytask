import React, { useEffect, useState, useMemo } from 'react';
import { User, Settings, Bell, HelpCircle, ChevronRight, LogOut, Award, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Task } from '../App';

interface ProfileProps {
  onNavigate: (page: string) => void;
  tasks: Task[];
}

export function Profile({ onNavigate, tasks }: ProfileProps) {
  const [userEmail, setUserEmail] = useState<string | null>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email ?? '用户');
      }
    });
  }, []);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed);
    
    // Total Points
    const totalPoints = completedTasks.reduce((acc, curr) => acc + curr.points, 0);

    // Unique Check-in Dates
    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const completedDates = Array.from(new Set(
      completedTasks.filter(t => t.created_at).map(t => formatDate(new Date(t.created_at!)))
    )).sort((a, b) => a.localeCompare(b));

    const checkinDays = completedDates.length;

    // Calculate Badges (Based on max streak like Statistics)
    let maxStreak = completedDates.length > 0 ? 1 : 0;
    let currentStreak = completedDates.length > 0 ? 1 : 0;
    for (let i = 1; i < completedDates.length; i++) {
        const d1 = new Date(completedDates[i-1]);
        const d2 = new Date(completedDates[i]);
        const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else if (diffDays > 1) {
            currentStreak = 1;
        }
    }
    
    let badgesCount = 0;
    if (maxStreak >= 3) badgesCount++;
    if (maxStreak >= 7) badgesCount++;
    if (maxStreak >= 30) badgesCount++;

    return { totalPoints, checkinDays, badgesCount };
  }, [tasks]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('login');
  };
  return (
    <div className="flex-1 overflow-y-auto pb-20 bg-background relative pt-0">
      <header className="px-4 py-4 bg-card sticky top-0 z-10 border-b-2 border-foreground shadow-[0_4px_0_0_var(--color-foreground)] flex justify-center items-center">
        <h1 className="text-2xl font-bold font-heading">
          我的
        </h1>
      </header>

      {/* Personal Info Area */}
      <div className="p-4 mt-4">
        <div className="card-sticker bg-secondary/10 p-6 relative z-10 overflow-hidden text-foreground">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full mix-blend-overlay -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex items-center gap-4 relative z-10 pb-6 border-b-2 border-foreground/10 mb-6">
            <div className="w-20 h-20 bg-tertiary rounded-blob flex items-center justify-center border-2 border-foreground shadow-[4px_4px_0_0_#1E293B]">
              <User size={40} className="text-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold font-heading truncate">{userEmail}</h2>
              <p className="text-sm font-bold opacity-90 mt-1 font-heading">ID: 88481234</p>
            </div>
            <button className="px-4 py-2 bg-card hover:bg-quaternary border-2 border-foreground text-sm font-bold rounded-full text-foreground shadow-[2px_2px_0_0_#1E293B] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_#1E293B] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0_0_0_0_#1E293B] transition-all">
              编辑
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center relative z-10">
            <div className="bg-card text-foreground rounded-xl p-3 border-2 border-foreground shadow-[4px_4px_0_0_#1E293B] hover:-rotate-2 transition-transform cursor-default">
              <div className="text-2xl font-black font-heading">{stats.checkinDays}</div>
              <div className="text-xs font-bold text-muted-foreground mt-1 tracking-wide">打卡天数</div>
            </div>
            <div className="bg-card text-foreground rounded-xl p-3 border-2 border-foreground shadow-[4px_4px_0_0_#1E293B] hover:scale-105 transition-transform cursor-default">
              <div className="text-2xl font-black font-heading">{stats.badgesCount}</div>
              <div className="text-xs font-bold text-muted-foreground mt-1 tracking-wide">我的徽章</div>
            </div>
            <div className="bg-card text-foreground rounded-xl p-3 border-2 border-foreground shadow-[4px_4px_0_0_#1E293B] hover:rotate-2 transition-transform cursor-default">
              <div className="text-2xl font-black font-heading text-tertiary" style={{ textShadow: '1px 1px 0 #1E293B, -1px -1px 0 #1E293B, 1px -1px 0 #1E293B, -1px 1px 0 #1E293B' }}>{stats.totalPoints.toLocaleString()}</div>
              <div className="text-xs font-bold text-muted-foreground mt-1 tracking-wide">积分余额</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Area */}
      <div className="px-4 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <MenuItem icon={<CreditCard size={20} className="text-blue-500" />} title="积分商城" />
          <MenuItem icon={<Award size={20} className="text-yellow-500" />} title="我的成就" />
          <MenuItem icon={<Bell size={20} className="text-purple-500" />} title="打卡提醒" hasBorder={false} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <MenuItem icon={<HelpCircle size={20} className="text-green-500" />} title="帮助与反馈" />
          <MenuItem icon={<Settings size={20} className="text-gray-500" />} title="通用设置" hasBorder={false} />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-center gap-2 text-red-500 font-medium hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          退出登录
        </button>
      </div>

      <div className="text-center mt-6 text-xs text-gray-400">
        v1.0.0
      </div>
    </div>
  );
}

function MenuItem({ icon, title, hasBorder = true }: { icon: React.ReactNode, title: string, hasBorder?: boolean }) {
  return (
    <div className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${hasBorder ? 'border-b border-gray-50' : ''}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { User, Settings, Bell, HelpCircle, ChevronRight, LogOut, Award, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
  const [userEmail, setUserEmail] = useState<string | null>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email ?? '用户');
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('login');
  };
  return (
    <div className="flex-1 overflow-y-auto pb-20 bg-gray-50">
      <header className="px-4 py-4 bg-white sticky top-0 z-10 shadow-sm text-center">
        <h1 className="text-xl font-bold">我的</h1>
      </header>

      {/* Personal Info Area */}
      <div className="bg-white p-6 shadow-sm border-b border-gray-100 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
            <User size={32} className="text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-800">{userEmail}</h2>
            <p className="text-sm text-gray-500 mt-1">ID: 88481234</p>
          </div>
          <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-medium rounded-full text-gray-600 transition-colors">
            编辑资料
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 text-center divide-x divide-gray-100">
          <div>
            <div className="text-xl font-bold text-gray-800">42</div>
            <div className="text-xs text-gray-500 mt-1">打卡天数</div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-800">12</div>
            <div className="text-xs text-gray-500 mt-1">我的徽章</div>
          </div>
          <div>
            <div className="text-xl font-bold text-yellow-500">1,450</div>
            <div className="text-xs text-gray-500 mt-1">积分余额</div>
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

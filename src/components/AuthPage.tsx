import React, { useState } from 'react';
import { User, Lock, Mail, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onNavigate: (page: string) => void;
  isLogin?: boolean;
}

export function AuthPage({ onNavigate, isLogin = true }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/register
    onNavigate('home');
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen relative z-50">
      <header className="px-4 py-4 flex items-center mb-10">
        {!isLogin && (
          <button onClick={() => onNavigate('login')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
        )}
      </header>

      <div className="px-8 flex-1 flex flex-col">
        {/* Brand Area */}
        <div className="mb-10 mt-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? '欢迎回来' : '创建账号'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isLogin ? '登录以继续您的打卡计划' : '加入我们，开启自律之旅'}
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative">
              <label className="text-xs font-medium text-gray-700 mb-1 block">昵称</label>
              <div className="relative flex items-center">
                <User size={18} className="absolute left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="请输入您的昵称"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="relative">
            <label className="text-xs font-medium text-gray-700 mb-1 block">账号</label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="请输入邮箱 / 手机号"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-medium text-gray-700 mb-1 block">密码</label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3 text-gray-400" />
              <input
                type="password"
                placeholder="请输入密码"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isLogin && (
              <div className="text-right mt-2">
                <span className="text-xs text-primary font-medium cursor-pointer hover:underline">
                  忘记密码?
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3.5 rounded-lg shadow-md hover:bg-primary/90 transition-colors mt-8"
          >
            {isLogin ? '登 录' : '注 册'}
          </button>
        </form>

        {/* Bottom Area */}
        <div className="mt-auto pb-10 text-center">
          <span className="text-sm text-gray-500">
            {isLogin ? '还没有账号？' : '已有账号？'}
          </span>
          <button 
            type="button"
            onClick={() => onNavigate(isLogin ? 'register' : 'login')}
            className="text-sm text-primary font-bold ml-1 hover:underline cursor-pointer"
          >
            {isLogin ? '去注册' : '去登录'}
          </button>
        </div>
      </div>
    </div>
  );
}

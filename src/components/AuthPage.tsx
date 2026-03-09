import { useState } from 'react';
import { User, Lock, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onNavigate: (page: string) => void;
  isLogin?: boolean;
}

export function AuthPage({ onNavigate, isLogin = true }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (error) throw error;
        
        if (data?.user && data.user.identities && data.user.identities.length === 0) {
          setErrorMsg('该邮箱已被注册，请直接登录');
        } else if (data?.session === null) {
          setSuccessMsg('注册成功！请前往您的邮箱点击验证链接。(或在Supabase后台关闭邮箱验证)');
        } else {
          setSuccessMsg('注册成功！正在为您跳转...');
        }
      }
    } catch (error: any) {
      if (error.message.includes('User already registered')) {
        setErrorMsg('该邮箱已被注册，请直接登录');
      } else if (error.message.includes('Password should be at least')) {
        setErrorMsg('密码长度不能少于6位');
      } else if (error.message.includes('Invalid login credentials')) {
        setErrorMsg('账号或密码错误');
      } else {
        setErrorMsg(error.message || '发生错误，请检查网络或重试');
      }
    } finally {
      setLoading(false);
    }
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
        <div className="mb-10 mt-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? '欢迎回来' : '创建账号'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isLogin ? '登录以继续您的打卡计划' : '加入我们，开启自律之旅'}
          </p>
        </div>

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
                placeholder="请输入邮箱"
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
                <span className="text-xs text-primary font-medium cursor-pointer hover:underline">忘记密码?</span>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="text-red-500 text-sm mt-2 text-center p-2 bg-red-50 rounded-lg border border-red-100">
              {errorMsg}
            </div>
          )}
          
          {successMsg && (
            <div className="text-green-600 text-sm mt-2 text-center p-2 bg-green-50 rounded-lg border border-green-100">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-3 mt-6 transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              isLogin ? '登录' : '注册'
            )}
          </button>
        </form>

        <div className="mt-auto pb-8 pt-10 text-center">
          <p className="text-sm text-gray-500">
            {isLogin ? '还没有账号？' : '已有账号？'}
            <button
              onClick={() => onNavigate(isLogin ? 'register' : 'login')}
              className="text-primary font-medium ml-1 hover:underline"
              type="button"
            >
              {isLogin ? '立即注册' : '去登录'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

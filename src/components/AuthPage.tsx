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
    <div className="flex-1 flex flex-col bg-background bg-dot-grid min-h-screen relative z-50">
      <header className="px-6 py-6 flex items-center mb-6">
        {!isLogin && (
          <button onClick={() => onNavigate('login')} className="p-2 -ml-2 rounded-blob hover:bg-quaternary border-2 border-transparent hover:border-foreground transition-all">
            <ArrowLeft size={24} className="text-foreground" />
          </button>
        )}
      </header>

      <div className="px-8 flex-1 flex flex-col pb-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black font-heading text-foreground mb-3 tracking-wide uppercase">
            {isLogin ? '欢迎回来' : '创建账号'}
          </h1>
          <p className="text-muted font-bold">
            {isLogin ? '登录以继续您的打卡计划 ✨' : '加入我们，开启自律之旅 🚀'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <label className="text-sm font-bold font-heading text-foreground mb-2 block uppercase tracking-wide">昵称</label>
              <div className="relative flex items-center">
                <User size={20} className="absolute left-4 text-foreground z-10" />
                <input
                  type="text"
                  placeholder="请输入您的昵称"
                  className="w-full bg-white border-2 border-foreground rounded-blob py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0_0_#1E293B] transition-shadow shadow-[2px_2px_0_0_#1E293B]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="relative">
            <label className="text-sm font-bold font-heading text-foreground mb-2 block uppercase tracking-wide">账号</label>
            <div className="relative flex items-center">
              <Mail size={20} className="absolute left-4 text-foreground z-10" />
              <input
                type="text"
                placeholder="请输入邮箱"
                className="w-full bg-white border-2 border-foreground rounded-blob py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0_0_#1E293B] transition-shadow shadow-[2px_2px_0_0_#1E293B]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-sm font-bold font-heading text-foreground mb-2 block uppercase tracking-wide">密码</label>
            <div className="relative flex items-center">
              <Lock size={20} className="absolute left-4 text-foreground z-10" />
              <input
                type="password"
                placeholder="请输入密码"
                className="w-full bg-white border-2 border-foreground rounded-blob py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0_0_#1E293B] transition-shadow shadow-[2px_2px_0_0_#1E293B]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isLogin && (
              <div className="text-right mt-3">
                <span className="text-xs text-primary font-black font-heading cursor-pointer hover:underline uppercase tracking-wide">忘记密码?</span>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="text-destructive font-bold text-sm mt-4 text-center p-3 bg-white rounded-blob border-2 border-destructive shadow-[4px_4px_0_0_#EF4444]">
              {errorMsg}
            </div>
          )}
          
          {successMsg && (
            <div className="text-tertiary font-bold text-sm mt-4 text-center p-3 bg-white rounded-blob border-2 border-tertiary shadow-[4px_4px_0_0_var(--color-tertiary)]">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-candy w-full bg-primary text-foreground font-black text-xl tracking-widest border-2 border-foreground py-4 mt-8 transition-colors disabled:opacity-50 disabled:translate-y-0 disabled:shadow-[4px_4px_0_0_#1E293B] flex justify-center items-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-foreground border-t-white rounded-full animate-spin"></div>
            ) : (
              isLogin ? '登录' : '注册'
            )}
          </button>
        </form>

        <div className="mt-auto pb-8 pt-10 text-center">
          <p className="text-sm font-bold text-muted">
            {isLogin ? '还没有账号？' : '已有账号？'}
            <button
              onClick={() => onNavigate(isLogin ? 'register' : 'login')}
              className="text-primary font-black font-heading ml-2 hover:underline tracking-wide uppercase"
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

-- 这段 SQL 代码可以在你的 Supabase 项目的 SQL Editor 中直接运行创建表
-- 用于存储每日任务

CREATE TABLE tasks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 添加预设的 mock 数据（可选项）
INSERT INTO tasks (title, category, points, completed) VALUES
  ('早起喝一杯排毒水', '健康生活', 10, true),
  ('学习React两小时', '自我提升', 20, false),
  ('跑步3公里', '运动健身', 15, false),
  ('阅读10页书', '自我提升', 10, false),
  ('清理桌面工作区', '其他', 5, false);

-- 如果你要开启 Row Level Security (RLS) 来保护你的表。对于基础的联通先允许所有人访问:
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允许所有人读取" ON tasks FOR SELECT USING (true);
CREATE POLICY "允许所有人插入" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "允许所有人更新" ON tasks FOR UPDATE USING (true);
CREATE POLICY "允许所有人删除" ON tasks FOR DELETE USING (true);

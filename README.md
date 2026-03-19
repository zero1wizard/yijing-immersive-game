# 易境

在卦象推演中读完《易经》。

易境是一个用 Vite + React + TypeScript 构建的单页可游玩 MVP。它不把《易经》包装成“给答案”的工具，而是把六十四卦重组为可进入的情境节点，让用户通过遭遇、选择、转卦、记录与回看，练习判断与反思。

## MVP 范围

- 六大章节世界：起势、处世、应变、治理、修身、终局
- 完整 64 卦内容底库：卦名、拼音、主题、摘要、情境、六爻提示、相关卦
- 推演玩法循环：遭遇 -> 选择 -> 动爻 -> 转卦 -> 后果 -> 解锁灵感
- 卦典检索：支持按章节筛选与关键词搜索
- 本地进度：已遭遇、已解锁、已完成、札记、推演日志、每日反思
- 主题切换与静读模式
- 覆盖核心引擎与存储逻辑的 Vitest 测试

## 技术栈

- Vite 7
- React 19
- TypeScript 5
- ESLint 9
- Vitest 3 + Testing Library

## 快速开始

```bash
npm install
npm run dev
```

默认开发地址为 `http://localhost:5173`。

## 常用脚本

- `npm run dev`：启动开发环境
- `npm run lint`：运行 ESLint
- `npm run test`：运行 Vitest
- `npm run build`：执行 TypeScript build 并产出生产包
- `npm run check`：顺序执行 `lint`、`test`、`build`
- `npm run preview`：本地预览构建结果

## 核心体验

1. 从当前卦境、随机遭遇或今日一卦进入内容。
2. 阅读情境、摘要、六爻提示和学习提示。
3. 在三种动作姿态中选择一种：观势、推进、退整。
4. 查看动爻、转卦和后果，累积灵感条目与推演日志。
5. 在卦典中检索其他卦，并写下个人札记。

## 设计原则

- 把《易经》作为反思与判断训练的文本，而不是结果承诺机器。
- 用原创精简文本提供入口，不替代原典阅读。
- 让学习、游玩、记录共用同一套内容模型，减少割裂感。
- 强调“可回看”的日常练习，而不是一次性占验。

## 项目结构

```text
src/
  data/        64 卦种子与衍生内容
  lib/         引擎与本地存储
  test/        测试初始化
docs/          产品、内容和路线文档
```

## 文档

- [GAME_DESIGN.md](/Users/helios/.openclaw/workspace/yijing-immersive-game/docs/GAME_DESIGN.md)
- [CONTENT_MODEL.md](/Users/helios/.openclaw/workspace/yijing-immersive-game/docs/CONTENT_MODEL.md)
- [ROADMAP.md](/Users/helios/.openclaw/workspace/yijing-immersive-game/docs/ROADMAP.md)

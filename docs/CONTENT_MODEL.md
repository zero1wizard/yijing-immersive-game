# CONTENT MODEL

## 设计目标

内容模型需要同时服务三件事：

- 玩法：让每个卦都能被进入、选择和转化
- 学习：让每个卦都带有足够的阅读提示与关联
- 记录：让用户能把个人判断沉淀到长期进度里

## 核心实体

### `Hexagram`

- `id`: 1-64 的稳定编号
- `key`: 程序内部标识，用于生成 choice id 等字段
- `name`: 卦名
- `pinyin`: 拼音
- `title`: 产品内场景标题，帮助用户用现代语境进入
- `symbol`: Unicode 卦符
- `chapter`: 所属章节世界
- `themes`: 三个主题词，构成该卦的动作张力
- `summary`: 原创精简摘要
- `scenario`: 可游玩情境设置
- `studyNotes`: 3 条学习提示
- `related`: 3 个相关卦 id
- `lineImages`: 6 条动爻提示
- `choices`: 3 个行动选项

### `ChoiceTemplate`

- `id`: 选项标识
- `label`: 用户可见文本
- `stance`: `observe | advance | withdraw`
- `changingLine`: 1-6
- `transformedHexagramId`: 结果卦
- `consequence`: 后果摘要
- `unlocks`: 附加解锁卦 id 列表

### `EncounterResult`

- `fromHexagramId`: 起始卦
- `choiceId`: 选择 id
- `changingLine`: 本次触发的动爻
- `transformedHexagramId`: 转卦结果
- `consequence`: 后果摘要
- `unlockedHexagramIds`: 本次新增或涉及的卦
- `unlockedInsight`: 解锁出的灵感文本
- `timestamp`: 记录产生时间

### `DailyReflection`

- `date`: 本地日期字符串，格式为 `YYYY-MM-DD`
- `hexagramId`: 当日映射到的卦
- `prompt`: 当日反思问题
- `reflectionSeed`: 用于稳定回放的辅助标识

### `ProgressState`

- `encounteredHexagramIds`: 遭遇过的卦
- `unlockedHexagramIds`: 解锁过的卦
- `completedHexagramIds`: 做过完整选择的卦
- `insights`: 解锁出的灵感条目
- `notes`: 每卦个人札记
- `journal`: 最近推演记录
- `dailyReflections`: 保存过的日课条目
- `theme`: 浅色或深色
- `readingMode`: 是否静读模式

## 内容生成规则

- 每个卦固定拥有 3 个主题词，作为摘要、场景、学习提示和选项的生成基础。
- 每个卦固定拥有 3 个动作姿态：观势、推进、退整。
- 每个动作姿态会映射到 1 条动爻、1 个结果卦和若干额外解锁卦。
- 六爻提示统一由 6 条动作语气模板和主题词组合而成。
- 相关卦使用稳定偏移规则生成，保证全库内容结构完整、可遍历。

## 进度规则

- 用户打开某卦时，会把该卦加入 `encounteredHexagramIds` 和 `unlockedHexagramIds`。
- 用户做出选择时，会把当前卦加入 `completedHexagramIds`，并把转卦与附加卦加入解锁集合。
- `journal` 只保留最近 32 条推演记录，避免本地状态无限增长。
- `notes` 使用卦 id 作为 key，允许用户持续补写个人札记。
- `dailyReflections` 以日期去重，同一天不会重复保存。

## 存储与约束

- 所有持久化都基于 `localStorage`。
- 进度状态必须可以从缺省字段安全恢复到 `INITIAL_PROGRESS`。
- 日期映射使用稳定算法，确保同一自然日得到同一条反思入口。
- 内容文本为原创精简表达，不直接替代原典与注本。

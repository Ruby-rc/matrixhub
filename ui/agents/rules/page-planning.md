# 页面规划规则

新页面先做 page plan，再写代码。

目标不是产出大文档，而是先把信息来源、页面边界、状态和 API 对齐，避免实现过程中反复返工。

## 开始顺序

1. 先看 `ui/.planning/<task-slug>/task.md`，确认任务目标、参考资料和待确认问题
2. 看需求与路由入口
3. 看 `modao` 原型稿，确认页面流程和信息结构
4. 看 `figma`，确认视觉层级、布局和组件形态
5. 看相邻页面、现有组件和 Mantine 现有模式
6. 如果页面依赖数据，同时补 API plan
7. page plan 确认后再开始写 route 和 feature 代码

## 输入冲突时怎么判断

- `modao` 主要回答“页面要做什么、流程怎么走”
- `figma` 主要回答“页面长什么样、层级怎么排”
- `figma` 不完整时，优先参考现有已实现页面和 Mantine 规范补齐
- 不要因为局部设计缺失就临时发明一套新的页面模式

## page plan 至少要回答的内容

1. 页面对应哪个 route、哪个 feature
2. route 文件只做适配，还是需要独立 feature page
3. 页面拆成哪些主要区块或组件
4. 页面有哪些用户可见文案，需要哪些 locale key
5. 页面有哪些状态：loading / empty / error / success
6. 哪些内容来自 `figma`，哪些缺口由现有代码和 Mantine 补齐
7. 页面依赖哪些 API 数据、读操作和写操作

## 组件拆分原则

- route 文件只保留路由接入、参数、重定向、元信息
- 完整页面进入 `src/features/{feature}/pages`
- 明显独立且会复用的区块，再拆到 `components/`
- 规划阶段不要过度拆成很细的组件树

## 协作原则

- 先从现有代码学模式，再补必要规则
- 新页面优先先做 page plan，再做实现
- 拿不准时选更小、更容易回滚的改动
- 规则变化要落到文档里，不要只留在聊天记录里

## 推荐产物

优先维护一份简短、真实可执行的 page plan，可以作为 `task.md` 的一个小节。

可以放在：

- PR 描述
- 需求文档中的页面规划小节
- `ui/.planning/<task-slug>/task.md` 的页面规划小节
- `ui/agents/examples/page-plan-example.md` 的同类格式

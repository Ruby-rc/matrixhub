# Page Plan 示例：项目下模型列表页

这个示例展示如何把 `modao`、`figma`、现有代码和 API 规划合并成一份真实可执行的 page plan。

## 1. 输入信息

- 路由 / 需求：
  - 路由：`src/routes/(auth)/(app)/projects/$projectId/models/index.tsx`
  - 目标：在项目下展示模型列表，并提供“新建模型”入口
- Modao：
  - 确认页面流程：进入项目详情 → 查看模型列表 → 点击新建 → 跳转新建页
  - 确认信息结构：页面标题、过滤区、列表区、空态、新建按钮
- Figma：
  - 确认视觉层级：页头、操作区、表格/列表主体、空态区
  - 确认布局节奏：页头与列表之间留白，按钮在右上角，列表项使用表格或卡片样式
- 相关已有页面：
  - `src/routes/(auth)/(app)/projects/index.tsx`
  - `src/routes/(auth)/(app)/models/index.tsx`
  - `src/routes/(auth)/route.tsx`

## 2. 关键决策

- 路由文件：
  - 保留在 `src/routes/(auth)/(app)/projects/$projectId/models/index.tsx`
  - 只负责读取 `projectId`、挂载页面、保留路由级元信息
- Feature 页面：
  - 新增 `src/features/projects/pages/ProjectModelsPage.tsx`
- 是否需要新组件：
  - 第一版先不预拆过多组件
  - 可先保留 `ProjectModelsPage` 内的页头区、工具栏区、列表区
  - 如果列表项明显复用，再拆 `components/ModelList.tsx`
- 需要新增的 locale 文件：
  - `src/locales/en/projects/models.json`
  - `src/locales/zh/projects/models.json`

## 3. 布局规划

- 主要区块：
  - 页面标题区
  - 右侧操作区：新建按钮
  - 列表区
  - 空态区
- 哪些内容来自 Figma：
  - 页面视觉层级
  - 标题与按钮的相对位置
  - 列表区的留白和密度
- 哪些内容沿用现有代码或 Mantine 默认模式：
  - 页头使用 `Group` 或 `Flex`
  - 页面整体使用 `Stack`
  - 列表容器优先用 Mantine 现成布局和表格能力
  - Figma 缺失的细节先参考现有列表页和 Mantine 默认交互

## 4. 页面状态

- Loading：
  - 显示列表加载状态，占位或简单 loading 文案
- Empty：
  - 显示空态文案和新建按钮
- Error：
  - 显示错误提示和重试入口
- Success：
  - 展示模型列表

## 5. API 规划

<!-- TODO -->

## 6. Locale 规划

- Namespace：
  - `projects.models`
- 预期 key：
  - `projects.models.title`
  - `projects.models.actions.create`
  - `projects.models.empty.title`
  - `projects.models.empty.description`
  - `projects.models.error.retry`

## 7. 待确认问题

- 列表是表格更合适，还是卡片更合适，需要结合 Figma 最终确认
- 空态是否需要插图，如果 Figma 没给，就先沿用现有页面风格

## 8. 实现顺序

1. 建 route adapter
2. 建 `ProjectModelsPage`
3. 补 locale
4. 确认 API contract
5. 再决定是否需要拆独立列表组件

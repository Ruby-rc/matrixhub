# 目录结构与职责边界

本文件定义 `ui/` 的目标结构与增量迁移方向。

## 当前稳定边界

- `src/routes`：路由适配层
- `src/features`：feature 目录与非平凡页面实现
- `src/i18n`：国际化启动、语言检测、资源加载
- `src/locales`：语言资源
- `src/main.tsx`、`src/router.tsx`、`src/mantineTheme.ts`：应用级基础设施

## 推荐职责

### `src/routes`

负责：

- `createFileRoute(...)`
- 路由层布局
- `redirect`、`beforeLoad`
- 路由参数、搜索参数、元信息
- 极简单的静态页面

不负责：

- 新增复杂页面 UI
- 业务逻辑编排
- 大段状态管理

### `src/features`

负责：

- feature 级页面
- feature 内部组件
- feature 内部 hooks、types、utils
- 路由之外的页面 UI 与业务组织

推荐结构按需生长，不强制一次性补齐：

```text
src/features/{feature}/
├── pages/
├── components/
├── hooks/
├── types/
└── utils/
```

### `src/i18n`

负责 i18n 运行时装配，不承载业务文案定义。

### `src/locales`

负责多语言资源，按语言目录组织。

## 渐进迁移规则

- 现有路由文件里的简单占位 UI 可以暂时保留。
- 新增非平凡页面时，应优先放入 `src/features`，再由 `src/routes` 挂载。
- 如果正在修改的路由文件已经承担了大量 UI，优先顺手抽出对应 feature page。
- 不要为了“显得完整”而预先引入新的顶层架构层。

## 推荐映射

以 `projects` 列表页为例：

```text
src/routes/(auth)/(app)/projects/index.tsx
src/features/projects/pages/ProjectsPage.tsx
src/locales/en/projects.json
src/locales/zh/projects.json
```

路由文件负责挂载页面，页面实现落在 feature 内。

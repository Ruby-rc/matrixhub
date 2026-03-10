# 实现约束

这份文档合并了当前 UI 的技术栈、Mantine、TanStack Router 和 i18n 约束。

## 技术栈

- `pnpm`
- `Vite`
- `React 19`
- `TypeScript`
- `Mantine v8`
- `TanStack Router`
- `react-i18next`
- `ESLint v9`

## 项目基础约束

- `@tanstack/router-plugin` 必须先于 `@vitejs/plugin-react` 注册
- `babel-plugin-react-compiler` 已启用，不要随意移除
- `VITE_UI_BASE_PATH` 控制 UI 的部署子路径
- `src/routeTree.gen.ts` 是生成文件，只能由工具生成

## Mantine

- 布局优先使用 `AppShell`、`Stack`、`Group`、`Flex`、`Box`
- 文本优先使用 `Text`、`Title`
- 间距优先使用 Mantine props 和 theme token
- 不要在 Mantine 已能表达的场景下堆大量裸 `div` 或内联样式
- 不要硬编码颜色、字号、间距常量作为默认方案

## Router

- 所有路由文件都放在 `src/routes`
- 每个路由文件显式导出 `Route`
- 路由文件负责路由定义、布局、重定向、元信息
- 非平凡页面应放进 `src/features`，由 route 挂载
- 不要把复杂业务逻辑长期堆在 route 文件里

## Feature 页面实现拆分原则

以下规则针对 `src/features/{feature}/pages` 下的页面实现。

- 页面实现按职责边界和复杂度拆分，不按文件长度拆分
- 当单个页面文件同时承担多个相对独立的复杂关注点时，应主动拆分，例如复杂的列表展示与表单或弹窗交互、页面编排与复杂状态或副作用处理、数据加载或提交与大段界面渲染
- 可独立理解的复杂区块，优先拆到当前 feature 的 `components/`
- 复杂状态与副作用，优先拆到当前 feature 的 `hooks/`
- 只有在多个 feature 间明确复用或已形成稳定通用模式时，才拆到 `shared`
- 不要为了拆分而拆分，目标是降低理解和修改成本

## i18n

- 新增用户可见文案时，优先写入 locale
- 新增页面时，同时补 `en` 和 `zh`
- `src/locales/{lang}/**/*.json` 的路径会折叠成翻译 key 前缀
- 组件内优先使用 `useTranslation()`
- 不要继续扩散新的硬编码展示文案

## 默认命令

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

# MatrixHub UI 协作入口

本文件是 `ui/` 目录下的人类开发者与 AI 协作者统一入口。

项目默认规则、协作规范、模板示例统一沉淀在 `ui/agents/`，不要把基础项目规则设计成某个 AI 专属 skill 或工具配置。

## 必读顺序

1. 先读本文件。
2. 再按改动范围阅读：
   - 目录与边界：`ui/agents/rules/structure.md`
   - 实现约束：`ui/agents/rules/implementation.md`
   - 页面规划：`ui/agents/rules/page-planning.md`
   - API 规划：`ui/agents/rules/api-layer.md`
   - 评审清单：`ui/agents/collaboration/review-checklist.md`
   - 页面规划示例：`ui/agents/examples/page-plan-example.md`

## 规则来源

- `ui/agents/rules/*`：项目基础规则
- `ui/agents/collaboration/*`：协作清单与评审约定
- `ui/agents/examples/*`：真实场景示例
- 未来如果需要工作流 skill，统一放在 `ui/agents/skills/*`

本轮实现相关的临时工作资料统一放在 `ui/.planning/<task-slug>/`。

推荐按任务组织，目录内只放当前任务真正需要的输入和草稿，例如：

- `task.md`：本轮任务总说明，集中记录参考资料、页面规划、临时备注和待确认问题
- 其他本地附件：截图、裁剪图、导出文档等
 
`ui/.planning/` 是本地工作目录，已加入 `git ignore`。它用于承接任务输入、对照记录和实现草稿，不要把它当成长期规则仓库。

`.claude/`、`.codex/`、`.opencode/` 等目录如果将来出现，只能是适配层，不能反向成为项目规则源头。

## 当前代码边界

- `src/routes`：路由文件、布局、重定向、路由级元信息
- `src/features`：非平凡页面与 feature 内部实现
- `src/i18n`：国际化启动与资源装载
- `src/locales`：多语言资源文件
- `src/main.tsx`、`src/router.tsx`、`src/mantineTheme.ts`：应用级基础设施
- `src/routeTree.gen.ts`：生成文件，不要手动更改

## 增量采用原则

- 本规范优先约束新代码与修改中的代码。
- 现有历史文件允许渐进迁移，不要求为规则落地而一次性大搬家。
- 当路由文件变复杂时，优先把 UI 与逻辑挪到 `src/features`，路由文件只保留适配职责。

## 禁止事项

- 手改 `src/routeTree.gen.ts`
- 在 `src/routes` 中堆积新的复杂业务逻辑
- 为新 UI 文案继续添加硬编码字符串
- 在 Mantine 已能表达的场景下绕过主题 token 自造样式体系
- 未经约定新增新的架构层级

## 常用命令

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

提交前至少保证本次改动相关内容可通过 `pnpm lint` 与 `pnpm typecheck`。

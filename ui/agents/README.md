# MatrixHub UI 开发规范

本目录存放 MatrixHub UI 项目的开发规范和 AI 协作规则。

## 为什么不用 `.claude`？

- `.claude` 是 Claude CLI 的配置文件，与项目规则混在一起会让其他开发者困惑
- 这些规则是**项目的一部分**，不是 AI 工具的配置
- 放在 `ui/agents/` 可以和项目代码一起版本控制

## 核心规范

| 文件 | 说明 |
|------|------|
| [tdd.md](./tdd.md) | TDD 开发规范（单元测试 + 视觉回归测试） |
| [component-driven.md](./component-driven.md) | 组件驱动开发与 SSOT 原则 |
| [mantine.md](./mantine.md) | Mantine v8 编码规范 |
| [api-layer.md](./api-layer.md) | API 层抽象规范 |

## 后续可添加

- `tanstack-router.md` — 路由规范
- `tanstack-form.md` — 表单状态管理规范
- `react-i18next.md` — 国际化规范
- `ui/skills/` — 自动化工作流脚本

## 与 AI 协作

当 AI 帮助开发时：
1. 告诉它阅读 `ui/agents/` 下的规范
2. 确保它遵循 TDD 流程
3. 使用 Mantine 组件而非原生 HTML

---

**Tip**: 这些规则优先上线，自动化脚本可以后续迭代。

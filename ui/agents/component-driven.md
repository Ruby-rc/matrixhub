# 组件驱动开发与 SSOT 原则

## 组件分层

UI 必须严格按层级自底向上构建：

| 层级 | 位置 | 描述 | 依赖 |
|------|------|------|------|
| **Atom** | `src/shared/ui/` 或 Mantine 内置 | 最小可复用单元（Button、Input、Badge） | 无项目特定依赖 |
| **Molecule** | `src/features/{feature}/components/` | 原子组合（SearchBar、UserCard） | 仅 Atoms |
| **Page** | `src/features/{feature}/pages/` | 页面完整组装 | Atoms + Molecules + Hooks |

## SSOT：创建组件前必读

1. 先检查 `docs/components-registry.md` 是否已有功能匹配的组件
2. 存在匹配 → **复用**。接近但不完美 → **扩展新 props**。没有合适的 → 创建新组件
3. 创建新组件后，必须更新 `docs/components-registry.md`

## 组件契约规则

每个新组件**必须**满足：

- 导出一个 TypeScript 接口作为 props（命名 `{ComponentName}Props`）
- 无硬编码业务数据 — 所有内容通过 props 或 i18n 传入
- 无内部 API 调用 — 数据通过 props 流入，事件通过回调流出
- **必须**有视觉测试文件（`.visual.spec.ts`）

## 视觉测试 Mock 数据规范

视觉回归测试中的 mock 数据必须**完全复现**设计稿：

- **相同文本内容**：设计稿显示 "My Project"，mock 必须用 "My Project"
- **相同数量**：设计稿显示 5 行表格，mock 必须有 5 条数据
- **相同状态**：设计稿显示禁用按钮，mock 必须渲染禁用状态
- **相同边缘情况**：设计稿显示文本截断，mock 必须用足够长的文本触发截断

```typescript
// __fixtures__/ProjectCard.fixture.ts
import type { ProjectCardProps } from '../ProjectCard'

/** Mock 数据必须与 Figma 设计稿完全一致 */
export const projectCardFixture: ProjectCardProps = {
  title: 'Frontend Application',        // ← 与 Figma 一致
  description: 'React-based console UI for MatrixHub platform management',
  updatedAt: '2025-01-15T10:30:00Z',
  status: 'active',
}
```

## 边界强制

- 如果页面需要修复 atom/molecule 行为 → 回去修复组件 + 测试。**禁止**用父级 CSS hack 覆盖子样式
- 如果 molecule 内部超过 3 个 atom → 考虑拆分
- 如果相同 molecule 模式出现在 2+ 个 feature → 提取到 `src/shared/ui/`

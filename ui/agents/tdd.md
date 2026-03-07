# TDD 开发规范

本文档定义项目核心的测试驱动开发规范。

## 测试类型

| 类型 | 作用 | 运行方式 |
|------|------|----------|
| **单元测试** | 验证组件逻辑（props、事件、渲染） | `pnpm test:unit` |
| **视觉回归测试** | 像素级对比设计稿 | `pnpm exec playwright test` |
| **文件清单检查** | 检查配套文件是否存在 | 自动运行 |

---

## 1. 单元测试：Red → Green → Refactor

每个实现变更遵循以下流程：

1. **Red** — 先写测试描述预期行为，运行测试确认失败
2. **Green** — 写最小实现让测试通过
3. **Refactor** — 保持测试通过的情况下重构代码

### 单元测试规范

- 测试文件放在组件旁边：`{Name}.test.tsx`
- 使用 `@testing-library/react` 测试组件
- 使用 `vitest` 做断言和 mock
- Mock 所有外部依赖（API、router、i18n）

### 不需要单元测试的内容

- Mantine 组件内部实现（信任库本身）
- Router 导航（E2E 测试覆盖）
- 像素级外观（那是视觉测试的工作）

---

## 2. 视觉回归测试：Playwright 像素对比

这是与单元测试**分开**的测试执行方式。

### 流程

1. 确保 baseline 存在：`__baselines__/{Name}.baseline.png`
2. 确保 fixture 存在：`__fixtures__/{Name}.fixture.ts`（数据与设计完全一致）
3. 编写 `{Name}.visual.spec.ts`
4. 运行：`pnpm exec playwright test {Name}.visual.spec.ts`
5. 结果：≥ 99% 相似度 → 通过

### 文件结构

```
src/features/projects/components/
├── ProjectCard.tsx              # 组件
├── ProjectCard.test.tsx        # 单元测试
├── ProjectCard.visual.spec.ts   # 视觉测试
├── __fixtures__/
│   └── ProjectCard.fixture.ts  # Mock 数据
├── __baselines__/
│   └── ProjectCard.baseline.png # 设计参考图
```

---

## 运行测试

```bash
# 单元测试 - 单文件
pnpm test:unit src/features/projects/components/ProjectCard.test.tsx

# 单元测试 - 监听模式
pnpm test:unit --watch

# 单元测试 - 完整套件
pnpm test:unit

# 视觉测试 - 单组件
pnpm exec playwright test ProjectCard.visual.spec.ts
```

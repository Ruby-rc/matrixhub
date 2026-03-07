# API 层抽象规范

## 背景

后端接口**尚未定稿**。Proto 定义和生成的 TS SDK 稍后会来。在此之前，前端使用**手写类型 + mock 实现**。架构必须确保当 proto SDK 到来时，**零 feature 代码改动** — 仅 `src/shared/api/` 内部需要替换。

## 架构

```
src/shared/api/
├── types/                 # 请求/响应类型（手写，后续替换为 proto-gen）
│   ├── project.ts
│   └── repository.ts
├── client/                # 抽象客户端接口
│   └── index.ts
├── mock/                  # Mock 实现（仅开发用）
│   └── index.ts
└── index.ts               # Barrel — 唯一被 feature 导入的入口
```

## 三条规则

### 规则 1：Feature 只从 `@/shared/api` 导入

```tsx
// ✅ 正确
import { apiClient } from '@/shared/api'
import type { Project } from '@/shared/api'

const projects = await apiClient.listProjects()
```

```tsx
// ❌ 禁止 — 直接导入 mock
import { mockClient } from '@/shared/api/mock'

// ❌ 禁止 — 从内部路径导入类型
import type { Project } from '@/shared/api/types/project'

// ❌ 禁止 — feature 代码中 raw fetch
const res = await fetch('/api/projects')
```

### 规则 2：client 是接口，不是实现

```typescript
// src/shared/api/client/index.ts

export interface ApiClient {
  listProjects(): Promise<Project[]>
  getProject(id: string): Promise<Project>
  createProject(data: CreateProjectRequest): Promise<Project>
  deleteProject(id: string): Promise<void>
}
```

每个 API 方法都定义为接口。Mock 和未来的 proto-gen SDK 都实现同一接口。

### 规则 3：barrel 决定哪个实现生效

```typescript
// src/shared/api/index.ts

// 导出类型（features 需要）
export type { Project, Repository, CreateProjectRequest } from './types/project'
export type { ApiClient } from './client'

// 导出当前活跃的 client 实现
// 当前：mock
export { mockClient as apiClient } from './mock'

// 未来（proto SDK 到来时）：
// export { protoClient as apiClient } from './generated'
```

当 proto SDK 到来时，只需改这一行导入。整个代码库无需改动。

## 类型编写规范

类型应该镜像最终 proto 将产生的内容。保持简单、以数据为导向：

```typescript
// src/shared/api/types/project.ts

export interface Project {
  id: string
  name: string
  description: string
  createdAt: string   // ISO 8601
  updatedAt: string
}

export interface CreateProjectRequest {
  name: string
  description: string
}

export interface ListProjectsResponse {
  items: Project[]
  total: number
  nextPageToken?: string
}
```

约定：
- ID 使用 `string`（proto 通常生成 string ID）
- 时间戳使用 ISO 8601 `string`（不是 `Date`）
- 使用 `{Resource}Request` / `{Resource}Response` 命名请求/响应包装器
- 分页使用 `nextPageToken` 模式

## Feature 中使用 API

```tsx
// src/features/projects/hooks/useProjects.ts
import { apiClient } from '@/shared/api'

export function useProjects() {
  // 与 TanStack Query、SWR 或 simple useState + useEffect 配合使用
}
```

注意：`ProjectCard` 接收纯 props — 它不知道 `apiClient` 或 `Project` 类型。数据获取在 hooks，展示在组件。

## 测试

### 单元测试（组件）

组件通过 props 接收数据。无需 API 层：

```tsx
// ProjectCard.test.tsx — 无需 API mock
render(<ProjectCard title="Frontend" description="UI repo" />)
```

### 单元测试（hooks）

在模块级别 mock API client：

```tsx
// useProjects.test.ts
vi.mock('@/shared/api', () => ({
  apiClient: {
    listProjects: vi.fn().mockResolvedValue([{ id: '1', name: 'Test' }]),
  },
}))
```

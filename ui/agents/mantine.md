# Mantine v8 编码规范

Mantine v8 是唯一的组件库。所有布局、间距和样式**必须**使用 Mantine 组件和主题 token。

## 布局

使用 Mantine 基础组件代替原生 `<div>`：

- 使用：`Stack`、`Group`、`Flex`、`Box`、`Container`

```tsx
// ✅ 正确
import { Stack, Group, Title, Button } from '@mantine/core'

export function LabelPage() {
  return (
    <Stack gap="md" mx="sm">
      <Group gap="sm">
        <Title order={3}>Labels</Title>
        <Button>Create</Button>
      </Group>
    </Stack>
  )
}
```

```tsx
// ❌ 错误 — 原生 div + 内联样式
<div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
  <h3>Labels</h3>
  <button>Create</button>
</div>
```

## 间距与样式

- 使用 Mantine spacing props：`gap`、`p`、`m`、`pt`、`pb`、`mx` 等
- 使用 Mantine 主题 token 颜色：`c="blue"`、`bg="gray.1"`
- **禁止**硬编码颜色、圆角、字号
- Mantine 有对应 prop 时，**禁止**使用 `style={{}}`

```tsx
// ✅ 正确
<Button variant="light" c="blue">Save</Button>

// ❌ 错误
<Button style={{ background: '#1677ff' }}>Save</Button>
```

## 复用

- 共享 UI 基础组件放在 `src/shared/ui/`
- 重复的布局或 shell 模式**必须**提取为共享组件
- **禁止**在 feature 之间复制间距/布局逻辑

## 不确定 API 时

对首次使用的组件不确定可用 props 或想不出 prop 名称时 → 查看 `mantine-api` skill（包含完整 Mantine v8 API 参考）

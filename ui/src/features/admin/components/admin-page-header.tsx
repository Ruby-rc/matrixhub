import {
  Group,
  Text,
  Title,
  rem,
} from '@mantine/core'

import AnchorLink from '@/shared/components/AnchorLink'

import type { TablerIcon } from '@tabler/icons-react'
import type { LinkComponentProps } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export interface AdminPageHeaderItem {
  label: ReactNode
  linkProps?: LinkComponentProps
}

interface AdminPageHeaderProps {
  actions?: ReactNode
  icon: TablerIcon
  items: [AdminPageHeaderItem, ...AdminPageHeaderItem[]]
}

function HeaderItem({
  item,
  primary = false,
}: {
  item: AdminPageHeaderItem
  primary?: boolean
}) {
  if (item.linkProps) {
    return (
      <AnchorLink
        c="inherit"
        underline="hover"
        fw={600}
        lh={primary ? rem(28) : rem(24)}
        fz={primary ? rem(18) : rem(18)}
        {...item.linkProps}
      >
        {item.label}
      </AnchorLink>
    )
  }

  if (primary) {
    return (
      <Title
        size={rem(18)}
        fw={600}
        lh={rem(28)}
      >
        {item.label}
      </Title>
    )
  }

  return (
    <Text
      fw={600}
      lh={rem(24)}
      fz={rem(18)}
    >
      {item.label}
    </Text>
  )
}

export function AdminPageHeader({
  actions,
  icon: Icon,
  items,
}: AdminPageHeaderProps) {
  const [primaryItem, ...secondaryItems] = items

  return (
    <Group
      px={28}
      py="lg"
      justify="space-between"
      wrap="nowrap"
      mih={72}
      align="center"
    >
      <Group
        gap={10}
        wrap="nowrap"
        align="center"
      >
        <Icon
          size={rem(28)}
          style={{ flexShrink: 0 }}
        />
        <HeaderItem item={primaryItem} primary />
        {secondaryItems.map(item => (
          <Group key={item.label?.toString()} gap={10} wrap="nowrap" align="center">
            <Text c="gray.6" fw={500}>/</Text>
            <HeaderItem item={item} />
          </Group>
        ))}
      </Group>

      {actions && (
        <Group
          gap="sm"
          wrap="nowrap"
          align="center"
        >
          {actions}
        </Group>
      )}
    </Group>
  )
}

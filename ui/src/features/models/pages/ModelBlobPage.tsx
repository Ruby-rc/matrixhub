import {
  Alert,
  Box,
  Center,
  Loader,
  Stack,
} from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { getRouteApi } from '@tanstack/react-router'

import { FileViewer, useFileContent } from '@/features/file-viewer'
import { useModelBlob } from '@/features/models/models.query.ts'

import { ModelBlobDemo } from './ModelBlobDemo'

const { useParams } = getRouteApi('/(auth)/(app)/projects_/$projectId/models/$modelId/blob/$ref/$')

export function ModelBlobPage() {
  const {
    projectId, modelId, ref: revision, _splat: path,
  } = useParams()

  const {
    data: file, isLoading: isFileLoading, error: fileError,
  } = useModelBlob(projectId, modelId, {
    revision,
    path,
  })
  // hook calls needs to be unconditional, but it returns empty state when file is undefined
  const {
    content, isLoading: isContentLoading, error: contentError,
  } = useFileContent(file)

  if (fileError) {
    // If backend API is not ready, we fall back to the demo component
    return (
      <Stack>
        <Alert variant="light" color="blue" title="API Not Ready" icon={<IconInfoCircle />}>
          The ModelBlob query failed (likely because the backend API is not ready). Showing Demo data instead.
        </Alert>
        <ModelBlobDemo />
      </Stack>
    )
  }

  if (isFileLoading) {
    return (
      <Center p="xl"><Loader /></Center>
    )
  }

  if (!file) {
    return (
      <Alert variant="light" color="yellow">No file found.</Alert>
    )
  }

  return (
    <Box p="md">
      <Stack gap="md">
        <FileViewer
          file={file}
          content={content}
          loading={isContentLoading}
          error={contentError}
        />
      </Stack>
    </Box>
  )
}

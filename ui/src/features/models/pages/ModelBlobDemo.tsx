import {
  Box,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useState } from 'react'

import { FileViewer, useFileContent } from '@/features/file-viewer'

import type { File } from '@matrixhub/api-ts/v1alpha1/model.pb'

const MOCK_COMMIT = {
  id: '98852bf3a1c2d4e5f678',
  authorName: 'systemd',
  message: 'Updated deployment command to include encoder TP mode (batch 1/1)',
  committerDate: '2025-03-15',
}

type DemoKey = 'markdown' | 'python' | 'json' | 'binary'

interface DemoItem {
  file: File
  mockContent?: string
}

const DEMO_FILES: Record<DemoKey, DemoItem> = {
  markdown: {
    file: {
      name: 'deploy_guidance.md',
      path: 'docs/deploy_guidance.md',
      size: '4096',
      url: '/api/v1alpha1/models/moonshotai/Kimi-K2.5/raw/main/docs/deploy_guidance.md',
      commit: MOCK_COMMIT,
    },
    mockContent: `# Kimi-K2.5 Deployment Guide

> [!Note]
> This guide only provides some examples of deployment commands for Kimi-K2.5.

## vLLM Deployment

This model is available in nightly vLLM wheel:

\`\`\`bash
uv pip install -U vllm \\
    --torch-backend=auto \\
    --extra-index-url https://wheels.vllm.ai/nightly
\`\`\`

**Key notes**
- \`--tool-call-parser kimi_k2\`: Required for enabling tool calling
- \`--reasoning-parser kimi_k2\`: Kimi-K2.5 enables thinking mode by default

## SGLang Deployment

\`\`\`bash
pip install "sglang @ git+https://github.com/sgl-project/sglang.git#subdirectory=python"
pip install nvidia-cudnn-cu12==9.16.0.29
\`\`\`
`,
  },
  python: {
    file: {
      name: 'inference.py',
      path: 'inference.py',
      size: '892',
      url: '/api/v1alpha1/models/moonshotai/Kimi-K2.5/raw/main/inference.py',
      commit: MOCK_COMMIT,
    },
    mockContent: `import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "moonshot/Kimi-K2.5"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map="auto",
)

prompt = "Explain the theory of relativity in simple terms."
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

with torch.no_grad():
    outputs = model.generate(**inputs, max_new_tokens=512)

print(tokenizer.decode(outputs[0], skip_special_tokens=True))
`,
  },
  json: {
    file: {
      name: 'config.json',
      path: 'config.json',
      size: '321',
      url: '/api/v1alpha1/models/moonshotai/Kimi-K2.5/raw/main/config.json',
      commit: MOCK_COMMIT,
    },
    mockContent: `{
  "model_type": "causal_lm",
  "architectures": ["KimiForCausalLM"],
  "hidden_size": 4096,
  "num_attention_heads": 32,
  "num_hidden_layers": 48,
  "vocab_size": 128256,
  "max_position_embeddings": 131072,
  "torch_dtype": "bfloat16"
}
`,
  },
  binary: {
    file: {
      name: 'model-00001-of-00003.safetensors',
      path: 'model-00001-of-00003.safetensors',
      size: '4831838208',
      sha256: 'e017c948926333558df1a9637ff052c663378a70afbc1bb5b20528b8b5a501aa',
      url: '/download/model-00001-of-00003.safetensors',
      commit: MOCK_COMMIT,
    },
  },
}

export function ModelBlobDemo() {
  const [active, setActive] = useState<DemoKey>('markdown')
  const demo = DEMO_FILES[active]

  const {
    content: fetchedContent,
    isLoading,
    error,
  } = useFileContent(demo.file)

  const content = fetchedContent ?? demo.mockContent

  return (
    <Box p="md">
      <Stack gap="md">
        <Title order={4}>FileViewer Demo</Title>

        <SegmentedControl
          value={active}
          onChange={v => setActive(v as DemoKey)}
          data={[
            {
              label: 'Markdown (.md)',
              value: 'markdown',
            },
            {
              label: 'Python (.py)',
              value: 'python',
            },
            {
              label: 'JSON (.json)',
              value: 'json',
            },
            {
              label: 'Binary (.safetensors)',
              value: 'binary',
            },
          ]}
        />

        {error
          ? (
              <Text size="xs" c="yellow">
                ⚠ Fetch from file.url failed (expected with mock data), showing fallback content.
              </Text>
            )
          : null}

        <FileViewer
          file={demo.file}
          content={content}
          loading={isLoading}
        />
      </Stack>
    </Box>
  )
}

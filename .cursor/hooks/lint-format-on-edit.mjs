#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const hookDirectory = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(hookDirectory, '..', '..')

const lintableExtensions = new Set(['.js', '.cjs', '.mjs', '.jsx', '.ts', '.cts', '.mts', '.tsx'])

const parseInput = () => {
  const raw = fs.readFileSync(0, 'utf8')
  if (!raw.trim()) {
    return {}
  }

  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

const collectPathsFromValue = (value, collectedPaths) => {
  if (!value) {
    return
  }

  if (typeof value === 'string') {
    const trimmedPath = value.trim()
    if (trimmedPath) {
      collectedPaths.add(trimmedPath)
    }
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectPathsFromValue(item, collectedPaths)
    }
    return
  }

  if (typeof value !== 'object') {
    return
  }

  const directPathKeys = [
    'file_path',
    'filePath',
    'path',
    'relative_path',
    'relativePath',
    'target_file',
    'targetFile',
  ]

  for (const key of directPathKeys) {
    collectPathsFromValue(value[key], collectedPaths)
  }

  const collectionKeys = ['files', 'paths', 'edited_files', 'editedFiles']
  for (const key of collectionKeys) {
    collectPathsFromValue(value[key], collectedPaths)
  }

  collectPathsFromValue(value.tool_input, collectedPaths)
  collectPathsFromValue(value.toolInput, collectedPaths)
  collectPathsFromValue(value.tool_output, collectedPaths)
  collectPathsFromValue(value.toolOutput, collectedPaths)
}

const toRelativeRepoPath = candidatePath => {
  const absolutePath = path.isAbsolute(candidatePath)
    ? path.normalize(candidatePath)
    : path.resolve(repoRoot, candidatePath)

  const relativePath = path.relative(repoRoot, absolutePath)
  if (!relativePath || relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return null
  }

  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    return null
  }

  return relativePath
}

const runScript = (scriptName, targetPath) => {
  const result = spawnSync('pnpm', [scriptName, targetPath], {
    cwd: repoRoot,
    stdio: 'inherit',
  })

  return result.status === 0
}

const payload = parseInput()
const rawPaths = new Set()
collectPathsFromValue(payload, rawPaths)

const files = [...rawPaths].map(toRelativeRepoPath).filter(filePath => Boolean(filePath))

if (files.length === 0) {
  process.exit(0)
}

let hasFailure = false

for (const targetPath of files) {
  const extension = path.extname(targetPath).toLowerCase()

  if (lintableExtensions.has(extension)) {
    const lintSuccess = runScript('lint:file', targetPath)
    hasFailure = hasFailure || !lintSuccess
  }

  const formatSuccess = runScript('format:file', targetPath)
  hasFailure = hasFailure || !formatSuccess
}

if (hasFailure) {
  console.error(
    '[lint-format-on-edit] One or more commands failed. Edits were not blocked because this hook is fail-open.',
  )
}

process.exit(0)

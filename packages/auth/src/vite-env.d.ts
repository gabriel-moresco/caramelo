// `auth-client.ts` reads `import.meta.env.VITE_API_URL`, which is a Vite
// build-time replacement. This package isn't a Vite project, so Vite's own
// `ImportMeta` augmentation isn't in scope. Declaring it locally tells
// TypeScript that `import.meta.env` exists without adding `vite` as a dep.
interface ImportMeta {
  readonly env: Record<string, string | undefined>
}

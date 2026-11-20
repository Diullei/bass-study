import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves a project site from https://<user>.github.io/<repo>/,
// so every asset URL must be prefixed with the repo name.
// If you rename the repo or move to a custom domain, change this (custom domain → '/').
const REPO_NAME = 'bass-study'

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  // dev server at /, build and preview at /bass-study/
  base: command === 'build' || isPreview ? `/${REPO_NAME}/` : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}))

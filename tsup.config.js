import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
  bundle: true,
  dts: true,
});

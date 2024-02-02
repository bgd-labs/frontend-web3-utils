import { Options } from 'tsup';

const config: Options = {
  entry: ['src/index.tsx'],
  sourcemap: true,
  clean: true,
  // bundle: true,
  format: ['cjs'],
  dts: {
    compilerOptions: {
      moduleResolution: 'node',
      allowSyntheticDefaultImports: true,
      strict: true,
    },
  },
  // otherwise .env is ordered wrongly
  // https://github.com/evanw/esbuild/issues/399
  splitting: false,
};

export default config;

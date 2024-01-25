import fs from 'node:fs';

import prettier from 'prettier';
import { defineConfig } from 'tsup';

const entries = [
  {
    source: './src/index.ts',
    export: '.',
  },
  {
    source: './src/avatar.tsx',
    export: './avatar',
  },
  {
    source: './src/utils/cn.ts',
    export: './cn',
  },
];

export default defineConfig({
  entry: entries.map((entry) => entry.source),
  format: ['esm', 'cjs'],
  splitting: true,
  sourcemap: true,
  minify: true,
  clean: true,
  dts: true,
  outDir: 'dist',
  async onSuccess() {
    const packageJson = fs.readFileSync('./package.json', 'utf-8');
    const pkg = JSON.parse(packageJson);
    pkg.exports = entries.reduce(
      (acc: { [key: string]: Record<string, unknown> }, entry) => {
        acc[entry.export] = {
          import: {
            default: entry.source
              .replace('src', 'dist')
              .replace(/\.tsx?$/, '.js'),
            types: entry.source
              .replace('src', 'dist')
              .replace(/\.tsx?$/, '.d.ts'),
          },
          require: {
            default: entry.source
              .replace('src', 'dist')
              .replace(/\.tsx?$/, '.cjs'),
            types: entry.source
              .replace('src', 'dist')
              .replace(/\.tsx?$/, '.d.cts'),
          },
        };
        return acc;
      },
      {},
    );

    pkg.main = './dist/index.cjs';
    pkg.module = './dist/index.js';
    pkg.types = './dist/index.d.ts';

    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

    const prettierConfig = await prettier.resolveConfig(
      '../../prettier.config.js',
    );

    if (prettierConfig) {
      const formatted = await prettier.format(packageJson, {
        ...prettierConfig,
        filepath: './package.json',
      });
      fs.writeFileSync('./package.json', formatted);
    }
  },
});

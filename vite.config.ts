import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      // logLevel: 'warn',
      // copyDtsFiles: false,
      outDir: ['dist'],
      // include: ['src/index.ts'],
      exclude: [],
      aliasesExclude: [/^@demos/],
      staticImport: true,
      // rollupTypes: true,
      insertTypesEntry: true
    }),
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@demos': fileURLToPath(new URL('./src/demos', import.meta.url))
    },
    preserveSymlinks: false,
    dedupe: ['vue'],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  build: {
    cssCodeSplit: true,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'v-quicksight',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `v-quicksight.${format}.js`
    },
    minify: false,
    rollupOptions: {
      // make sure to externalize deps that should not be bundled
      // into your library
      input: {
        main: fileURLToPath(new URL('./src/index.ts', import.meta.url))
      },
      external: ['vue'], // Avoid bundling ol imports into the final build
      output: {
        inlineDynamicImports: true,
        exports: 'named',
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})

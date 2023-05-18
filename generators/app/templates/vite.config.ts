import type { ConfigEnv } from 'vite'

import { fileURLToPath, URL } from 'node:url'
import path from 'path'

import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'
import vitePluginZipDist from 'vite-plugin-dist-zip'
import { name } from './package.json'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteCompression from 'vite-plugin-compression'

import { createProxy } from './build/vite/proxy'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  const __DEV__ = mode === 'development'
  const env = loadEnv(mode, process.cwd())

  // 测试地址列表
  const list = [
    {
      prefix: env.VITE_BASE_URL,
      target: 'http://jsonplaceholder.typicode.com',
    },
  ]

  return defineConfig({
    base: env.VITE_PUBLIC_PATH, // 打包路径
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: './auto-imports.d.ts',
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true,
        },
      }),
      // gzip压缩 生产环境生成 .gz 文件
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        directoryAsNamespace: true,
      }),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
      }),
      vitePluginZipDist({ zipName: name, includeDistDir: true }),
      createHtmlPlugin({
        /**
         * 需要注入 index.html ejs 模版的数据
         */
        inject: {
          data: {
            title: 'vue3-vite4-pinia-axios-elementPlus-ts-temmpate',
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    //启动服务配置
    server: {
      host: '0.0.0.0',
      port: 5000,
      open: true,
      https: false,
      // 反向代理
      proxy: createProxy(list),
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {},
          javascriptEnabled: true,
          additionalData: `@import "src/assets/styles/var.less";`,
        },
      },
    },
    // 生产环境打包配置
    build: {
      assetsDir: 'static',
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        output: {
          entryFileNames: `static/app.js`,
          chunkFileNames: `static/[name].[hash].js`,
          assetFileNames: `static/[name].[hash].[ext]`,
        },
      },
      cssCodeSplit: false,
    },
    //去除 console debugger
    esbuild: __DEV__ ? {} : { drop: ['debugger', 'console'] },
  })
}

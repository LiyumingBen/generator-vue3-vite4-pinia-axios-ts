/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 自定义环境变量的 TypeScript 智能提示
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_PUBLIC_PATH: string
  readonly VITE_BASE_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare type Recordable<T = any> = Record<string, T>

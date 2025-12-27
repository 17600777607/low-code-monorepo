/// <reference types="vite/client" />

// 环境变量类型声明
interface ImportMetaEnv {
  readonly VUE_APP_TITLE: string
  readonly VUE_APP_ENV: 'development' | 'test' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Vue CLI 环境变量类型声明
declare namespace NodeJS {
  interface ProcessEnv {
    readonly VUE_APP_TITLE: string
    readonly VUE_APP_ENV: 'development' | 'test' | 'production'
  }
}

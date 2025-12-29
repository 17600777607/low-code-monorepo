import type { FrameworkConfiguration } from 'qiankun'

/**
 * qiankun 启动配置
 */
export const qiankunConfig: FrameworkConfiguration = {
  prefetch: true, // 预加载微应用
  sandbox: {
    strictStyleIsolation: false, // 严格样式隔离（使用 Shadow DOM）
    experimentalStyleIsolation: true, // 实验性样式隔离（推荐）
  },
  singular: false, // 是否为单实例场景
  fetch: window.fetch, // 自定义 fetch 方法
}

/**
 * 子应用 qiankun 生命周期钩子
 */

import type { QiankunProps } from 'vite-plugin-qiankun/dist/helper'
import type { App as VueApp } from 'vue'
import { createApp } from 'vue'
import consola from 'consola'
import App from '@designer/App.vue'

let app: VueApp | null = null

/**
 * 渲染函数
 */
function render(props: QiankunProps = {}) {
  const { container } = props
  app = createApp(App)

  const containerEl = container
    ? container.querySelector('#designer-app')
    : document.getElementById('designer-app')
  app.mount(containerEl || '#designer-app')
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次
 * 下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap
 */
function bootstrap() {
  /* eslint-disable no-console, no-undef */
  console.groupCollapsed('📦 [designer] 子应用内部生命周期')
  consola.ready('[designer] bootstrap')
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
function mount(props: QiankunProps) {
  consola.info('[designer] mount')
  render(props)
  console.groupEnd()
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
function unmount(props: QiankunProps) {
  /* eslint-disable no-console, no-undef */
  console.groupCollapsed(`📦 [designer] 子应用内部生命周期`)
  consola.info('[designer] unmount', props)
  if (app) {
    app.unmount()
    app = null
  }
  console.groupEnd()
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
function update(props: QiankunProps) {
  consola.log('[designer] update', props)
}

/**
 * 导出生命周期配置
 */
export const lifecycles = {
  bootstrap,
  mount,
  unmount,
  update,
}

/**
 * 导出渲染函数（用于独立运行）
 */
export { render }

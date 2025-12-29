/**
 * qiankun 微应用生命周期钩子
 * 用于监听微应用的加载、挂载、卸载等生命周期事件
 */

import consola from 'consola'

/**
 * 微应用信息接口
 */
interface MicroAppInfo {
  name: string
  [key: string]: unknown
}

/**
 * 微应用加载前钩子
 */
function beforeLoad(app: MicroAppInfo) {
  /* eslint-disable no-console, no-undef */
  console.groupCollapsed(`🚀 [qiankun] 微应用生命周期: ${app.name}`)
  consola.start(`正在加载微应用: ${app.name}`)
  return Promise.resolve()
}

/**
 * 微应用挂载前钩子
 */
function beforeMount(_app: MicroAppInfo) {
  // consola.info(`正在挂载微应用: ${app.name}`)
  return Promise.resolve()
}

/**
 * 微应用挂载后钩子
 */
function afterMount(app: MicroAppInfo) {
  consola.success(`✅ 微应用挂载成功: ${app.name}`)
  console.groupEnd()
  return Promise.resolve()
}

/**
 * 微应用卸载前钩子
 */
function beforeUnmount(app: MicroAppInfo) {
  console.groupCollapsed(`🔄 [qiankun] 微应用卸载 - ${app.name}`)
  consola.start(`正在卸载微应用: ${app.name}`)
  return Promise.resolve()
}

/**
 * 微应用卸载后钩子
 */
function afterUnmount(app: MicroAppInfo) {
  consola.success(`✅ 微应用卸载成功: ${app.name}`)
  console.groupEnd()
  return Promise.resolve()
}

/**
 * 微应用生命周期配置
 */
export const lifecycles = {
  beforeLoad,
  beforeMount,
  afterMount,
  beforeUnmount,
  afterUnmount,
}

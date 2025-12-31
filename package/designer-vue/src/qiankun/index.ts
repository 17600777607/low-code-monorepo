/**
 * qiankun 子应用配置入口
 */

import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { lifecycles, render } from './lifecycle'

/**
 * 启动 qiankun 子应用
 */
const startQiankun = () => {
  // qiankun 将会在微应用 bootstrap 之前注入一个运行时的 publicPath 变量
  renderWithQiankun(lifecycles)

  // 独立运行时，直接挂载应用
  if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    render()
  }
}

export default startQiankun

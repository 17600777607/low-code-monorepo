import { registerMicroApps, start } from 'qiankun'
import { qiankunConfig } from '@/qiankun/config'
import { microApps, type ExtendedMicroApp } from '@/qiankun/micro-apps'
import { lifecycles } from '@/qiankun/lifecycle'
import consola from 'consola'
let qiankunStarted = false
const findMicroApp = (name: string): ExtendedMicroApp | undefined => {
  return microApps.find(app => app.name === name)
}

const startQiankun = () => {
  if (qiankunStarted) {
    consola.box('[qiankun] 已经启动，跳过重复启动')
    return
  }

  // 注册微应用（带生命周期钩子）
  registerMicroApps(microApps, lifecycles)

  // 启动 qiankun
  start(qiankunConfig)

  qiankunStarted = true
  consola.success('[qiankun] 启动成功')
}

export { startQiankun, findMicroApp }

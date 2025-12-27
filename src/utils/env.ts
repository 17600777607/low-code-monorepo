/**
 * 环境变量工具类
 */

// 获取环境变量
export const getEnv = (key: keyof NodeJS.ProcessEnv): string => {
  return process.env[key] || ''
}

// 判断是否为开发环境
export const isDev = (): boolean => {
  return process.env.NODE_ENV === 'development'
}

// 判断是否为测试环境
export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test'
}

// 判断是否为生产环境
export const isProd = (): boolean => {
  return process.env.NODE_ENV === 'production'
}

// 导出所有环境变量
export const env = {
  NODE_ENV: process.env.NODE_ENV,
  VUE_APP_TITLE: process.env.VUE_APP_TITLE,
  VUE_APP_ENV: process.env.VUE_APP_ENV,
}

/**
 * 微应用配置文件
 * 集中管理所有微应用的配置信息
 */

import type { RegistrableApp } from 'qiankun'

/**
 * 自定义微应用属性
 */
export interface MicroAppMetadata {
  /** 微应用标题 */
  title?: string
  /** 微应用描述 */
  description?: string
  /** 微应用图标 */
  icon?: string
  /** 图标背景色 */
  color?: string
  /** 是否启用 */
  enabled?: boolean
  /** 微应用容器选择器 */
  container: string
}

/**
 * 扩展的微应用配置类型
 * 使用交叉类型合并 qiankun 标准配置和自定义属性
 */
export type ExtendedMicroApp = RegistrableApp<Record<string, unknown>> & MicroAppMetadata

/**
 * 微应用配置列表
 */
export const microApps: ExtendedMicroApp[] = [
  {
    title: '账号中心',
    description: '用户账号管理中心',
    icon: '👤',
    color: '#667eea',
    enabled: true,
    name: 'account',
    entry: '//localhost:5001',
    container: '#account-app-container',
    activeRule: '/account',
    props: {
      routerBase: '/account',
    },
  },
  {
    title: '管理后台',
    description: '系统管理后台',
    icon: '⚙️',
    color: '#764ba2',
    enabled: true,
    name: 'admin',
    entry: '//localhost:5002',
    container: '#admin-app-container',
    activeRule: '/admin',
    props: {
      routerBase: '/admin',
    },
  },
]

import type { ComponentCategory, ComponentConfig } from '@designer-vue/types/componentsTypes'

/**
 * 动态加载当前目录下 config 文件夹中的所有配置文件
 * 使用 Vite 的 import.meta.glob 实现自动发现
 */
const configModules = import.meta.glob<{ [key: string]: ComponentConfig }>('./config/*config.ts', {
  eager: true,
})

/**
 * 提取所有配置项
 */
const components: ComponentConfig[] = Object.values(configModules).flatMap(module =>
  Object.values(module)
)

/**
 * 高阶组件分类配置
 * 基于 element-plus 二次封装的组件
 */
export const highCategory: ComponentCategory = {
  name: 'high',
  label: '高阶组件',
  components,
}

import type { ButtonProps } from 'element-plus'

/**
 * Element Plus 组件配置选项常量
 * 用于配置面板中的下拉选择等场景
 */

/**
 * 按钮类型
 * 从 ButtonProps 中提取 type 属性的类型
 */
type ButtonType = NonNullable<ButtonProps['type']>

/**
 * 组件尺寸类型
 * 从 ButtonProps 中提取 size 属性的类型
 */
type ComponentSize = NonNullable<ButtonProps['size']>

/**
 * 选项配置接口
 */
interface OptionItem<T = string> {
  label: string
  value: T
}

/**
 * 按钮类型选项
 */
const EL_BUTTON_TYPE_OPTIONS: readonly OptionItem<ButtonType | ''>[] = [
  { label: '默认', value: '' },
  { label: '主要', value: 'primary' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' },
  { label: '信息', value: 'info' },
] as const

/**
 * 组件尺寸选项
 * 适用于按钮、输入框、选择器等多种组件
 */
const EL_BUTTON_SIZE_OPTIONS: readonly OptionItem<ComponentSize>[] = [
  { label: '大', value: 'large' },
  { label: '默认', value: 'default' },
  { label: '小', value: 'small' },
] as const

export { EL_BUTTON_TYPE_OPTIONS, EL_BUTTON_SIZE_OPTIONS }

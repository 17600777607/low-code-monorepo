module.exports = {
  // 标识此目录为 ESLint 配置的根目录,停止向上查找配置文件
  root: true,

  // 指定代码运行的环境
  env: {
    node: true,
  },

  // 继承的配置规则集
  extends: [
    'plugin:vue/vue3-essential', // Vue 3 基础规则
    'eslint:recommended', // ESLint 推荐规则
    '@vue/eslint-config-typescript', // TypeScript 规则
    '@vue/eslint-config-prettier', // Prettier 规则(必须放在最后)
  ],

  // 解析器选项
  parserOptions: {
    ecmaVersion: 'latest', // 使用最新 ECMAScript 版本
    parser: '@typescript-eslint/parser', // 使用 TypeScript 解析器
  },

  // 自定义规则
  rules: {
    // TypeScript 规则
    '@typescript-eslint/no-explicit-any': 'error', // 禁止使用 any 类型
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_', // 忽略以 _ 开头的参数
        varsIgnorePattern: '^_', // 忽略以 _ 开头的变量
        caughtErrorsIgnorePattern: '^_', // 忽略以 _ 开头的捕获错误
        destructuredArrayIgnorePattern: '^_', // 忽略以 _ 开头的解构数组元素
      },
    ],

    // Import 规则
    'no-unused-vars': 'off', // 关闭基础规则,使用 TypeScript 版本
    'no-console': 'error', // 生产环境警告 console
    'no-debugger': 'error', // 生产环境警告 debugger

    // Vue 规则
    'vue/multi-word-component-names': 'error', // 允许单词组件名
    'vue/no-unused-components': 'error', // 禁止未使用的组件
    'vue/no-unused-vars': 'error', // 禁止未使用的变量
  },
}

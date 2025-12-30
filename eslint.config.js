import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'

export default [
  // JavaScript 推荐配置
  js.configs.recommended,

  // Vue 推荐配置
  ...vue.configs['flat/recommended'],

  // Prettier 配置
  prettierConfig,

  // TypeScript 和 JavaScript 文件配置
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // 浏览器环境全局变量
        ...globals.browser,
        // Node.js 环境全局变量
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
    },
    rules: {
      // Prettier 规则
      'prettier/prettier': 'error',

      // TypeScript 规则
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // 通用规则
      'no-console': 'error', // 禁止使用 console
      'no-debugger': 'error', // 禁止使用 debugger
      'no-unused-vars': 'off', // 使用 TypeScript 的规则
    },
  },

  // Vue 文件配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: typescriptParser,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // 浏览器环境全局变量
        ...globals.browser,
        // Vue 3 编译器宏(在 <script setup> 中自动可用)
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        defineOptions: 'readonly',
        defineSlots: 'readonly',
        defineModel: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
    },
    rules: {
      // Prettier 规则
      'prettier/prettier': 'error',

      // TypeScript 规则
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Vue 规则
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'warn',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/block-spacing': 'error', // 块级标签内部需要空格
      'vue/padding-line-between-blocks': 'error', // 块级标签之间需要空行

      // 通用规则
      'no-console': 'error', // 禁止使用 console
      'no-debugger': 'error', // 禁止使用 debugger
      'no-unused-vars': 'off', // 使用 TypeScript 的规则
    },
  },

  // 忽略文件
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'apps/**',
      '*.log',
      '.DS_Store',
      'pnpm-lock.yaml',
      'package-lock.json',
    ],
  },
]

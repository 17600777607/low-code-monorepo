module.exports = {
  // 基础配置
  semi: false, // 不使用分号
  singleQuote: true, // 使用单引号
  printWidth: 100, // 每行最大字符数
  tabWidth: 2, // 缩进空格数
  useTabs: false, // 使用空格而不是 tab

  // 尾随逗号
  trailingComma: 'es5', // ES5 有效的地方添加尾随逗号

  // 箭头函数
  arrowParens: 'avoid', // 单参数箭头函数省略括号

  // 换行符
  endOfLine: 'lf', // 使用 LF

  // Vue 特定
  vueIndentScriptAndStyle: false, // Vue 文件中不缩进 <script> 和 <style>

  // HTML
  htmlWhitespaceSensitivity: 'css', // HTML 空格敏感度

  // 引号
  quoteProps: 'as-needed', // 对象属性按需添加引号

  // 括号间距
  bracketSpacing: true, // 对象字面量括号内添加空格

  // JSX
  jsxSingleQuote: false, // JSX 使用双引号
  bracketSameLine: false, // JSX 标签的 > 另起一行
}

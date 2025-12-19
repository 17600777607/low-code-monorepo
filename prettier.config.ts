import type { Config } from 'prettier'

const config: Config = {
  semi: false,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'es5',
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  vueIndentScriptAndStyle: false,
}

export default config

import type { ConfigFile } from '@rtk-query/codegen-openapi'
//https://redux-toolkit.js.org/rtk-query/usage/code-generation
const config: ConfigFile = {
  schemaFile: 'http://localhost:8000/openapi.json',
  apiFile: './src/api/emptyApi.ts',
  apiImport: 'enhancedApi',
  outputFile: './src/api/api.gen.ts',
  exportName: 'enhancedApi',
  hooks: true,
  tag: true,
  useEnumType: false,
}

export default config

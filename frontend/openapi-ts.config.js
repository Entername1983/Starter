import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input:
    process.env.NODE_ENV === 'production'
      ? 'http://localhost:8000/openapi.json'
      : 'http://localhost:8000/openapi.json',
  output: {
    path: './src/api',
    format: 'prettier',
    lint: 'eslint',
  },
  types: {
    enums: 'javascript',
    dates: 'types',
  },
  plugins: [
    '@hey-api/schemas',
    {
      enums: 'javascript',
      name: '@hey-api/typescript',
    },
    {
      name: '@hey-api/sdk',
      asClass: true,
      methodNameBuilder: operation => {
        return operation.id.split('Api')[0]
      },
    },
    {
      name: '@hey-api/client-fetch',
      client: {
        responseStyle: 'data',
      },
    },
  ],
})

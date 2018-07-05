import { File } from '../src'

export const source = `
  Test
`

export const files: File[] = [
  {
    path: './src/test.ts',
    aliases: ['app/test'],
    imports: ['Test']
  },
  {
    path: './src/app.ts',
    aliases: ['app'],
    imports: ['app', 'express']
  },
  {
    path: './node_modules/lodash/index.js',
    aliases: ['lodash/index.js', 'node_modules/lodash/index.js'],
    imports: ['findBy', 'find']
  }
]

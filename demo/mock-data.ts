import { File } from '../src'
import tokenise from '../src/parser/regex'

export const source = `
  Test
`
;(window as any).tokenise = tokenise
tokenise(source)

export const files: File[] = [
  {
    path: './src/test.ts',
    aliases: ['app/test'],
    imports: [
      {
        name: 'Test',
        type: 'class'
      }
    ]
  },
  {
    path: './src/app.ts',
    aliases: ['app'],
    imports: [
      {
        name: 'app',
        type: 'function'
      },
      {
        name: 'express',
        type: 'function'
      }
    ]
  },
  {
    path: './node_modules/lodash/index.js',
    aliases: ['lodash/index.js', 'node_modules/lodash/index.js'],
    imports: [
      {
        name: 'find',
        type: 'function'
      },
      {
        name: 'findBy',
        type: 'function'
      }
    ]
  }
]

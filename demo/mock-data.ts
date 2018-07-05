import { File } from '../src'
import tokenise from '../src/parser/regex'

export const source = `
Test

startServer

app

find

findBy

defaultExport
`
;(window as any).tokenise = tokenise

export const files: File[] = [
  {
    path: './src/test.ts',
    aliases: ['app/test'],
    imports: tokenise(`
      export class Test {}

      export default defaultExport
    `)
  },
  {
    path: './src/app.ts',
    aliases: ['app'],
    imports: tokenise(`
      export function startServer {}
      export const app: Express = express()
    `)
  },
  {
    path: './node_modules/lodash/index.js',
    aliases: ['lodash/index.js', 'node_modules/lodash/index.js'],
    imports: tokenise(`
      export function find(...args) {
        console.log('test', args)
      }
      export function findBy(...args) {
        console.log('test2', args)
      }
    `)
  }
]

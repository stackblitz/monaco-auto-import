import { ImportObject } from '../src'

export const source = `
  Test
`

export const imports: ImportObject[] = [
  {
    file: './src/app.ts',
    name: `Test`
  }
]

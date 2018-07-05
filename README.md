# monaco-auto-import

Easily add auto-import to the Monaco editor, with Javascript & Typescript support.

## Demo

![](https://i.imgur.com/BvQuMRC.gif)

### Example code

```ts
import AutoImport, { regexTokeniser } from 'monaco-auto-import'

const editor = monaco.editor.create(document.getElementById('demo'), {
  value: `
    PAD
    leftPad
    rightPad
  `,
  language: 'typescript'
})

const completor = new AutoImport({ monaco, editor })

completor.imports.saveFiles([
  {
    path: './node_modules/left-pad/index.js',
    aliases: ['left-pad'],
    imports: regexTokeniser(`
      export const PAD = ''
      export function leftPad() {}
      export function rightPad() {}
    `)
  }
])
```

## Getting started

### Installing

```bash
yarn add monaco-auto-import
# or
npm i monaco-auto-import --save
```

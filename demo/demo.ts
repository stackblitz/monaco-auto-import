import * as Monaco from 'monaco-editor'

import AutoImport, { regexTokeniser } from '../src'

const global = window as Window & {
  require: any
  monaco: typeof Monaco
}

const { require: $require } = global

// Set base path
$require.config({
  paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor/dev/vs' }
})

$require(['vs/editor/editor.main'], () => {
  const { monaco } = global

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

  // completor.imports.addImport('./src/test.ts', 'ASD')
  ;(window as any).monaco = monaco
  ;(window as any).editor = editor
  ;(window as any).completor = completor
})

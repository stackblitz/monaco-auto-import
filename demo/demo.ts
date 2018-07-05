import * as Monaco from 'monaco-editor'

import AutoImport from '../src'
import { files, source } from './mock-data'

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
    value: source,
    language: 'typescript'
  })

  const completor = new AutoImport({ monaco, editor })

  completor.imports.saveFiles(files)

  // completor.imports.addImport('./src/test.ts', 'ASD')
  ;(window as any).monaco = monaco
  ;(window as any).editor = editor
  ;(window as any).completor = completor
})

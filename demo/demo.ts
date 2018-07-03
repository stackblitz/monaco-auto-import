import * as Monaco from 'monaco-editor'

import AutoImport from '../src/auto-import'
import { source } from './mock-data'

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

  const completor = new AutoImport(monaco, editor)

  completor.imports.saveImport('./src/a.ts', 'Test')
})

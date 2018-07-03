import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api.d'

const global = window as Window & {
  require: any
  monaco: typeof Monaco
}

const { require: $require } = global

$require.config({ paths: { vs: 'https://unpkg.com/monaco-editor/dev/vs' } })

// let editor
$require(['vs/editor/editor.main'], () => {
  const { monaco } = global

  const editor = monaco.editor.create(document.getElementById('demo'), {
    value: 'ul#nav>li.item$*4>a{Item $}',
    language: 'typescript'
  })
})

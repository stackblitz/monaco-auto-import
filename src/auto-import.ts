import * as Monaco from 'monaco-editor'

import ImportCompletion from './import-completion'
import ImportDb from './import-db'

export let monaco: typeof Monaco

export interface Options {
  monaco: typeof Monaco
  editor: Monaco.editor.IStandaloneCodeEditor
}

class AutoImport {
  private readonly editor: Monaco.editor.IStandaloneCodeEditor
  public imports = new ImportDb()

  constructor(options: Options) {
    monaco = options.monaco
    this.editor = options.editor

    this.attachCommands()
  }

  public attachCommands() {
    const completor = new ImportCompletion(this.editor, this.imports)

    monaco.languages.registerCompletionItemProvider('typescript', completor)
  }
}

export default AutoImport

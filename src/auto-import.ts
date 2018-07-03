import * as Monaco from 'monaco-editor'

import ImportCompletion from './import-completion'
import ImportDb from './import-db'

export let monaco: typeof Monaco

class AutoImport {
  public imports = new ImportDb()

  constructor(
    $monaco: typeof Monaco,
    private readonly editor: Monaco.editor.IStandaloneCodeEditor
  ) {
    monaco = $monaco

    this.attachCommands()
  }

  public attachCommands() {
    monaco.languages.registerCompletionItemProvider(
      'typescript',
      new ImportCompletion(this.imports)
    )
  }
}

export default AutoImport

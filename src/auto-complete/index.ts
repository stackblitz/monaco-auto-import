import * as Monaco from 'monaco-editor'

import { ImportAction } from './import-action'
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

  /**
   * Register the commands to monaco & enable auto-importation
   */
  public attachCommands() {
    const completor = new ImportCompletion(this.editor, this.imports)
    monaco.languages.registerCompletionItemProvider('javascript', completor)
    monaco.languages.registerCompletionItemProvider('typescript', completor)

    const actions = new ImportAction(this.editor, this.imports)
    monaco.languages.registerCodeActionProvider('javascript', actions)
    monaco.languages.registerCodeActionProvider('typescript', actions)
  }
}

export default AutoImport

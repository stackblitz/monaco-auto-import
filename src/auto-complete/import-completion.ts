import * as Monaco from 'monaco-editor'

import { monaco } from '.'
import ImportDb, { File, Import, ImportObject } from './import-db'
import { ImportFixer } from './import-fixer'

const IMPORT_COMMAND = 'resolveImport'

class ImportCompletion implements Monaco.languages.CompletionItemProvider {
  constructor(
    private editor: Monaco.editor.IStandaloneCodeEditor,
    private importDb: ImportDb
  ) {
    // TODO: Add typings / find public API
    const cs = (editor as any)._commandService

    // Register the resolveImport
    cs.addCommand({
      id: IMPORT_COMMAND,
      handler: (_, ...args) => this.handleCommand.call(this, ...args)
    })
  }

  /**
   * Handles a command sent by monaco, when the
   * suggestion has been selected
   */
  public handleCommand(imp: ImportObject, document: Monaco.editor.ITextModel) {
    new ImportFixer(this.editor).fix(document, imp)
  }

  public provideCompletionItems(
    document: Monaco.editor.ITextModel,
    position: Monaco.Position
  ) {
    const wordToComplete = document
      .getWordAtPosition(position)
      .word.trim()
      .toLowerCase()

    const importMatcher = (imp: Import) =>
      imp.name.toLowerCase() === wordToComplete
    const fileMatcher = (f: File) => f.imports.findIndex(importMatcher) > -1

    const found = this.importDb.getImports(importMatcher, fileMatcher)

    return found.map(i => this.buildCompletionItem(i, document))
  }

  private buildCompletionItem(
    imp: ImportObject,
    document: Monaco.editor.ITextModel
  ): Monaco.languages.CompletionItem {
    const path = this.createDescription(imp)

    return {
      label: imp.name,
      kind: monaco.languages.CompletionItemKind.Reference,
      detail: `[AI] import ${imp.name} (Auto-Import)`,
      documentation: `[AI]  Import ${imp.name} from ${path}`,
      command: {
        title: 'AI: Autocomplete',
        id: IMPORT_COMMAND,
        arguments: [imp, document]
      }
    }
  }

  private createDescription(imp: ImportObject) {
    return imp.file.path
  }
}

export default ImportCompletion

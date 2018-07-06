import * as Monaco from 'monaco-editor'

import ImportDb, { ImportObject } from './import-db'
import { ImportFixer } from './import-fixer'
import kindResolver from './util/kind-resolution'

export const IMPORT_COMMAND = 'resolveImport'

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

  public provideCompletionItems(document: Monaco.editor.ITextModel) {
    const imports = this.importDb.all()

    return imports.map(i => this.buildCompletionItem(i, document))
  }

  // public provideCompletionItems__on_keypress(
  //   document: Monaco.editor.ITextModel,
  //   position: Monaco.Position
  // ) {
  //   const wordToComplete = document
  //     .getWordAtPosition(position)
  //     .word.trim()
  //     .toLowerCase()

  //   const importMatcher = (imp: Import) =>
  //     imp.name.toLowerCase() === wordToComplete
  //   const fileMatcher = (f: File) => f.imports.findIndex(importMatcher) > -1

  //   const found = this.importDb.getImports(importMatcher, fileMatcher)

  //   return found.map(i => this.buildCompletionItem(i, document))
  // }

  private buildCompletionItem(
    imp: ImportObject,
    document: Monaco.editor.ITextModel
  ): Monaco.languages.CompletionItem {
    const path = this.createDescription(imp)

    return {
      label: imp.name,
      kind: kindResolver(imp),
      detail: `Auto import from '${path}'\n${imp.type} ${imp.name}`,
      command: {
        title: 'AI: Autocomplete',
        id: IMPORT_COMMAND,
        arguments: [imp, document]
      }
    }
  }

  private createDescription({ file }: ImportObject) {
    return file.aliases[0] || file.path
  }
}

export default ImportCompletion

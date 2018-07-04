import * as Monaco from 'monaco-editor'

import { monaco } from './auto-import'
import ImportDb, { ImportObject } from './import-db'
import { ImportFixer } from './import-fixer'

class ImportCompletion implements Monaco.languages.CompletionItemProvider {
  constructor(
    private editor: Monaco.editor.IStandaloneCodeEditor,
    private importDb: ImportDb
  ) {
    const cs = (editor as any)._commandService
    cs.addCommand({
      id: 'resolveImport',
      handler: (_, ...args) => this.handleCommand.call(this, ...args)
    })
  }

  public handleCommand(imp: ImportObject, document: Monaco.editor.ITextModel) {
    new ImportFixer(this.editor).fix(document, [imp])
  }

  public provideCompletionItems(
    document: Monaco.editor.ITextModel,
    position: Monaco.Position
  ) {
    const wordToComplete = document
      .getWordAtPosition(position)
      .word.toLowerCase()

    const matcher = f => f.name.toLowerCase().indexOf(wordToComplete) > -1
    const found = this.importDb.all().filter(matcher)

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
        id: 'resolveImport',
        arguments: [imp, document]
      }
    }
  }

  private createDescription(imp: ImportObject) {
    return imp.file
  }
}

export default ImportCompletion

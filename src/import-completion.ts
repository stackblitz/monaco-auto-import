import * as Monaco from 'monaco-editor'

import { monaco } from './auto-import'
import ImportDb, { ImportObject } from './import-db'

class ImportCompletion implements Monaco.languages.CompletionItemProvider {
  constructor(private importDb: ImportDb) {}

  public async provideCompletionItems(
    document: Monaco.editor.ITextModel,
    position: Monaco.Position
  ) {
    let wordToComplete = document.getWordAtPosition(position).word.toLowerCase()

    let matcher = f => f.name.toLowerCase().indexOf(wordToComplete) > -1
    const found = this.importDb.all().filter(matcher)

    return found.map(i => this.buildCompletionItem(i, document))
  }

  private buildCompletionItem(
    imp: ImportObject,
    document: Monaco.editor.ITextModel
  ): any {
    const path = this.createDescription(imp)

    return {
      label: imp.name,
      kind: monaco.languages.CompletionItemKind.Reference,
      detail: `[AI] import ${imp.name} (Auto-Import)`,
      documentation: `[AI]  Import ${imp.name} from ${path}`,
      command: {
        title: 'AI: Autocomplete',
        command: 'extension.resolveImport',
        arguments: [{ imp, document }]
      }
    }
  }

  private createDescription(imp: ImportObject) {
    return imp.file
  }
}

export default ImportCompletion

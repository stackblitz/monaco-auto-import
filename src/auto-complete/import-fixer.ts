import * as Monaco from 'monaco-editor'

import { getMatches } from './../parser/util'
import { ImportObject } from './import-db'

export class ImportFixer {
  private spacesBetweenBraces
  private doubleQuotes
  private useSemiColon

  constructor(private editor: Monaco.editor.IStandaloneCodeEditor) {
    this.useSemiColon = false
    this.spacesBetweenBraces = true
    this.doubleQuotes = false
  }

  public fix(document: Monaco.editor.ITextModel, imp: ImportObject): void {
    const edits = this.getTextEdits(document, imp)
    this.editor.executeEdits('', edits)
  }

  public getTextEdits(document: Monaco.editor.ITextModel, imp: ImportObject) {
    const edits = new Array<Monaco.editor.IIdentifiedSingleEditOperation>()

    // const { path } = imp.file

    // const relativePath = this.normaliseRelativePath(
    //   path,
    //   this.getRelativePath(document, path)
    // )

    const { importResolved, fileResolved, imports } = this.parseResolved(
      document,
      imp
    )
    if (importResolved) return edits

    if (fileResolved) {
      edits.push({
        range: new Monaco.Range(0, 0, document.getLineCount(), 0),
        text: this.mergeImports(document, imp, imports[0].path)
      })
    } else {
      edits.push({
        range: new Monaco.Range(0, 0, 0, 0),
        text: this.createImportStatement(imp, true)
      })
    }

    return edits
  }

  /**
   * Returns whether a given import has already been
   * resolved by the user
   */
  private parseResolved(document: Monaco.editor.ITextModel, imp: ImportObject) {
    const exp = /(?:import[ \t]+{)(.*)}[ \t]from[ \t]['"](.*)['"]/g
    const currentDoc = document.getValue()

    const matches = getMatches(currentDoc, exp)
    const parsed = matches.map(([_, names, path]) => ({
      names: names.split(',').map(imp => imp.trim().replace(/\n/g, '')),
      path
    }))
    const imports = parsed.filter(
      ({ path }) =>
        path === imp.file.path || imp.file.aliases.indexOf(path) > -1
    )

    const importResolved =
      imports.findIndex(i => i.names.indexOf(imp.name) > -1) > -1

    return { imports, importResolved, fileResolved: !!imports.length }
  }

  /**
   * Merges an import statement into the document
   */
  private mergeImports(
    document: Monaco.editor.ITextModel,
    imp: ImportObject,
    path: string
  ) {
    const exp =
      this.useSemiColon === true
        ? new RegExp(`(?:import {)(?:.*)(?:} from ')(?:${path})(?:';)`)
        : new RegExp(`(?:import {)(?:.*)(?:} from ')(?:${path})(?:')`)

    let currentDoc = document.getValue()
    const foundImport = currentDoc.match(exp)

    if (foundImport) {
      let [workingString] = foundImport

      const replaceTarget =
        this.useSemiColon === true
          ? /{|}|from|import|'|"| |;/gi
          : /{|}|from|import|'|"| |/gi

      workingString = workingString.replace(replaceTarget, '').replace(path, '')

      const imports = [...workingString.split(','), imp.name]

      const newImport = this.createImportStatement({
        name: imports.join(', '),
        path
      })
      currentDoc = currentDoc.replace(exp, newImport)
    }

    return currentDoc
  }

  /**
   * Adds a new import statement to the document
   */
  private createImportStatement(
    imp: ImportObject | { name: string; path: string },
    endline: boolean = false
  ): string {
    const path = 'path' in imp ? imp.path : imp.file.aliases[0] || imp.file.path

    const formattedPath = path.replace(/\"/g, '').replace(/\'/g, '')
    let returnStr = ''

    const newLine = endline ? '\r\n' : ''

    if (this.doubleQuotes && this.spacesBetweenBraces) {
      returnStr = `import { ${imp.name} } from "${formattedPath}";${newLine}`
    } else if (this.doubleQuotes) {
      returnStr = `import {${imp.name}} from "${formattedPath}";${newLine}`
    } else if (this.spacesBetweenBraces) {
      returnStr = `import { ${imp.name} } from '${formattedPath}';${newLine}`
    } else {
      returnStr = `import {${imp.name}} from '${formattedPath}';${newLine}`
    }

    if (this.useSemiColon === false) {
      returnStr = returnStr.replace(';', '')
    }

    return returnStr
  }

  private getRelativePath(document, importObj: Monaco.Uri | any): string {
    return importObj
    // return importObj.discovered
    //   ? importObj.fsPath
    //   : path.relative(path.dirname(document.fileName), importObj.fsPath)
  }

  private normaliseRelativePath(importObj, relativePath: string): string {
    const removeFileExtenion = rp =>
      rp ? rp.substring(0, rp.lastIndexOf('.')) : rp

    const makeRelativePath = rp => {
      let preAppend = './'

      if (!rp.startsWith(preAppend)) {
        rp = preAppend + rp
      }

      // TODO
      if (true /* /^win/.test(process.platform)*/) {
        rp = rp.replace(/\\/g, '/')
      }

      return rp
    }

    relativePath = makeRelativePath(relativePath)
    relativePath = removeFileExtenion(relativePath)

    return relativePath
  }
}

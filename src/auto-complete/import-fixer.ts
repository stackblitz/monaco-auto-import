import * as Monaco from 'monaco-editor'

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
    console.warn(edits)
    this.editor.executeEdits('', edits)
    // this.editor.get
  }

  public getTextEdits(document: Monaco.editor.ITextModel, imp: ImportObject) {
    const edits = new Array<Monaco.editor.IIdentifiedSingleEditOperation>()

    const { path } = imp.file
    const { name } = imp

    const relativePath = this.normaliseRelativePath(
      path,
      this.getRelativePath(document, path)
    )

    if (this.alreadyResolved(document, relativePath, name)) {
      return edits
    }

    // if (this.shouldMergeImport(document, relativePath)) {
    //   edits.push({
    //     range: new Monaco.Range(0, 0, document.getLineCount(), 0),
    //     text: this.mergeImports(document, name, path, relativePath)
    //   })
    // } else {
    edits.push({
      range: new Monaco.Range(0, 0, 0, 0),
      text: this.createImportStatement(imp.name, relativePath, true)
    })
    // }

    return edits
  }

  private alreadyResolved(
    document: Monaco.editor.ITextModel,
    relativePath,
    importName
  ) {
    const exp = new RegExp(
      `(?:import {)(?:.*)(?:} from ')(?:${relativePath})(?:';)`
    )

    const currentDoc = document.getValue()
    const foundImport = currentDoc.match(exp)

    if (
      foundImport &&
      foundImport.length > 0 &&
      foundImport[0].indexOf(importName) > -1
    ) {
      return true
    }

    return false
  }

  private shouldMergeImport(
    document: Monaco.editor.ITextModel,
    relativePath
  ): boolean {
    const currentDoc = document.getValue()

    const isCommentLine = (text: string): boolean => {
      let firstTwoLetters = text.trim().substr(0, 2)
      return firstTwoLetters === '//' || firstTwoLetters === '/*'
    }

    return currentDoc.indexOf(relativePath) !== -1 && !isCommentLine(currentDoc)
  }

  private mergeImports(
    document: Monaco.editor.ITextModel,
    name,
    file,
    relativePath: string
  ) {
    const exp =
      this.useSemiColon === true
        ? new RegExp(`(?:import {)(?:.*)(?:} from ')(?:${relativePath})(?:';)`)
        : new RegExp(`(?:import {)(?:.*)(?:} from ')(?:${relativePath})(?:')`)

    let currentDoc = document.getValue()
    const foundImport = currentDoc.match(exp)

    if (foundImport) {
      let [workingString] = foundImport

      const replaceTarget =
        this.useSemiColon === true
          ? /{|}|from|import|'|"| |;/gi
          : /{|}|from|import|'|"| |/gi

      workingString = workingString
        .replace(replaceTarget, '')
        .replace(relativePath, '')

      const importArray = workingString.split(',')

      importArray.push(name)

      const newImport = this.createImportStatement(
        importArray.join(', '),
        relativePath
      )

      currentDoc = currentDoc.replace(exp, newImport)
    }

    return currentDoc
  }

  private createImportStatement(
    imp: string,
    path: string,
    endline: boolean = false
  ): string {
    const formattedPath = path.replace(/\"/g, '').replace(/\'/g, '')
    let returnStr = ''

    const newLine = endline ? '\r\n' : ''

    if (this.doubleQuotes && this.spacesBetweenBraces) {
      returnStr = `import { ${imp} } from "${formattedPath}";${newLine}`
    } else if (this.doubleQuotes) {
      returnStr = `import {${imp}} from "${formattedPath}";${newLine}`
    } else if (this.spacesBetweenBraces) {
      returnStr = `import { ${imp} } from '${formattedPath}';${newLine}`
    } else {
      returnStr = `import {${imp}} from '${formattedPath}';${newLine}`
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

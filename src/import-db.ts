type Name = string
type File = string

export interface ImportObject {
  name: Name
  file: File
}

class ImportDb {
  private imports = new Array<ImportObject>()

  public get size() {
    return this.imports.length
  }

  public all() {
    return this.imports
  }

  public getImport(name: Name) {
    return this.imports.filter(i => i.name === name)
  }

  public saveImport(file: File, name: Name) {
    name = name.trim()
    if (name === '' || name.length === 1) return

    const data: ImportObject = {
      name,
      file
    }

    const exists = this.imports.findIndex(
      i => i.name === data.name && i.file === file
    )

    if (exists === -1) {
      this.imports.push(data)
    }
  }
}

export default ImportDb

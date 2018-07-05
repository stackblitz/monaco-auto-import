type Name = string
type Path = string

export interface ImportObject {
  name: string
  file: File
}

export interface File {
  path: Path
  aliases?: Path[]

  imports?: Name[]
}

class ImportDb {
  private files = new Array<File>()

  /**
   * Returns the total amount of files in the store
   */
  public get size() {
    return this.files.length
  }

  /**
   * Returns all the files in the store
   */
  public all() {
    return this.files
  }

  /**
   * Fetches an import from the store
   */
  public getImports(
    name: Name,
    matcher: (file: File) => boolean = f => f.imports.indexOf(name) > -1
  ): ImportObject[] {
    const files = this.files.filter(matcher)

    return files.map(file => ({
      name,
      file
    }))
  }

  /**
   * Save a file to the store
   * @param file The file to save
   */
  public saveFile(file: File) {
    const data: File = {
      imports: [],
      aliases: [],
      ...file
    }

    const index = this.files.findIndex(f => f.path === data.path)

    if (index === -1) {
      this.files.push(data)
    } else {
      this.files[index] = data
    }
  }

  /**
   * Bulk save files to the store
   * @param files The files to save
   */
  public saveFiles(files: File[]) {
    files.forEach(file => this.saveFile(file))
  }

  /**
   * Fetches a file by it's path or alias
   * @param path The path to find
   */
  public getFile(path: Path) {
    const file = this.files.find(
      f => f.path === path || f.aliases.indexOf(path) > -1
    )

    return file
  }

  /**
   * Adds an import to a file
   * @param path The path / alias of the file to update
   * @param name The import name to add
   */
  public addImport(path: Path, name: Name) {
    const file = this.getFile(path)

    if (file) {
      const exists = file.imports.indexOf(name) > -1
      if (!exists) file.imports.push(name)
    }

    return !!file
  }

  /**
   * Removes an import from a file
   * @param path The path / alias of the file to update
   * @param name The import name to remove
   */
  public removeImport(path: Path, name: Name) {
    const file = this.getFile(path)

    if (file) {
      const index = file.imports.findIndex(i => i === name)
      if (index !== -1) file.imports.splice(index, 1)
    }

    return !!file
  }
}

export default ImportDb

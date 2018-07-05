import { Import } from '../auto-complete/import-db'
import { getMatches } from './util'

const findConstants = /export[ \t\n]+(?:declare[ \t\n]+)?(const +enum|default|class|interface|let|var|const|enum|type|function)[ \t\n]+([^=\n\t (:;<]+)/g
const findDynamics = /export +{([^}]+)}/g

const regexTokeniser = (file: string) => {
  const imports = new Array<Import>()

  // Extract constants
  {
    const matches = getMatches(file, findConstants)
    const imps = matches.map(([_, type, name]) => ({ type, name }))
    imports.push(...imps)
  }

  // Extract dynamic imports
  {
    const matches = getMatches(file, findDynamics)
    const flattened: string[] = [].concat(
      ...matches.map(([_, imps]) => imps.split(','))
    )

    // Resolve 'import as export'
    const resolvedAliases = flattened.map(raw => {
      const [imp, alias] = raw.split(' as ')
      return alias || imp
    })

    // Remove all whitespaces + newlines
    const trimmed = resolvedAliases.map(imp => imp.trim().replace(/\n/g, ''))

    const imps = trimmed.map(
      (name): Import => ({
        name,
        type: 'any'
      })
    )

    imports.push(...imps)
  }

  return imports
}

export default regexTokeniser

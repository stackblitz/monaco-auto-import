import { Import } from '../auto-complete/import-db'
import { getMatches } from './util'

const tokeniser = /export (const enum|default|class|interface|let|var|const|enum|type|function)[ \n]+([^=\n\t (:;<]+)/g

const regexTokeniser = (file: string) => {
  const matches = getMatches(file, tokeniser)
  const imports: Import[] = matches.map(([_, type, name]) => ({ type, name }))
  return imports
}

export default regexTokeniser

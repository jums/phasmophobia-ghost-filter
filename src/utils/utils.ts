import { Evidence, EvidenceKey, ghostData } from '../data/ghostData'

export type AnyObject = Record<string, unknown>

/**
 * Returns an array of object keys where keys match `filterValue`
 * @param object
 * @param filterValue
 * @returns String array
 */
export const filterKeysByProp = (object: AnyObject, filterValue: unknown) => {
  return Object.entries(object)
    .filter(([, value]) => value === filterValue)
    .map(([key]) => key)
}

/**
 * Filter ghosts based on `ghostProps`
 * @param ghostProps
 * @returns Array of possible Ghosts
 */
export const filterGhost = (ghostProps: Partial<Evidence>) => {
  const ghostIncludedEvidence = filterKeysByProp(ghostProps, true)
  const ghostExcludedEvidence = filterKeysByProp(ghostProps, false)

  const possibleGhosts = ghostData.filter(ghost => {
    const trueProps = filterKeysByProp(ghost.evidence, true)
    const falseProps = filterKeysByProp(ghost.evidence, false)
    const allTruesMatch = ghostIncludedEvidence.every((value) => trueProps.includes(value))
    const allFalsesMatch = ghostExcludedEvidence.every((value) => falseProps.includes(value))

    return allTruesMatch && allFalsesMatch
  })

  return possibleGhosts
}

/**
 * Pick only props with `true` values from `source`
 * @param source Evidence Object
 * @returns Filtered object
 */
export const pickTrues = (source: Partial<Evidence>) => {
  const res: Partial<Evidence> = {}
  Object.entries(source)
    .forEach(([name, status]) => {
      if (status) {
        res[name as EvidenceKey] = status
      }
    })
  return res
}

/**
 * Evidence pretty-name mapping
 */
const evidencePrettyNameMap: Record<EvidenceKey, string> = {
  emf: 'EMF5',
  spiritBox: 'Spirit box',
  fingerPrints: 'Fingerprints',
  ghostOrbs: 'Ghost orbs',
  ghostWriting: 'Ghost writing',
  freezingTemp: 'Freezing temp',
  DOTS: 'D.O.T.S.'
}

export const evidencePrettyName = (evidenceKey: EvidenceKey) => evidencePrettyNameMap[evidenceKey]

export const writeLocalStorage = (key: string, value: string) => localStorage.setItem(key, value)
export const readLocalStorage = (key: string) => localStorage.getItem(key)
export const clearLocalStorage = () => localStorage.clear()

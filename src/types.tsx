
export type PassageDetails = {
  book?: string
  chapter?: number
  verse?: number
}


export type Passage = {
  start: PassageDetails,
  end?: PassageDetails
}

export type BiblePassages = Passage[]


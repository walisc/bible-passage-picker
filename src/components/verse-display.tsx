import * as React from 'react'
import { Chip } from "@mui/material"
import { BiblePassages, Passage, PassageDetails } from '../types'

type VerseDiplayProps = React.ComponentPropsWithoutRef<'div'> & {
    selectedPassage: BiblePassages
    onUpdate: (passage: BiblePassages) => void
  }


class VerseModel{
    private startVerse:PassageDetails
    private endVerse?:PassageDetails
    private key:string

    constructor(passage:Passage, index:number){
        this.startVerse = passage.start
        this.endVerse = passage.end
        this.key = `${btoa(JSON.stringify(passage))}_${index}`
    }

    GetVerseKey():string{
        return this.key
    }

    GetVerseLabel():string{
        const formattedStartVerse = `${this.startVerse.book} ${this.startVerse.chapter}:${this.startVerse.verse}`
        return this.endVerse ? `${formattedStartVerse} - ${this.endVerse.book} ${this.endVerse.chapter}:${this.endVerse.verse}` : formattedStartVerse
    }

    GetAsPassage():Passage{
        return {
            start: this.startVerse,
            end: this.endVerse
        }
    }
}
  
export const VersesDisplay = ({
                        selectedPassage,
                        onUpdate,
                        ...props
                    }: VerseDiplayProps) => {

    
    const selectedVersesModels:{[key:string]: VerseModel} = selectedPassage.reduce((pv:any, passage:Passage, index:number) =>{
        const bibleVerseModel = new VerseModel(passage, index)
        pv[bibleVerseModel.GetVerseKey()] = bibleVerseModel
        return pv
    }, {})

    const onDelete = (key:string) => {
        return () => {
            let {[key]: _, ...updateSelectedValues} = selectedVersesModels
            onUpdate(Object.values(updateSelectedValues).map((verseModule)=>{
                return verseModule.GetAsPassage()
            }))
        }
    }
    

    return  (<div>
                {
                    Object.values(selectedVersesModels).map((passage:VerseModel) =>{
                        const key = passage.GetVerseKey()
                        return <Chip key={key} label={passage.GetVerseLabel()} onDelete={onDelete(key)} />
                    })
                }
    </div>)
    
}
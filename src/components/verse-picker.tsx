import React, {ChangeEvent, Component, useState} from 'react';
import {Box, Button, NativeSelect, OutlinedInput, Typography} from "@mui/material";
import ModeToggle from "./mode-toggle";
import {getBiblePassageSelectionToDisplay, getPassageUrlInBibleGateway} from "../utils";
import MultiplePassageForm from "./multiple-passage-form";
import SinglePassageForm from "./single-passage-form";
import { Passage } from '../types';
import BibleBooks from "../assets/bible_books.json";

type VersePickerBaseProps = React.ComponentPropsWithoutRef<'div'> & {
  onDismiss: () => void
}

type VersePickerAdderProps = VersePickerBaseProps & {
  onPassageAdd: (addPassage:Passage) => void
}

type PassageStartOrEnd = "start" | "end"
type PassageSelectionType= "book" | "chapter" | "verse"

class VersePickerBase<T extends VersePickerBaseProps> extends Component<T, Passage> {
  private onDismiss:() => void 
  constructor(props: T){
    super(props)
    this.onDismiss = this.props.onDismiss
    this.state = {
      start: {
        book: "Genesis",
        chapter: 1,
        verse: 1
      }
    }
  }

  OnSelectorChange(startOrEnd:PassageStartOrEnd, selectionType:PassageSelectionType){
    return (evt:ChangeEvent<HTMLSelectElement>) => {
      let updateState:Passage = {...this.state};
      (updateState[startOrEnd] as any)[selectionType] = evt.target.value

      if (selectionType == "book"){
        (updateState[startOrEnd] as any)["chapter"] = 1;
        (updateState[startOrEnd] as any)["verse"] = 1;
      }
      else if (selectionType == "chapter"){
        (updateState[startOrEnd] as any)["verse"] = 1
      }
      this.setState(updateState)
    }
    
  }

  GetPassageSelection(startOrEnd:PassageStartOrEnd, selectionType:PassageSelectionType){
    if (startOrEnd in this.state && selectionType in (this.state as any)[startOrEnd]){
      return (this.state as any)[startOrEnd][selectionType]
    }
    return ""
  }

  GetAllSelectionForType(startOrEnd:PassageStartOrEnd, selectionType:PassageSelectionType):any[]{
    const lengthToArray = (length:string) =>{
      return Array.from(Array(length).keys(), (v:number, i:number) => i+1)
    }

    if (selectionType == "book"){
      return Object.keys(BibleBooks)
    }
    else if (selectionType == "chapter" && (this.state as any)[startOrEnd].book){
      return lengthToArray(BibleBooks[(this.state as any)[startOrEnd].book].no_of_chapters)
    }
    else if (selectionType == "verse" && (this.state as any)[startOrEnd].book && (this.state as any)[startOrEnd].chapter){
      return lengthToArray(BibleBooks[(this.state as any)[startOrEnd].book].chapters_to_number_of_verses[(this.state as any)[startOrEnd].chapter-1])
    }
    return []
  }

  GetPassageSelector(){
    const getSelector = (label:string, startOrEnd:PassageStartOrEnd, selectionType:PassageSelectionType) => {
        return (<Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 280,
            '& > *': {
              m: 1,
            },
          }}
        >
          <NativeSelect
            style={{width: '95%'}}
            value={this.GetPassageSelection(startOrEnd, selectionType)}
            onChange={this.OnSelectorChange(startOrEnd, selectionType)}
            input={<OutlinedInput label={label}/>}
          >
            <option value={""}>None</option>
            {this.GetAllSelectionForType(startOrEnd, selectionType).map(item => <option key={item} value={item}>{item}</option>)}
          </NativeSelect>

        </Box>)
    }
    
    const getStartComponent = () => {
      return (
        <div>
          {getSelector("Book", "start", "book")}
          {getSelector("Chapter", "start", "chapter")}
          {getSelector("Verse", "start", "verse")}
        </div>
      )
    }

    return (<div>
      {getStartComponent()}
    </div>)
  }
}

export class VersePickerAdder extends VersePickerBase<VersePickerAdderProps>{

  private onPassageAdd:(addPassage:Passage) => void
  constructor(props: VersePickerAdderProps){
    super(props)
    this.onPassageAdd = this.props.onPassageAdd
  }

  render(): any {
      return (
        <div>
          {/* <ModeToggle className={'mb-6'} mode={mode} switchMode={switchMode}/> */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              '& > *': {
                m: 1,
              },
            }}
            className={"mb-6"}
          >
            {this.GetPassageSelector()}

          </Box>
        </div>
      )
  }
}

// const VersePicker = ({
//                        onDismiss,
//                        onSetPassage,
//                        selectedPassage: initialSelectedPassage,
//                        ...props
//                      }: VersePickerProps) => {
//   const [selectedPassage, setSelectedPassage] = useState(initialSelectedPassage);

//   return (
//     <div>
//       {/* <ModeToggle className={'mb-6'} mode={mode} switchMode={switchMode}/> */}
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           '& > *': {
//             m: 1,
//           },
//         }}
//         className={"mb-6"}
//         {...props}
//       >
//          <MultiplePassageForm onSetPassage={selectedPassage} selectedPassage={selectedPassage}/>

//       </Box>

//       {getPassageUrlInBibleGateway(selectedPassage) && <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           '& > *': {
//             m: 1,
//           },
//         }}
//         className={"mb-6"}
//         {...props}
//       >
//         <div style={{display: 'flex', alignItems: 'center'}}>
//           <Typography variant="subtitle1">
//             {getBiblePassageSelectionToDisplay(selectedPassage)}
//           </Typography>
//           <Button variant="text" href={getPassageUrlInBibleGateway(selectedPassage)} target={'_blank'}>Preview
//             Selection</Button>
//         </div>
//       </Box>}
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           '& > *': {
//             m: 1,
//           },
//         }}
//         className={"mb-6"}
//         {...props}
//       >
//         <div style={{display: 'flex'}}>
//           <Button variant="outlined" style={{marginRight: 8}} onClick={onDismiss}>Dismiss</Button>
//           <Button variant="outlined" style={{marginLeft: 8}} disabled={isNotValidSelection}
//                   onClick={onDone}>Done</Button>
//         </div>
//       </Box>


//     </div>
//   );
// };

// export default VersePicker;

import React, {ChangeEvent, Component} from 'react';
import {Box, Button, NativeSelect, OutlinedInput, Switch} from "@mui/material";
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

type VersePickerState = {
  data: Passage
  ui: {
    hasEnd: boolean
    hasEndText: string
  }
}

const HAS_END_TOGGLE_BUTTON_LABEL = {
  ENABLED: "Has no end?",
  NOT_ENABLED: "Has end?"
}

const getEndToggleButtonLabel = (isEnabled:boolean) => {
  return isEnabled ? HAS_END_TOGGLE_BUTTON_LABEL.ENABLED : HAS_END_TOGGLE_BUTTON_LABEL.NOT_ENABLED
}

class VersePickerBase<T extends VersePickerBaseProps> extends Component<T, VersePickerState> {
  protected onDismiss:() => void 
  constructor(props: T){
    super(props)
    this.onDismiss = this.props.onDismiss
    this.state = {
      data: {
        start: {
          book: "Genesis",
          chapter: 1,
          verse: 1
        }
      },
      ui: {
        hasEnd: false,
        hasEndText: getEndToggleButtonLabel(false)
      }
      
    }
  }

  OnSelectorChange(startOrEnd:PassageStartOrEnd, selectionType:PassageSelectionType){
    // TODO Validate end
    return (evt:ChangeEvent<HTMLSelectElement>) => {
      let updateState:VersePickerState = {...this.state};
      (updateState.data[startOrEnd] as any)[selectionType] = evt.target.value

      if (selectionType == "book"){
        (updateState.data[startOrEnd] as any)["chapter"] = 1;
        (updateState.data[startOrEnd] as any)["verse"] = 1;
      }
      else if (selectionType == "chapter"){
        (updateState.data[startOrEnd] as any)["verse"] = 1
      }
      this.setState(updateState)
    }
    
  }

  OnHasEndVerseSelected(event: React.ChangeEvent<HTMLInputElement>){
    let updateState:VersePickerState = {...this.state};
    updateState.ui.hasEnd = event.target.checked
    if (updateState.ui.hasEnd){
      updateState.data.end = {...updateState.data.start}
    }
    else if ("end" in updateState.data){
      delete updateState.data.end
    }
    updateState.ui.hasEndText = getEndToggleButtonLabel(updateState.ui.hasEnd)
    this.setState(updateState)
  }

  GetPassageSelection(startOrEnd:PassageStartOrEnd, selectionType:PassageSelectionType){
    if (startOrEnd in this.state.data && (this.state.data as any)[startOrEnd] && selectionType in (this.state.data as any)[startOrEnd]){
      return (this.state.data as any)[startOrEnd][selectionType]
    }
    return ""
  }

  GetAllSelectionForType(startOrEnd:PassageStartOrEnd, selectionType:PassageSelectionType):any[]{
    const lengthToArray = (length:string) =>{
      return Array.from(Array(length).keys(), (v:number, i:number) => i+1)
    }

    if (!((this.state.data as any)[startOrEnd])){
      return []
    }

    if (selectionType == "book"){
      return Object.keys(BibleBooks)
    }
    else if (selectionType == "chapter" && (this.state.data as any)[startOrEnd].book){
      return lengthToArray(BibleBooks[(this.state.data as any)[startOrEnd].book].no_of_chapters)
    }
    else if (selectionType == "verse" && (this.state.data as any)[startOrEnd].book && (this.state.data as any)[startOrEnd].chapter){
      return lengthToArray(BibleBooks[(this.state.data as any)[startOrEnd].book].chapters_to_number_of_verses[(this.state.data as any)[startOrEnd].chapter-1])
    }
    return []
  }

  GetPassageSelector(){
    const getSelector = (label:string, startOrEnd:PassageStartOrEnd, selectionType:PassageSelectionType) => {
        return (
          <Box
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
    
    const getPassageComponent = (startOrEnd:PassageStartOrEnd) => {
      return (
        <div>
          {getSelector("Book", startOrEnd, "book")}
          {getSelector("Chapter", startOrEnd, "chapter")}
          {getSelector("Verse", startOrEnd, "verse")}
        </div>
      )
    }

    return (
      <div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > *': {
              m: 1,
            },
          }}
        >
          <div style={{display: 'flex'}}>
            <Switch
                checked={this.state.ui.hasEnd}
                onChange={this.OnHasEndVerseSelected.bind(this)}
                inputProps={{ style: {height: '100%' }}}
              />
              <p style={{marginTop: "12px", fontSize: "12px"}}>{this.state.ui.hasEndText}</p>
          </div>
        </Box>
        <div style={{display: 'flex'}}>
          <div>
            {getPassageComponent("start")}
          </div>
          <div>
            {this.state.ui.hasEnd ? getPassageComponent("end") : ''}
          </div>
      </div>
    </div>
    )
  }
}

export class VersePickerAdder extends VersePickerBase<VersePickerAdderProps>{

  private onPassageAdd:(addPassage:Passage) => void
  constructor(props: VersePickerAdderProps){
    super(props)
    this.state = {
      data: {
        start: {
          book: "Genesis",
          chapter: 1,
          verse: 1
        }
      },
      ui: {
        hasEnd: false,
        hasEndText: getEndToggleButtonLabel(false)
      }
    }
    this.onPassageAdd = this.props.onPassageAdd
  }

  render(): any {
      return (
        <div>
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
                <div style={{display: 'flex'}}>
                  <Button variant="outlined" style={{marginRight: 8}} onClick={this.onDismiss}>Cancel</Button>
                  <Button variant="outlined" style={{marginLeft: 8}} onClick={() => this.onPassageAdd(this.state.data)}>Add</Button>
                </div>
          </Box>

        </div>
      )
  }
}

type VersePickerEditorProps = VersePickerBaseProps & {
  onPassageEdit: (passageKey:string, addPassage:Passage) => void
  selectedPassage: Passage
  passageKey:string
}
export class VersePickerEditor extends VersePickerBase<VersePickerEditorProps>{


  constructor(props: VersePickerEditorProps){
    super(props)
    const hasEnd = "end" in this.props.selectedPassage && !!this.props.selectedPassage.end
    this.state = {
      data: {...this.props.selectedPassage},
      ui: {
        hasEnd: hasEnd,
        hasEndText: getEndToggleButtonLabel(hasEnd)
      }
    }

  }

  render(): any {
      return (
        <div>
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
                <div style={{display: 'flex'}}>
                  <Button variant="outlined" style={{marginRight: 8}} onClick={this.onDismiss}>Cancel</Button>
                  <Button variant="outlined" style={{marginLeft: 8}} onClick={() => this.props.onPassageEdit( this.props.passageKey, this.state.data)}>Update</Button>
                </div>
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

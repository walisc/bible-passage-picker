import * as React from 'react'
import {BiblePassages, Passage} from './types'
import {useState} from "react";
import {Button, Grid, Popover} from "@mui/material";
import { VersesDisplay } from './components/verse-display';
import { VersePickerAdder, VersePickerEditor } from './components/verse-picker';

type BiblePassagePickerProps = React.ComponentPropsWithoutRef<'div'> & {
  initialPassages: BiblePassages
  onPassagesUpdated: (value: BiblePassages) => void
}

enum VersePickerTypesEnum {
  Editor = "Editor",
  Adder = "Added"
}
const VersePickerTypes = {
  Editor: VersePickerEditor,
  Added: VersePickerAdder
}

type PickerDisplay = {
  targetElement: HTMLButtonElement | null,
  pickerType: VersePickerTypesEnum | null
  pickerProps: any 
}

export const BiblePassagePicker = ({
                                     initialPassages,
                                     onPassagesUpdated,
                                     ...props
                                   }: BiblePassagePickerProps) => {


  const [displayState, setDisplayState] = useState<PickerDisplay>({
    targetElement: null,
    pickerType: null,
    pickerProps: null
  })

  const [selectedPassageState, updatePassagesState] = useState<BiblePassages>(initialPassages || []);

  const handleShowPopover = (pickerType:VersePickerTypesEnum, event: React.MouseEvent<HTMLButtonElement>, pickerProps:any) => {
    setDisplayState({
      targetElement: event.currentTarget,
      pickerType: pickerType,
      pickerProps
    });
  }

  const handleClosePopover = () => {
    setDisplayState({
      targetElement: null,
      pickerType: null,
      pickerProps: null
    });
  };

  const updatePassages = (biblePassages:BiblePassages) => {
    updatePassagesState(biblePassages)
    onPassagesUpdated(biblePassages)
    handleClosePopover();
  }

  const onAddPassage = (addedPassage: Passage) => {
    updatePassages([...selectedPassageState, addedPassage])
  }

  const getPicker = (pickerType:VersePickerTypesEnum) => {
    const Picker = VersePickerTypes[pickerType]
    return <Picker onDismiss={handleClosePopover} {...displayState.pickerProps}/>
  }
  
  return <Grid item xs={12} md={6}  {...props}>
    <div style={{
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{marginLeft: 8}}>
        <VersesDisplay selectedPassage={selectedPassageState} onUpdate={updatePassages} onEdit={( event: any, pickerProps:any) => handleShowPopover(VersePickerTypesEnum.Editor, event, pickerProps)}  />
      </div>
      {
        <Button variant="text" onClick={( event: React.MouseEvent<HTMLButtonElement>) => handleShowPopover(VersePickerTypesEnum.Adder, event, {onPassageAdd: onAddPassage})}>{'Add Passage'}</Button>
      }
      {/* <Button variant="text" id={id}
              onClick={handleShowPopover}>{getPassageUrlInBibleGateway(selectedPassage) ? 'Edit Passage' : 'Select Passage'}</Button>
      {getPassageUrlInBibleGateway(selectedPassage) &&
        <Button variant="text" href={getPassageUrlInBibleGateway(selectedPassage)} target={'_blank'}>Preview
          Selection</Button>} */}
    </div>
    { 
        displayState.pickerType && displayState.targetElement 
        ? 
          <Popover
            open={true}
            onClose={handleClosePopover}
            anchorEl={displayState.targetElement}
          >
            <Grid item xs={12} md={6}> 
              {getPicker(displayState.pickerType)}
            </Grid>
          </Popover>
       : ``
    }
  </Grid>
}

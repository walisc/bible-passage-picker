import * as React from 'react'
import {BiblePassages, Passage} from './types'
import {useState} from "react";
import {getBiblePassageSelectionToDisplay, getPassageUrlInBibleGateway} from "./utils";
import {Button, Grid, Popover} from "@mui/material";
import { VersesDisplay } from './components/verse-display';
import { VersePickerAdder } from './components/verse-picker';

type BiblePassagePickerProps = React.ComponentPropsWithoutRef<'div'> & {
  initialPassages: BiblePassages
  onPassagesUpdated: (value: BiblePassages) => void
}

export const BiblePassagePicker = ({
                                     initialPassages,
                                     onPassagesUpdated,
                                     ...props
                                   }: BiblePassagePickerProps) => {


  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedPassageState, updatePassagesState] = useState<BiblePassages>(initialPassages || []);

  const handleShowPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const showBiblePassagePicker = Boolean(anchorEl);
  const id = showBiblePassagePicker ? 'simple-popover' : undefined;

  const updatePassages = (biblePassages:BiblePassages) => {
    updatePassagesState(biblePassages)
    onPassagesUpdated(biblePassages)
  }

  const onAddPassage = (addedPassage: Passage) => {
    updatePassages([...selectedPassageState, addedPassage])
    handleClosePopover();
  }

  return <Grid item xs={12} md={6}  {...props}>
    <div style={{
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{marginLeft: 8}}>
        <VersesDisplay selectedPassage={selectedPassageState} onUpdate={updatePassages} />
      </div>
      {
        <Button variant="text" id={id} onClick={handleShowPopover}>{'Add Passage'}</Button>
      }
      {/* <Button variant="text" id={id}
              onClick={handleShowPopover}>{getPassageUrlInBibleGateway(selectedPassage) ? 'Edit Passage' : 'Select Passage'}</Button>
      {getPassageUrlInBibleGateway(selectedPassage) &&
        <Button variant="text" href={getPassageUrlInBibleGateway(selectedPassage)} target={'_blank'}>Preview
          Selection</Button>} */}
    </div>
    <Popover
      open={showBiblePassagePicker}
      onClose={handleClosePopover}
      anchorEl={anchorEl}
    >
      <Grid item xs={12} md={6}>
        <VersePickerAdder onDismiss={handleClosePopover} onPassageAdd={onAddPassage}/>
      </Grid>
    </Popover>
  </Grid>
}

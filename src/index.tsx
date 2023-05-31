import * as React from 'react'
import {BiblePassages} from './types'
import {useState} from "react";
import {getBiblePassageSelectionToDisplay, getPassageUrlInBibleGateway} from "./utils";
import {Button, Grid, Popover, Typography} from "@mui/material";
import VersePicker from "./components/verse-picker";
import { VersesDisplay } from './components/verse-display';

type BiblePassagePickerProps = React.ComponentPropsWithoutRef<'div'> & {
  value: BiblePassages
  setValue: (value: BiblePassages) => void
}

export const BiblePassagePicker = ({
                                     value,
                                     setValue,
                                     ...props
                                   }: BiblePassagePickerProps) => {


  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedPassages, updatePassages] = useState(value || []);

  const handleShowPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const showBiblePassagePicker = Boolean(anchorEl);
  const id = showBiblePassagePicker ? 'simple-popover' : undefined;


  // const onSetPassage = (passage: PassageValueType) => {
  //   setSelectedPassage(passage);
  //   setValue(passage);
  //   handleClosePopover();
  // }

  return <Grid item xs={12} md={6}  {...props}>
    <div style={{
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{marginLeft: 8}}>
        <VersesDisplay selectedPassage={selectedPassages} onUpdate={updatePassages} />
      </div>
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
      {/* <Grid item xs={12} md={6}>
        <VersePicker onDismiss={handleClosePopover} onSetPassage={onSetPassage} selectedPassage={selectedPassage}/>
      </Grid> */}
    </Popover>
  </Grid>
}

import React, {ChangeEvent, useState} from 'react';
import {Box, Button, Typography} from "@mui/material";
import ModeToggle from "./mode-toggle";
import {getBiblePassageSelectionToDisplay, getPassageUrlInBibleGateway} from "../utils";
import {PassageModeType, PassageValueType} from "../types";
import MultiplePassageForm from "./multiple-passage-form";
import SinglePassageForm from "./single-passage-form";

type VersePickerProps = React.ComponentPropsWithoutRef<'div'> & {
  onDismiss: () => void
  onSetPassage: (passage: PassageValueType) => void
  selectedPassage: PassageValueType
}

const VersePicker = ({
                       onDismiss,
                       onSetPassage,
                       selectedPassage: initialSelectedPassage,
                       ...props
                     }: VersePickerProps) => {
  const [selectedPassage, setSelectedPassage] = useState(initialSelectedPassage);

  const mode = selectedPassage.mode || 'single';

  const switchMode = (mode: PassageModeType) => {
    setSelectedPassage(selectedPassage => {
      return {...selectedPassage, mode};
    });
  }

  const onSelectSinglePassageBook = (event: ChangeEvent<HTMLSelectElement>) => {
    event.persist();
    setSelectedPassage({...selectedPassage, single: {book: event.target.value}});
  }

  const onSelectSinglePassageChapter = (event: ChangeEvent<HTMLSelectElement>) => {
    event.persist();
    setSelectedPassage(passage => ({
      ...passage, single: {...passage.single, chapter: event.target.value}
    }))
  }

  const onSelectSinglePassageVerse = (event: ChangeEvent<HTMLSelectElement>) => {
    event.persist();
    setSelectedPassage(passage => ({...passage, single: {...passage.single, verse: event.target.value}}));
  }


  const onSelectMultiplePassageStartBook = (_event: any, book: string) => {
    setSelectedPassage({...selectedPassage, start: {book}});
  }

  const onSelectMultiplePassageStartChapter = (_event: any, chapter: string) => {
    setSelectedPassage(passage => ({
      ...passage,
      start: {...passage.start, chapter, verse: undefined}
    }))
  }

  const onSelectMultiplePassageStartVerse = (_event: any, verse: string) => {
    setSelectedPassage(passage => ({...passage, start: {...passage.start, verse}}))
  }


  const onSelectMultiplePassageEndBook = (_event: any, book: string) => {
    setSelectedPassage({...selectedPassage, end: {book}});
  }

  const onSelectMultiplePassageEndChapter = (_event: any, chapter: string) => {
    setSelectedPassage(passage => ({...passage, end: {...passage.end, chapter, verse: undefined}}))
  }

  const onSelectMultiplePassageEndVerse = (_event: any, verse: string) => {
    setSelectedPassage(passage => ({...passage, end: {...passage.end, verse}}));
  }


  const onDone = () => {
    if (!getBiblePassageSelectionToDisplay(selectedPassage)) {
      return;
    }
    onSetPassage(selectedPassage)
  }


  const isNotValidSelection = !getPassageUrlInBibleGateway(selectedPassage);

  const multiplePassageFormProps = {
    selectedPassage,
    onSelectMultiplePassageStartBook,
    onSelectMultiplePassageStartChapter,
    onSelectMultiplePassageStartVerse,
    onSelectMultiplePassageEndBook,
    onSelectMultiplePassageEndChapter,
    onSelectMultiplePassageEndVerse
  }

  const singlePassageFormProps = {
    selectedPassage, onSelectSinglePassageBook, onSelectSinglePassageChapter, onSelectSinglePassageVerse
  }

  return (
    <div>
      <ModeToggle className={'mb-6'} mode={mode} switchMode={switchMode}/>
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
        {...props}
      >
        {mode === 'multiple' && <MultiplePassageForm {...multiplePassageFormProps}/>}
        {mode === 'single' && <SinglePassageForm  {...singlePassageFormProps} />}
      </Box>

      {getPassageUrlInBibleGateway(selectedPassage) && <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > *': {
            m: 1,
          },
        }}
        className={"mb-6"}
        {...props}
      >
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Typography variant="subtitle1">
            {getBiblePassageSelectionToDisplay(selectedPassage)}
          </Typography>
          <Button variant="text" href={getPassageUrlInBibleGateway(selectedPassage)} target={'_blank'}>Preview
            Selection</Button>
        </div>
      </Box>}
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
        {...props}
      >
        <div style={{display: 'flex'}}>
          <Button variant="outlined" style={{marginRight: 8}} onClick={onDismiss}>Dismiss</Button>
          <Button variant="outlined" style={{marginLeft: 8}} disabled={isNotValidSelection}
                  onClick={onDone}>Done</Button>
        </div>
      </Box>


    </div>
  );
};

export default VersePicker;

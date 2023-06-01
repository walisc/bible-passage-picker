import React, {useState} from 'react'

import {BiblePassagePicker} from 'bible-passage-picker'
//import 'bible-passage-picker/dist/index.css'
import {BiblePassages} from "../../src/types";

const App = () => {
  const [selectedPassage, setSelectedPassage] = useState<BiblePassages>([{
    start: {
      book: "Gen",
      chapter: 1,
      verse: 1
    },
    end: {
      book: "Ep",
      chapter: 1,
      verse: 2
    }
   
  }]);

  return <BiblePassagePicker initialPassages={selectedPassage} onPassagesUpdated={setSelectedPassage}/>
}

export default App

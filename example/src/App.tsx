import React, {useState} from 'react'

import {BiblePassagePicker} from 'bible-passage-picker'
//import 'bible-passage-picker/dist/index.css'
import {BiblePassages} from "../../src/types";

const App = () => {
  const [selectedPassage] = useState<BiblePassages>([{
    start: {
      book: "Genesis",
      chapter: 1,
      verse: 1
    },
    end: {
      book: "Genesis",
      chapter: 1,
      verse: 5
    }
   
  }]);

  return <BiblePassagePicker initialPassages={selectedPassage} onPassagesUpdated={(bp: BiblePassages) => {console.log(bp)}}/>
}

export default App

import * as React from 'react'
import ReactDOM from "react-dom";
import { BiblePassagePicker } from "./index"

(function(global, $){

    if (typeof $ === 'undefined') {
      throw new Error('Bible verser picker requires jQuery.');
    }

    if ($.fn.bibleVersePicker) {
      throw new Error('plugin conflicted, the name "bibleVersePicker" has been taken by another jQuery plugin.');
    }
  
    $.fn["bibleVersePicker"] = function(options:any) {
        ReactDOM.render(<BiblePassagePicker initialPassages={options.initialPassages} onPassagesUpdated={options.onPassagesUpdated}/>, $(this)[0])
    }

  })(global, (window as any).jQuery)

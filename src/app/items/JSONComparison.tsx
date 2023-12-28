// move to seperate component
"use client";

// ref
// https://github.com/relex/json-diff-react/blob/main/examples/example-07.html#L37
// https://www.npmjs.com/package/json-diff-react

import React, { useState } from "react";
import styles from "./items-page.module.css";

import { JsonDiffComponent } from "json-diff-react";

/* 
to-do: 
- implement form for editing
- implement pulling from aws dev database
- implement aws object set to form value - ready for editing
- json schema editing
- push to dev database
- on merge, display differnce in json object by line comparison red/green display lines
- push and update aws production database


misc:
- look into what is ${e?.message ?? JSON.stringify(e)}`; 

done: 
*/

const crops_old = {
        "name": "wheat",
        "price": 200
    };

    const crops_new = {
        "name": "wheater",
        "price": 1002,
        "location": "spacemountain"
    };

    // function to return JSX element
// const JSONComparison = ({a, b}: {a: string, b:string}):JSX.Element => {
//     try {
//         const parsedA = JSON.parse(a);
//         const parsedB = JSON.parse(b);

//         return <JsonDiffComponent
//             jsonA = {parsedA}
//             jsonB = {parsedB}
//             styleCustomization={{
//                 additionLineStyle: { color: 'green' },
//                 deletionLineStyle: { color: 'red' },
//                 unchangedLineStyle: { color: 'gray' },
//                 frameStyle: {
//                     'font-size': '15px',
//                     'font-family': 'monospace',
//                     'white-space': 'pre',
//                     'background': 'silver',
//                 },
//                 }}
//         />;
//     } catch (e) {
//         return <p>Error: {e?.message ?? JSON.stringify(e)}</p>;
//     };
// }
const JSONComparison = ({a, b}: {a: string, b:string}):JSX.Element => {
    try {
        const parsedA = JSON.parse(a);
        const parsedB = JSON.parse(b);

        return <JsonDiffComponent
            jsonA = {parsedA}
            jsonB = {parsedB}
            styleCustomization={{
                additionLineStyle: { color: 'green' , content: '+'},
                deletionLineStyle: { color: 'red', content: '-'},
                unchangedLineStyle: { color: 'gray' },
                frameStyle: {
                    'font-size': '15px',
                    'font-family': 'monospace',
                    'white-space': 'pre',
                    'background': 'silver',
                },
              }}
        />;
    } catch (e) {
        return <p>Error: {e?.message ?? JSON.stringify(e)}</p>;
    };
}


const ItemsPage = () =>{
    
    const [jsonAInput, setJsonAInput] = useState(JSON.stringify(crops_old, null, 4));
    const [jsonBInput, sethJsonBInput] = useState(JSON.stringify(crops_new, null, 4));

    let error: string | null = null;

    let jsonA = null; 
    try {
        jsonA = JSON.parse(jsonAInput);
    } catch(e) {
        error = `Failed to parse JSON A: ${e?.message ?? JSON.stringify(e)}`;
    }
    
    let jsonB = null;
    try {
        jsonB = JSON.parse(jsonBInput);
    } catch(e) {
        error = `Failed to parse JSON B: ${e?.message ?? JSON.stringify(e)}`;
    }

    const invalid_json = {"name": "Joe", "age": null, } // extra comma

    return (
        
        // change maxwidthwrapper into styles.container + global.css change
        <div className = {styles.container}>

            <div className = {styles.jsonInput}>
                <textarea value = {jsonAInput} onChange = {e => setJsonAInput(e.target.value)}/>
                <textarea value = {jsonBInput} onChange = {e => sethJsonBInput(e.target.value)}/>
            </div>

            {error !== null ? <p className = {styles.error}>{error}</p>:<JSONComparison a = {JSON.stringify(jsonAInput)} b = {JSON.stringify(jsonBInput)}/>};
            
            <p>An example from the README.md.</p>
            <JSONComparison a = {JSON.stringify(crops_old)} b = {JSON.stringify(crops_new)}/>

            <p>Here is a render of a parsing error:</p>
            <JSONComparison a = {JSON.stringify(invalid_json)} b = {JSON.stringify(crops_new)}/> 

        </div>
    )
}

export default ItemsPage;
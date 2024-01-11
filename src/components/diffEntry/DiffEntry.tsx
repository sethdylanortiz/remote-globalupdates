"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import styles from "./diffEntry.module.css";
import { DiffEditor } from "@monaco-editor/react";

// icons
import icon_file from "../../../public/icon_file.png";
import icon_plus from "../../../public/icon-plus.png"
import icon_minus from "../../../public/icon_minus.png"
import icon_warning from "../../../public/icon-warning.png";

// todo - implement useReducer()
// todo - implement <Context>, pass to services.ts
const DiffEntry = ({newItems, syncedItemsDiffentEntry, deletedItems}: 
    {newItems: any, syncedItemsDiffentEntry: any, deletedItems: any}):JSX.Element =>{

    // for editor state
    const [showEditor, setShowEditor] = useState(false);

    // for filename
    const [devFileName, setDevFileName] = useState<any>(null);
    const [prodFileName, setprodFileName] = useState<any>(null);

    // for entry editor
    const [devEntry, setDevEntry] = useState<any>(null);
    const [prodEntry, setprodEntry] = useState<any>(null);
    const [mount, setMount] = useState(false); // todo - make sure this works
    const editorRef = useRef(null);
    const handleEditorDidMount = (editor: any, monaco: any) => {
        console.log("DiffEntry handleEditorDidMount()");
        editorRef.current = editor;
        setMount(!mount);
    }
    const getJSONEditorValue = ():string => {
        // todo - fix this error
        return editorRef.current.getValue();
    }

    try{

        return (
            <div className = {styles.container}>
                {/* newItems */}
                {newItems.map((item: any) => 
                    <div className = {styles.entry_container} key = {item.FileName}>

                        <div className = {styles.file}>
                            <Image
                                src = {icon_file}
                                alt = "icon_file.png"
                                height = {45}
                            />
                            <p>{item.FileName}</p>
                        </div>

                    </div>
                )}
                {/* syncedItemsDiffentEntry */}
                {}
                {/* deletedItems */}
                {}

                {/* <DiffEditor
                    className = {styles.diffEditor}
                    height = "50%"
                    width = "100%"
                    theme = "light"
                    language = "json"
                                               // change this .parse() into another var
                    original = {JSON.stringify(JSON.parse(dev_obj_str[2].entry), null, 4)}
                    modified = {JSON.stringify(JSON.parse(prod_obj_str[2].entry), null, 4)}
                    onMount = {handleEditorDidMount}
                /> */}
            </div>
        );

    } catch(error) {
        console.log("ERROR: " + error);
        return <p>Error: {error?.message ?? JSON.stringify(error)}</p>
    }
}

export default DiffEntry;


// "use client";
// import React, { useRef, useState } from "react";
// import styles from "./diffEntry.module.css";
// import { DiffEditor } from "@monaco-editor/react";

// // todo - implement useReducer()
// // todo - implement <Context>, pass to services.ts
// const DiffEntry = ({dev_obj_str, prod_obj_str}: {dev_obj_str: any, prod_obj_str: any}):JSX.Element =>{

//     // for editor state
//     const [showEditor, setShowEditor] = useState(false);

//     // for filename
//     const [devFileName, setDevFileName] = useState<any>(null);
//     const [prodFileName, setprodFileName] = useState<any>(null);

//     // for entry editor
//     const [devEntry, setDevEntry] = useState<any>(null);
//     const [prodEntry, setprodEntry] = useState<any>(null);
//     const [mount, setMount] = useState(false); // todo - make sure this works
//     const editorRef = useRef(null);
//     const handleEditorDidMount = (editor: any, monaco: any) => {
//         console.log("DiffEntry handleEditorDidMount()");
//         editorRef.current = editor;
//         setMount(!mount);
//     }
//     const getJSONEditorValue = ():string => {
//         // todo - fix this error
//         return editorRef.current.getValue();
//     }

//     try{
//         console.log("dev_parsed_obj: \n" + dev_obj_str[2].entry);
//         console.log("prod_parsed_obj: \n" + prod_obj_str[2].entry);
//         return (
//             <div className = {styles.container}>

//                 <DiffEditor
//                     className = {styles.diffEditor}
//                     height = "50%"
//                     width = "100%"
//                     theme = "light"
//                     language = "json"
//                                                // change this .parse() into another var
//                     original = {JSON.stringify(JSON.parse(dev_obj_str[2].entry), null, 4)}
//                     modified = {JSON.stringify(JSON.parse(prod_obj_str[2].entry), null, 4)}
//                     onMount = {handleEditorDidMount}
//                 />
//             </div>
//         );

//     } catch(error) {
//         console.log("ERROR: " + error);
//         return <p>Error: {error?.message ?? JSON.stringify(error)}</p>
//     }
// }

// export default DiffEntry;
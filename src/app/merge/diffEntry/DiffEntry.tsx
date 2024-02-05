"use client";
import React, { useRef, useState } from "react";
import styles from "./diffEntry.module.css";
import Button from "../../../components/button/Button";

// services
import { Item, SyncedItem } from "@/app/merge/services";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import EntryCard from "@/components/entrycard/EntryCard";

const DiffEntry = ({item, item_type}: {item: Item | SyncedItem, item_type: string}):JSX.Element =>{

    // for entry editor
    const [fileName, setFileName] = useState<any>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [originalJSON, setOriginalJSON] = useState<string | null>(null);
    const [modifiedJSON, setModifiedJSON] = useState<string | null>(null);
    const handleCompare = (filename: string, original: string | null, modified: string | null) => {
        setFileName(filename);
        setOriginalJSON(original);
        setModifiedJSON(modified);
        setShowEditor(true);
    }

    try{
        return (
        <div className = {styles.container}>
            <EntryCard filename = {item.FileName} type = {item_type} buttons = {
                <Button text = "Compare" color = "blue" handleClick = {() => {
                        if(item_type == "new")
                            handleCompare(item.FileName, null, item.entry);
                        else if(item_type == "synced")
                            handleCompare(item.FileName, item.dev_entry, item.prod_entry);
                        else 
                            handleCompare(item.FileName, item.entry, null);
                    }
                }/>
            }/>
  
            {showEditor == true &&
                <div className = {styles.background_opacity}>
                <div className = {styles.editor_container}>

                    <div className = {styles.editor_text}> 
                        <p>Current file</p>
                    </div>

                    <div className = {styles.filename_textarea}>
                        <p>{fileName}</p>     
                    </div>

                    <div className = {styles.editor_text}>
                        <p>Note: The following changes will be merged into LIVE</p>
                    </div>

                    <div className = {styles.diff_container}>
                        <ReactDiffViewer 
                            compareMethod = {DiffMethod.WORDS}
                            splitView = {false}
                            oldValue = {originalJSON == null ? undefined : JSON.stringify(JSON.parse(originalJSON), null, 4)}
                            newValue = {modifiedJSON == null ? undefined : JSON.stringify(JSON.parse(modifiedJSON), null, 4)}
                        />
                    </div>

                    <div className = {styles.editor_footer}>
                        <Button text = "Close" color = "grey" handleClick = {() => { setShowEditor(false); }}/>
                    </div>

                </div>
                </div>
            }
        </div>
        );

    } catch(error) {
        console.log(" DiffEntry.tsx error: " + error);
        return <p>Error: {JSON.stringify(error)}</p>
    }
}

export default DiffEntry;
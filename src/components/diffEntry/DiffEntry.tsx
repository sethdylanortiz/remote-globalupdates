"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import styles from "./diffEntry.module.css";
import Button from "../button/Button";

// services
import { handleMerge } from "@/app/merge/services";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

// icons
import icon_file from "../../../public/icon_file.png";
import icon_plus from "../../../public/icon-plus.png"
import icon_minus from "../../../public/icon-minus.png"
import icon_warning from "../../../public/icon-warning.png";
import icon_checkmark from "../../../public/icon_checkmark.png";

// todo - implement <Context>, pass to services.ts, to <layout>
type Item = [{
    FileName: string,
    entry: string
}];

// todo - implement useReducer()
const DiffEntry = ({newItems, syncedItemsDiffentEntry, deletedItems}: 
{newItems: Item, syncedItemsDiffentEntry: any, deletedItems: Item}):JSX.Element =>{

    // for editor state
    const [showEditor, setShowEditor] = useState(false);

    // for merge confirmation state
    const [showConfimation, setShowConfirmation] = useState(false);
    const [showMergeSuccess, setShowMergeSuccess] = useState(false);

    // for filename
    const [fileName, setFileName] = useState<any>(null);

    // for entry editor
    const [originalJSON, setOriginalJSON] = useState<string | null>(null);
    const [modifiedJSON, setModifiedJSON] = useState<string | null>(null);
    const handleCompare = (filename: string, original: string | null, modified: string | null) => {
        setFileName(filename);
        setOriginalJSON(original);
        setModifiedJSON(modified);
        setShowEditor(true);
    }
    const handleCloseEditor = () => {
        setShowEditor(false);
        setFileName(null);
        setOriginalJSON(null);
        setModifiedJSON(null);
    }
    const handleMergeComplete = () => {
        handleCloseEditor();
        setShowConfirmation(false);
        setShowMergeSuccess(false);
    }

    try{

        return (
            <div className = {styles.container}>
                {/* newItems */}
                {newItems.map((item: any) =>
                    <div className = {styles.item_container} style = {{background: "#92DA63"}} key = {item.FileName}>

                        <div className = {styles.file}>
                            <Image
                                src = {icon_file}
                                alt = "icon_file.png"
                                height = {45}
                            />
                            <p>{item.FileName}</p>
                        </div>

                        <div className = {styles.button_container}>
                            <Button text = "Compare" color = "blue" 
                                handleClick = {() => {handleCompare(item.FileName, null, item.entry)}}/>
                            <Image
                                src = {icon_plus}
                                alt = "icon_plus.png"
                                height = {40}
                            />
                        </div>

                    </div>
                )}
                {/* syncedItemsDiffentEntry */}
                {syncedItemsDiffentEntry.map((item: any) =>
                    <div className = {styles.item_container} style = {{background: "#E6DD80"}} key = {item.FileName}>

                        <div className = {styles.file}>
                            <Image
                                src = {icon_file}
                                alt = "icon_file.png"
                                height = {45}
                            />
                            <p>{item.FileName}</p>
                        </div>

                        <div className = {styles.button_container}>
                            <Button text = "Compare" color = "blue" 
                                handleClick = {() => {
                                        {handleCompare(item.FileName, item.dev_entry, item.prod_entry)}
                                    }
                                }/>

                            <Image
                                src = {icon_warning}
                                alt = "icon_warning.png"
                                height = {40}
                            />
                        </div>

                    </div>
                )}
                {/* deletedItems */}
                {deletedItems.map((item: any) =>
                    <div className = {styles.item_container} style = {{background: "#E68080"}} key = {item.FileName}>

                        <div className = {styles.file}>
                            <Image
                                src = {icon_file}
                                alt = "icon_file.png"
                                height = {45}
                            />
                            <p>{item.FileName}</p>
                        </div>

                        <div className = {styles.button_container}>
                            <Button text = "Compare" color = "blue" 
                                handleClick = {() => {
                                        {handleCompare(item.FileName, item.entry, null)}
                                    }
                                }/>
                            <Image
                                src = {icon_minus}
                                alt = "icon_minus.png"
                                height = {40}
                            />
                        </div>

                    </div>
                )}

                {showEditor == true ?
                    <section className = {styles.editor_container}>

                        <div className = {styles.editor_text}> 
                            <p>Current file</p>
                        </div>

                        <textarea
                            className = {styles.filename_textarea} 
                            rows = {1}
                            placeholder = "Current item's FileName goes here"
                            readOnly = {true}
                            value = {fileName}
                        />

                        <div className = {styles.editor_text}>
                            <p>Note: The following changes will be applied to PRODUCTION</p>
                        </div>

                        <div className = {styles.diff_container}>
                            <ReactDiffViewer 
                                // styles = {{
                                //     line: {
                                //         fontSize: '16px',
                                //         height: '7px',
                                //     }
                                // }}
                                compareMethod = {DiffMethod.WORDS}
                                splitView = {false}
                                oldValue = {originalJSON == null ? undefined : JSON.stringify(JSON.parse(originalJSON), null, 4)}
                                newValue = {modifiedJSON == null ? undefined : JSON.stringify(JSON.parse(modifiedJSON), null, 4)}
                            />
                        </div>

                        <div className = {styles.editor_footer}> 
                        
                            <p className = {styles.editor_text}>Merge this change into production?</p>

                            <div className = {styles.editor_buttons_container}>
                                <Button text = "MERGE" color = "blue" handleClick = {() => {
                                        setShowConfirmation(true);
                                    }}/>
                                <Button text = "CLOSE" color = "grey" handleClick = {handleCloseEditor}/>
                            </div>

                        </div>

                        {showConfimation == true ? 
                            <div className = {styles.confirmation_container}  style = {{background: "#FFF38D"}}>

                                <p>Are you sure you want to merge this change into production?</p>
                                
                                <div className = {styles.confirmation_button_container}>
                                    <Button text = "MERGE" color = "blue" handleClick = {() => {
                                        handleMerge({filename: fileName, newJSON: modifiedJSON});
                                        // move to function, call await else, 404 redirect?
                                        setShowMergeSuccess(true);
                                        console.log("confirmation merge button clicked!");
                                    }}/>
            
                                    <Button text = "CANCEL" color = "red" handleClick = {() => {
                                        setShowConfirmation(false);
                                        console.log("cancel merge button clicked!");
                                    }}/>
                                </div>
                            </div>
                        
                        : null}

                        {showMergeSuccess == true ? 
                            <div className = {styles.confirmation_container}  style = {{background: "#C4FFB2"}}>
                                <p>Changes have successfully been merged into PRODUCTION</p>
                                <Image
                                    src = {icon_checkmark}
                                    alt = "icon_checkmark.png"
                                    height = {40}
                                />
                                <div className = {styles.confimration_success_footer}>
                                    <Button text = "CLOSE" color = "red" handleClick = {() => {
                                        handleMergeComplete();
                                    }}/>
                                </div>
                            </div>
                        : null}

                    </section>

                : null}

            </div>
        );

    } catch(error) {
        console.log("ERROR: " + error);
        return <p>Error: {error?.message ?? JSON.stringify(error)}</p>
    }
}

export default DiffEntry;
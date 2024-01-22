"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import styles from "./diffEntry.module.css";
import Button from "../button/Button";

// services
import { mergeAll } from "@/app/merge/services";
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
// todo - add "nothing to update :) - production db is up to date with dev" page if no items exist
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
                <div className = {styles.entries_footer}>
                    <Button text = "Merge all" color = "orange" handleClick = {() => {
                        setShowConfirmation(true);
                        // mergeAll({newItems, syncedItemsDiffentEntry, deletedItems});

                        // begin a loading state
                        console.log("merge changes button clicked!");
                    }} />
                </div>
                {/* todo - remove this ? */}
                {showConfimation == true && 
                    <div className = {styles.background_opacity}>
                        <div className = {styles.confirmation_container}  style = {{background: "#FFFFFF"}}>
                            <div className = {styles.confirmation_header}>
                                <p>Merge confirmation</p>
                            </div>
                            <div className = {styles.confirmation_body}>
                                <p>Are you sure you want to merge this change into production?</p>
                            </div>
                            <div className = {styles.confirmation_button_container}>
                                <Button text = "Merge" color = "orange" handleClick = {() => {
                                    mergeAll({newItems, syncedItemsDiffentEntry, deletedItems});
                                    setShowMergeSuccess(true);
                                    setShowConfirmation(false);
                                    console.log("confirmation merge button clicked!");
                                }}/>
                                <Button text = "Cancel" color = "grey" handleClick = {() => {
                                    setShowConfirmation(false);
                                    console.log("cancel merge button clicked!");
                                }}/>
                            </div>
                        </div>
                    </div>
                }
                {showMergeSuccess == true && 
                    <div className = {styles.background_opacity}>
                        <div className = {styles.confirmation_container}  style = {{background: "#def8d2", borderWidth: "4px", borderColor: "#65a657"}}>
                            <div className = {styles.confirmation_body}>
                                <Image
                                        src = {icon_checkmark}
                                        alt = "icon_checkmark.png"
                                        height = {40}
                                />
                                <p>Completed. Changes have successfully been merged into PRODUCTION</p>
                            </div>

                            <div className = {styles.confimration_success_footer}>
                                <Button text = "Close" color = "grey" handleClick = {() => {
                                    handleMergeComplete();
                                }}/>
                            </div>
                        </div>
                    </div>
                }
                {showEditor == true &&
                    <div className = {styles.background_opacity}>
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
                            <Button text = "Close" color = "grey" handleClick = {() => {
                                setShowEditor(false);
                            }}/>
                        </div>

                    </section>
                    </div>
                }

            </div>
        );

    } catch(error) {
        console.log("ERROR: " + error);
        return <p>Error: {error?.message ?? JSON.stringify(error)}</p>
    }
}

export default DiffEntry;
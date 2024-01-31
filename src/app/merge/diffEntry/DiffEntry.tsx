"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import styles from "./diffEntry.module.css";
import Button from "../../../components/button/Button";

// services
import { mergeAll, Item, Items, SyncedItem, SycnedItems } from "@/app/merge/services";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import Messagebox from "../../../components/messagebox/Messagebox";
import EntryCard from "@/components/entrycard/EntryCard";

// icons
import icon_checkmark from "../../../../public/icon_checkmark.png";

// todo - implement useReducer()
const DiffEntry = ({newItems, syncedItemsDiffentEntry, deletedItems}: 
{newItems: Items, syncedItemsDiffentEntry: SycnedItems, deletedItems: Items}):JSX.Element =>{

    // for editor state
    const [showEditor, setShowEditor] = useState(false);

    // for merge confirmation state
    const [successBox, showSuccessBox] = useState(false);
    const [confirmationBox, showConfirmationBox] = useState(false);

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
        showConfirmationBox(false);
        showSuccessBox(false);
    }

    try{
        return (
        <div className = {styles.container}>
            {/* newItems */}
            {newItems.map((item: Item) =>
                <EntryCard key = {item.FileName} filename = {item.FileName} type = "new" buttons = {
                    <Button text = "Compare" color = "blue" handleClick = {() => {
                            handleCompare(item.FileName, null, item.entry);
                        }
                    }/>
                }/>
            )}
            {/* syncedItemsDiffentEntry */}
            {syncedItemsDiffentEntry.map((item: SyncedItem) =>
                <EntryCard key = {item.FileName} filename = {item.FileName} type = "synced" buttons = {
                    <Button text = "Compare" color = "blue" handleClick = {() => {
                            handleCompare(item.FileName, item.dev_entry, item.prod_entry);
                        }
                    }/>
                }/>
            )}
            {/* deletedItems */}
            {deletedItems.map((item: Item) =>
                <EntryCard key = {item.FileName} filename = {item.FileName} type = "deleted" buttons = {
                    <Button text = "Compare" color = "blue" handleClick = {() => {
                            handleCompare(item.FileName, item.entry, null);
                        }
                    }/>
                }/>
            )}
            <div className = {styles.entries_footer}>
                <Button text = "Merge all" color = "orange" handleClick = {() => {
                    showConfirmationBox(true);
                    console.log("merge changes button clicked!");
                }} />
            </div>

            {/* statebox display */}
            {confirmationBox == true && 
                <Messagebox type = "confirmation" message = "Are you sure you want to merge this change into production?" buttons = {[
                        <Button text = "Merge" color = "orange" handleClick = {() => {
                            mergeAll({newItems, syncedItemsDiffentEntry, deletedItems});
                            showSuccessBox(true);
                            showConfirmationBox(false);
                            console.log("confirmation merge button clicked!");
                        }}/>,
                        <Button text = "Cancel" color = "grey" handleClick = {() => {
                            showConfirmationBox(false);
                            console.log("cancel merge button clicked!");
                        }}/>
                    ]}
                />
            }
            {successBox == true && 
                <Messagebox type = "success" message = {
                    <div className = {styles.merge_success_container}>
                        <Image
                            src = {icon_checkmark}
                            alt = "icon_checkmark.png"
                            height = {40}
                        />
                        <p>Completed. Changes have successfully been merged into PRODUCTION</p>
                    </div> }
                    buttons = {[
                        <Button text = "Close" color = "grey" handleClick = {() => {
                            handleMergeComplete();
                        }}/>
                    ]}
                />
            }
            
            {/* todo: move to another component */}
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
                        <p>Note: The following changes will be applied to PRODUCTION</p>
                    </div>

                    <div className = {styles.diff_container}>
                        <ReactDiffViewer 
                            styles = {{
                                
                            }}
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

                </div>
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
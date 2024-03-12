"use client";
import React, { useState } from "react";
import styles from "./folder.module.css";

// services
import Button from "@/components/button/Button";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

/*
todo:
- create merge all changes button
    - services.ts, update version number and data in db
    
- make <Folder/> global and modular

done:
- add green tabs (added to live)
- add red tabs (deleted from live)
- add yellow tabs
    - folderName renames
    - fileValue edits
*/

const getBackgroundColor = (type: string) => {
    switch(type)
    {
        case "Edited":
            return "#EEE987";
        case "Added":
            return "#B6EE9C";
        case "Deleted":
            return "#F09C9C";
        default:
            return "white";
    }
};

const Folder = ({tree}: {tree: any}) => {

    const [inspectFile, setInspectFile] = useState(false);
    const [expand, setExpand] = useState(false);
    const [fileValues, setFileValues] = useState({devFileValue: undefined, liveFileValue: undefined});

    const handleCompare = (e: any) => {
        // prevent button closing - click through
        e.stopPropagation();

        // check if difference type is 
        if(tree.difference == "Added")
        {
            setFileValues({
                devFileValue: tree.__value,
                liveFileValue: undefined
            });
        }
        else if(tree.difference == "Deleted")
        {
            setFileValues({
                devFileValue: undefined,
                liveFileValue: tree.__value
            });
        }
        else if (tree.difference == "Edited")
        {
            setFileValues({
                devFileValue: tree.__devFileValue,
                liveFileValue: tree.__value
            });
        }
        // no marks, no changes
        else
        {
            setFileValues({
                devFileValue: tree.__value,
                liveFileValue: tree.__value
            });
        }

        // display json editor with values
        setInspectFile(true);
    }

    const handleClose = (e: any) => {
        // prevent button closing - click through
        e.stopPropagation();

        // reset display values to save memory
        setFileValues({
            devFileValue: undefined,
            liveFileValue: undefined
        });

        // hide json editor with values
        setInspectFile(false);
    }

    if(tree.__isFolder == false)
    {
        return (
            <div className = {styles.file} style = {{background: getBackgroundColor(tree.difference)}}>
                <span>📄 {tree.name} </span>

                <div className = {styles.button_container}>
                    <Button text = "View" color = "blue" handleClick = {(e: any) => handleCompare(e)}/>
                </div>

                {inspectFile == true && (
                    <div className = {styles.background_opacity}>
                    <div className = {styles.editor_container}>

                        <div className = {styles.editor_text}> 
                            <span>Current file</span>
                        </div>

                        {/* for fileName difference display, also strike through on "Deleted" */}
                        <div className = {styles.filename_textarea}>
                            {(tree.__devFileName && tree.__devFileName !== tree.name && tree.difference !== "Added")  
                                || tree.difference == "Deleted" ?
                                <span><span style = {{textDecoration: "line-through"}}>{tree.name}</span> &nbsp; {tree.__devFileName}  </span>
                            : 
                                <span>{tree.name}</span>
                            }
                        </div>

                        <div className = {styles.editor_text}>
                            <p>Note: The following changes will be merged into LIVE</p>
                        </div>

                        <div className = {styles.diff_container}>
                            <ReactDiffViewer
                                compareMethod = {DiffMethod.WORDS}
                                splitView = {false}
                                oldValue = {JSON.stringify(fileValues.liveFileValue, null, 4)}
                                newValue = {JSON.stringify(fileValues.devFileValue, null, 4)}
                                showDiffOnly = {false}
                          />
                        </div>

                        <div className = {styles.editor_footer}>
                            <Button text = "Close" color = "grey" handleClick = {(e: any) => handleClose(e)}/>
                        </div>

                    </div>
                    </div>
                )}
            </div>
        )
    } //else
    return (
        <div className = {styles.container}>
            <div className = {styles.folder} onClick = {() => setExpand(!expand)} style = {{background: getBackgroundColor(tree.difference)}}>

                {tree.difference == "Edited" ?
                    <div>
                        {/* &nbsp; to apply space in <span> tag */}
                        <span>📁 <span style = {{textDecoration: "line-through"}}>{tree.__devFolderName}</span> &nbsp; {tree.name}  </span>
                    </div>
                :
                    <div>
                        <span>📁 {tree.name}</span> 
                    </div>
                }

            </div>

            <div style = {{display: expand ? "block" : "none", paddingLeft: 50}}>
                { 
                    tree.__items.map((item: any) => {
                        return <Folder tree = {item} />
                    })
                }
            </div>

        </div>
    )

};

export default Folder;
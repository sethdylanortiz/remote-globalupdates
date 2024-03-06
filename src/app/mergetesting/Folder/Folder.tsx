"use client";
import React, { useState } from "react";
import styles from "./folder.module.css";

// services
import Button from "@/components/button/Button";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

/*
todo:
- make <Folder/> global and modular
- add green tabs (added to live)
- add red tabs (deleted from live)
- add yellow tabs (edited live)

done:

*/

const Folder = ({devJSON, liveJSON}: {devJSON: any, liveJSON: any}) => {

    const [inspectFile, setInspectFile] = useState(false);
    const [expand, setExpand] = useState(false);

    if(liveJSON.__isFolder == false)
    {
        return (
            <div className = {styles.file}>
                <span>📄 {liveJSON.name} </span>

                <div className = {styles.button_container}>
                    <Button text = "View" color = "blue" handleClick = {(e: any) => {
                        e.stopPropagation();
                        
                        setInspectFile(true);
                    }}/>
                </div>

                {/* todo: add conditional operator; if differences, render compare, else showJSON */}
                {inspectFile == true && (
                    <ReactDiffViewer
                        compareMethod = {DiffMethod.WORDS}
                        splitView = {false}
                        // oldValue = {originalJSON == null ? undefined : JSON.stringify(JSON.parse(liveJSON), null, 4)}
                        // newValue = {modifiedJSON == null ? undefined : JSON.stringify(JSON.parse(devJSON), null, 4)}
                        oldValue = {JSON.stringify(JSON.parse(liveJSON), null, 4)}
                        newValue = {JSON.stringify(JSON.parse(devJSON), null, 4)}
                    />
                )}
            </div>
        )
    } //else
    return (
        <div className = {styles.container}>
            <div className = {styles.folder} onClick = {() => setExpand(!expand)}>

                    <div>
                        <span>📁 {liveJSON.name}</span> 

                    </div>

            </div>

            <div style = {{display: expand ? "block" : "none", paddingLeft: 50}}>


                { liveJSON.__items.map((item: any) => {
                        return <Folder devJSON = {devJSON} liveJSON = {item} />
                    })
                }
            </div>

        </div>
    )

};

export default Folder;
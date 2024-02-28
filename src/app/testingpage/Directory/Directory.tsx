"use client";
import React, { useState } from "react";
import styles from "./directory.module.css";

/*
todo: 
- new folder
- new file

- open <jsoneditor/> component on "edit" click
- deletion

*/
const Directory = ({json}: {json: any}) => {

    const [isExpanded, setIsExpanded] = useState(false);

    const handleNewItem = (type: string) => {

    }

    if(json.__value)
    {
        return (
            <div className = {styles.item}>
                <span>📄 {json.name}</span>
            </div>
        )
    }
    // else
    return (
        <div className = {styles.item}>

            <span onClick = {() => setIsExpanded(!isExpanded)}>📁 {json.name}</span>
            
            <div className = {styles.button_container}>
                <button className = {styles.button} onClick = {() => handleNewItem("folder")}>+ Folder</button>
                <button className = {styles.button} onClick = {() => handleNewItem("file")}>+ File</button>
            </div>
            {/* <span onClick = {() => setIsExpanded(!isExpanded)}>📁 {json.name}</span> */}
            {
                isExpanded && json.__items.map((item: any) => <Directory json = {item}/>) 
            }

        </div>
    )
    


};

export default Directory;
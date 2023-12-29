/* 
for buttons:
    if "save" button was not pressed
        - delete string json cache
        - close ui
    else
        - store/overwrite string json cache
        - write new json cache to aws database
        - close ui
*/
"use client";

import React, { useState, useRef } from "react";
import styles from "./JSONEditor.module.css";
import { Editor } from "@monaco-editor/react";
import Button from "../button/Button";

const sample = {
    "filename": "filename2", 
        "body": {
        "src": "Images/Sun2.png", 
        "name": "sun2",
        "hOffset": 200
    }
};

const saveJSON = (input: string) => {

    console.log("saveJSON(), input: \n" + input);
}

const JSONEditor = ({filename, entry}: {filename: any, entry: any}):JSX.Element => {

    console.log("inside JSONEditor()");
    console.log("JSONEditor.tsx FileName: " + JSON.stringify(filename));
    console.log("JSONEditor.tsx entry: " + JSON.stringify(entry));
    
    // try catch here
    // let form_entry = JSON.parse(entry);

    // save reference the the json editor
    const editorRef = useRef(null);
    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;

        getEditorValue();
    }
    const getEditorValue = () => {

        console.log("\n" + "editorRef.current.getValue(): \n" + editorRef.current.getValue());
    }

    return(
        <div className = {styles.editor_container}>

            <div className = {styles.filename_header}> 
                <p>Current file</p>
            </div>

            <textarea
                className = {styles.filename_textarea} 
                rows = {2}
                placeholder = {filename} // change to value, onChange = {handleChange}
            />

            <Editor
                className = {styles.editor}
                height = "75%"
                width = "90%"
                theme = "light"
                defaultLanguage = "json"
                defaultValue = {JSON.stringify(JSON.parse(entry), null, 4)} // test this with different inputs
                onMount = {handleEditorDidMount}
            />

            <div className = {styles.save_close_buttons}>
                <Button text = "SAVE" color = "blue" handleClick = {() => saveJSON("hi") }/>
                <Button text = "CLOSE" color = "grey" handleClick = {() => console.log("")}/>
            </div>

        </div>
    )

}

export default JSONEditor;
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

const JSONEditor = ({entry}: {entry: any}):JSX.Element => {

    // console.log("inside JSONEditor()");
    // console.log("JSONEditor.tsx entry: " + JSON.stringify(entry));
    // console.log("JSONEditor.tsx JSON.stringify(JSON.parse(entry), null, 4)): \n" + JSON.stringify(JSON.parse(entry), null, 4));

    // save reference the the json editor
    const editorRef = useRef(null);
    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;

        getEditorValue();
    }
    const getEditorValue = () => {

        console.log("\n" + "editorRef.current.getValue(): \n" + editorRef.current.getValue());
        // instead of printing, return or make call to aws
    }

    return(

        <Editor
            className = {styles.editor}
            height = "75%"
            width = "90%"
            theme = "light"
            defaultLanguage = "json"
            defaultValue = {JSON.stringify(JSON.parse(entry), null, 4)} // test this with different inputs
            onMount = {handleEditorDidMount}
        />

    )

}

export default JSONEditor;
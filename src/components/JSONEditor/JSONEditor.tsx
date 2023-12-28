"use client";

import React from "react";
import styles from "./JSONEditor.module.css";
import { Editor } from "@monaco-editor/react";
import Button from "../button/Button";


// pass in default value
const JSONEditor = () => {

    const sample = {
        "filename": "filename2", 
            "body": {
            "src": "Images/Sun2.png", 
            "name": "sun2",
            "hOffset": 200
        }
    }

    return(
        <div className = {styles.editor_container}>

            <Editor
                className = {styles.editor}
                height = "75%"
                width = "90%"
                theme = "light"
                defaultLanguage = "json"
                defaultValue = {JSON.stringify(sample, null, 4)}
            />
            <Button text = "Save changes"/>
        </div>
    )

}

export default JSONEditor;
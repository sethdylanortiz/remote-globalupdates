"use client";
import React, { useState, useRef } from "react";
import styles from "./Entry.module.css";
import Image from "next/image";
import Button from "../button/Button";
import { Editor } from "@monaco-editor/react";

// icons
import icon_file from "../../../public/icon_file.png";
import icon_trash from "../../../public/icon_delete.png";

const updateForm = async(curFileName: string, newFileName: string, curJSON: string, newJSON: string) => {
    console.log("updateForm(), SAVE button pressed");

    const [curFileName_trim, newFileName_trim] = [curFileName.trim(), newFileName.trim()];
    const [curJSON_trim, newJSON_trim] = [curJSON.replace(/\s/g,""), newJSON.replace(/\s/g,"")];

    if((curJSON_trim !== newJSON_trim) || (curFileName_trim !== newFileName_trim))
    {
        console.log("updateForm() change in JSON, curJSON_trim !== newJSON_trim");
        
        // update/create entry if differences are noticed
        const response_obj = await fetch("http://localhost:3000/api/updateEntry", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                newFileName: newFileName_trim,
                newJSON: newJSON_trim
            })
        });

        // delete old entry if new filename was set
        if(curFileName_trim !== newFileName_trim)
        {
            const response_obj = await fetch("http://localhost:3000/api/deleteEntry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fileNameToDelete: curFileName_trim
                })
            });
        }
    }
    else {
        console.log("updateForm() curJSON == newJSON, ignore call" + "\n\n" + 
                    "updateForm() curJSON_trim: \n" + curJSON_trim + "\n\n" + 
                    "updateForm() newJSON_trim: \n" + newJSON_trim);
    }
    // on success, return notification to overwrite/setState temp str?
    // this must be done since we wont re-call entire db like we do on initial page load
}

const Entry = ({obj_str}: {obj_str: string}):JSX.Element => {

    // todo - fix
    const [showEditor, setShowEditor] = useState(false);

    // for json <Editor/> component
    const [formJSON, setFormJSON] = useState("");
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;
        // getEditorValue();
    }
    const getJSONEditorValue = ():string => {
        return editorRef.current.getValue();
    }

    try {
        const parsed_obj = JSON.parse(obj_str);

        // for textarea filename
        const [newFileName, setNewFileName] = useState(parsed_obj.FileName);

        return(
            // to contain: file symbol, name, edit button on hover
            <div className = {styles.entry_container}>

                <div className = {styles.file}>

                    <Image
                        src = {icon_file}
                        alt = "icon_file.png"
                        width = {40}
                    />

                    <p>{parsed_obj.FileName}</p>
                </div>

                <div className = {styles.edit_trash_buttons}>

                    <Button text = "Edit" color = "blue" handleClick = {() => {
                        
                        console.log("EDIT button clicked");
                        setShowEditor(!showEditor);

                    }}/>

                    <div className = {styles.trash_button}>
                        <Image
                            src = {icon_trash}
                            alt = "icon_trash.png"
                            width = {30}
                        />
                    </div>
                </div>

                {/* only display json editor on click */}
                {/* move to component/function? */}
                {showEditor === true ? (
                    <div className = {styles.editor_container}>

                        <div className = {styles.filename_header}> 
                            <p>Current file</p>
                        </div>

                        <textarea
                            className = {styles.filename_textarea} 
                            rows = {2}
                            defaultValue = {parsed_obj.FileName}
                            onChange = {(event) => setNewFileName(event.target.value)}
                            placeholder = {parsed_obj.FileName} // change to value, onChange = {handleChange}
                        />

                        {/* <JSONEditor entry = {parsed_obj.entry}/> */}
                        <Editor
                            className = {styles.editor}
                            height = "75%"
                            width = "90%"
                            theme = "light"
                            defaultLanguage = "json"
                            defaultValue = {JSON.stringify(JSON.parse(parsed_obj.entry), null, 4)} // test this with different inputs
                            onMount = {handleEditorDidMount}
                        />

                        <div className = {styles.save_close_buttons}>
                            <Button text = "SAVE" color = "blue" handleClick = {() => updateForm(parsed_obj.FileName, newFileName, parsed_obj.entry, getJSONEditorValue()) }/>
                            <Button text = "CLOSE" color = "grey" handleClick = {() => {
                                
                                console.log("CLOSE button clicked");
                                setShowEditor(false);
                            }}/> 
                        </div>
                    </div>
                ): null }

            </div>
        );

    } catch(error) {
        console.log("ERROR: " + error);
        return <p>Error: {error?.message ?? JSON.stringify(error)}</p>
    }
}

export default Entry;
"use client";
import React, { useState, useRef } from "react";
import styles from "./entry.module.css";
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
        console.log("updateForm() curJSON == newJSON, curFileName == newFileName, ignore call" + "\n\n" + 
                    "updateForm() curJSON_trim: \n" + curJSON_trim + "\n\n" + 
                    "updateForm() newJSON_trim: \n" + newJSON_trim);
    }
    // on success, return notification to overwrite/setState temp str?
    // this must be done since we wont re-call entire db like we do on initial page load
}

// todo - after aws call/write - update, create new useState()/overwrite parsed_obj
const Entry = ({obj_str}: {obj_str: string}):JSX.Element => {

    // for editor state
    const [showEditor, setShowEditor] = useState(false);

    // for textarea filename
    const [filename, setFileName] = useState<any>(null);
    const [newFileName, setNewFileName] = useState<any>("");

    // for json <Editor/> component
    const [formJSON, setFormJSON] = useState<any>(null);
    const [mount, setMount] = useState(false); // todo - make sure this works
    const [objectIndex, setObjectIndex] = useState<any>(null); // todo - fix
    const editorRef = useRef(null);
    const handleEditorDidMount = (editor: any, monaco: any) => {
        console.log("formJSON handleEditorDidMount()");
        editorRef.current = editor;
        setMount(!mount);
        // getEditorValue();
    }
    const handleEditorUnmount = () => {
        console.log("formJSON handleEditorUnmount()");
        setMount(!mount);
        setFormJSON(null);
    }
    const getJSONEditorValue = ():string => {
        // todo - fix this error
        return editorRef.current.getValue();
    }

    try {
        const parsed_obj = JSON.parse(obj_str);

        return(
            <div className = {styles.container}>

                {parsed_obj.map((entry: any, index: number) => 
                    <div className = {styles.entry} key = {entry.FileName}>
                        <div className = {styles.file}>
                            <Image
                                src = {icon_file}
                                alt = "icon_file.png"
                                width = {40}
                            />
                            <p>{entry.FileName}</p>
                        </div>

                        <div className = {styles.meta_buttons}>
                            <Button text = "Edit" color = "blue" handleClick = {() => {
                                setObjectIndex(index);
                                console.log("index: " + index);
                                console.log("objectIndex: " + objectIndex);

                                console.log("Edit button clicked");
                                // todo - disable all other buttons
                                setFileName(entry.FileName);
                                setNewFileName(entry.FileName);
                                mount ? setFormJSON(getJSONEditorValue()): setFormJSON(entry.entry);
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
                    </div>
                )}

                {showEditor === true && (

                    <div className = {styles.editor_container}>

                        <div className = {styles.filename_header}> 
                            <p>Current file</p>
                        </div>

                        <textarea
                            className = {styles.filename_textarea} 
                            rows = {1}
                            defaultValue = {filename}
                            onChange = {(event) => setNewFileName(event.target.value)}
                            placeholder = {parsed_obj.FileName}
                        />

                        <Editor
                            className = {styles.editor}
                            height = "75%"
                            width = "90%"
                            theme = "light"
                            defaultLanguage = "json"
                            defaultValue = {JSON.stringify(JSON.parse(formJSON), null, 4)}
                            onMount = {handleEditorDidMount}
                        />

                        <div className = {styles.save_close_buttons}>
                            <Button text = "SAVE" color = "blue" handleClick = {() => updateForm(filename, newFileName, formJSON, getJSONEditorValue()) }/>
                            <Button text = "CLOSE" color = "grey" handleClick = {() => {
                                console.log("CLOSE button clicked");
        
                                // todo - fix this
                                console.log("parsed_obj[filename].entry: " + parsed_obj[objectIndex].entry);
                                handleEditorUnmount();
                                setNewFileName(null)
                                setShowEditor(!showEditor);
                            }}/> 
                        </div>

                    </div>
                )}

            </div>
        
        );
    } catch(error) {
        console.log("ERROR: " + error);
        return <p>Error: {error?.message ?? JSON.stringify(error)}</p>
    }
}

export default Entry;
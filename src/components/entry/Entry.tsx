"use client";
import React, { useState, useRef } from "react";
import styles from "./entry.module.css";
import Image from "next/image";

// icons
import icon_file from "../../../public/icon_file.png";

// services
import { updateForm, deleteItem, Item} from "../../app/items/services";
import { Editor } from "@monaco-editor/react";
import Button from "../button/Button";
import Messagebox from "../messagebox/Messagebox";

// todo - find a better way to handle so many useState(), add useReducer?
const Entry = ({dev_obj_str}: {dev_obj_str: string}):JSX.Element => {

    // for editor state
    const [showEditor, setShowEditor] = useState(false);

    // for handling form errors
    const [formError, setFormError] = useState("");
    const [errorBox, showErrorBox] = useState(false);
    const [successBox, showSuccessBox] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // for textarea filename
    const [filename, setFileName] = useState<any>(null);
    const [newFileName, setNewFileName] = useState<any>("");

    // for json <Editor/> component
    const [formJSON, setFormJSON] = useState<any>(null);
    const [mount, setMount] = useState(false); // todo - make sure this works
    const editorRef = useRef(null);
    const handleEditorDidMount = (editor: any, monaco: any) => {
        console.log("formJSON handleEditorDidMount()");
        editorRef.current = editor;
        setMount(true);
        // getEditorValue();
    }
    const handleEditorUnmount = () => {
        console.log("formJSON handleEditorUnmount()");
        setMount(false);
        setFormJSON(null);
    }
    const getJSONEditorValue = ():string => {
        // todo - fix this error
        return editorRef.current.getValue();
    }
    
    try {
        const parsed_obj = JSON.parse(dev_obj_str);

        const handleSave = () => {
            var inputHasError = false;
            
            // check if item already exists - if so, reject and render
            if(filename == "" && parsed_obj.some((item: Item) => item.FileName === newFileName)){
               setFormError(prev => prev + `Item with ${newFileName}'s Filename already exists.\n\n`);
               inputHasError = true;
            }
            
            // check if valid json
            const jsonEditorValue = getJSONEditorValue();
            const [curJSON_trim, newJSON_trim] = [jsonEditorValue.replace(/\s/g,""), formJSON.replace(/\s/g,"")];

            if(curJSON_trim == newJSON_trim && filename == newFileName){
                setFormError(prev => prev + "Please edit the current item before saving\n");
                inputHasError = true;
            }
            try{
                JSON.parse(jsonEditorValue);
            }catch(error){
                setFormError(prev => prev + error);
                inputHasError = true;
            }
    
            if(inputHasError){
                showErrorBox(true);
            }
            else{
                updateForm(filename, newFileName, formJSON, jsonEditorValue);
                setFileName(newFileName);
                setFormJSON(jsonEditorValue);
                showSuccessBox(true);
            }
        }
        return(
            <div className = {styles.container}>

                <div className = {styles.add_Item_container}>
                    <Button text = "+ New item" color = "green" handleClick = {() => {
                        
                        setFileName("");
                        mount ? setFormJSON(getJSONEditorValue()): setFormJSON("{}");
                        setShowEditor(true);
                    }}/>
                </div>

                {parsed_obj.map((item: any, index: number) => 
                    <div className = {styles.entry} key = {item.FileName}>
                        <div className = {styles.file}>
                            <Image
                                src = {icon_file}
                                alt = "icon_file.png"
                                width = {40}
                            />
                            <p>{item.FileName}</p>
                        </div>

                        <div className = {styles.meta_buttons}>
                            <Button text = "Edit" color = "blue" handleClick = {() => {
                                // todo - disable all other buttons
                                setFileName(item.FileName);
                                setNewFileName(item.FileName);
                                // mount ? setFormJSON(getJSONEditorValue()): setFormJSON(item.entry);
                                setFormJSON(item.entry);
                                setShowEditor(true);
                            }}/>
                            <Button text = "Delete" color = "red" handleClick = {() => {
                                setFileName(item.FileName);
                                setShowDeleteConfirm(true);
                            }}/>
                        </div>
                    </div>
                )}

                {/* move to another component? */}
                {showEditor === true && (
                    // move to another component
                    <div className = {styles.background_opacity}>
                    <form action = {handleSave} className = {styles.editor_container}>

                        <div className = {styles.filename_header}> 
                            <p>Current file</p>
                        </div>

                        <input
                            className = {styles.filename_textarea}
                            type = "text" 
                            defaultValue = {filename}
                            onChange = {(event) => setNewFileName(event.target.value)}
                            placeholder = "Enter Filename"
                            required
                            minLength = {3}
                        />

                        <Editor
                            className = {styles.editor}
                            height = {400}
                            width = "90%"
                            theme = "light"
                            defaultLanguage = "json"
                            defaultValue = {JSON.stringify(JSON.parse(formJSON), null, 4)}
                            onMount = {handleEditorDidMount}
                        />

                        <div className = {styles.save_close_buttons}>
                            <Button buttonType = "submit" text = "Save" color = "blue"/>
                            <Button text = "Close" color = "grey" handleClick = {() => {        
                                handleEditorUnmount();
                                setNewFileName(null);
                                setShowEditor(false);
                            }}/> 
                        </div>
                    </form>

                        {/* for form Error */}
                        {errorBox == true && (
                            <Messagebox type = "error" message = {formError} 
                                buttons = {[
                                    <Button text = "Dismiss" color = "grey" handleClick = {() => {
                                        setFormError("");
                                        showErrorBox(false);
                                    }}/>
                                ]}
                            />
                        )}
                        {successBox == true && (
                            <Messagebox type = "success" message = {`Success adding "${newFileName}" into Development database`} 
                                buttons = {[
                                    <Button text = "Dismiss" color = "grey" handleClick = {() => {
                                        // handleEditorUnmount();
                                        // setNewFileName(null);
                                        // setShowEditor(false);
                                        showSuccessBox(false);
                                    }}/>
                                ]}
                            />
                        )}
                        
                    </div>

                )}
                <div>
                    {showDeleteConfirm == true && (
                        <Messagebox type = "confirmation" message = "Are you sure you want to delete this Item from Development?" 
                            buttons = {[
                                <Button text = "Delete" color = "orange" handleClick = {() => {
                                    deleteItem(filename);
                                    setFileName(null);
                                    setShowDeleteConfirm(false);
                                    // render delete success box                                    
                                }}/>,
                                <Button text = "Close" color = "grey" handleClick = {() => {
                                    setFileName(null);
                                    setShowDeleteConfirm(false);
                                }}/>
                            ]}
                        />
                    )}

                </div>

            </div>
        
        );
    } catch(error) {
        console.log("ERROR: " + error);
        console.log("filename:              " + filename);
        console.log("newFileName:           " + newFileName);
        console.log("formJSON:              " + formJSON.length);
        console.log("getJSONEditorValue():  " + getJSONEditorValue().length);

        return <p>Error: {error?.message ?? JSON.stringify(error)}</p>
    }
}

export default Entry;
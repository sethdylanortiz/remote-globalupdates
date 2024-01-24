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

// todo - re-evaluate/check forms (!state) is working properly?
// todo - find a better way to handle so many useState()
// todo - add useReducer?
// todo - after aws call/write - update, create new useState()/overwrite parsed_obj
const Entry = ({dev_obj_str}: {dev_obj_str: string}):JSX.Element => {

    // for deletion
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // for editor state
    const [showEditor, setShowEditor] = useState(false);

    // for handling form errors
    const [formError, setFormError] = useState("");
    const [errorBox, showErrorBox] = useState(false);
    const [successBox, showSuccessBox] = useState(false);

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

    // todo - move somewhere else
    const handleDelete = () => {
        console.log("inside handleDelete()!");
        setShowDeleteConfirm(true);
    }

    try {
        const parsed_obj = JSON.parse(dev_obj_str);

        // todo - move somewhere else
        const handleSave = () => {
            var inputHasError = false;

            // check if item already exists - if so, reject and render
            if(parsed_obj.some((item: Item) => item.FileName === newFileName)){
               setFormError(prev => prev + `Item with ${newFileName}'s Filename already exists.\n\n`);
               inputHasError = true;
            }
            
            // check if valid json
            const jsonEditorValue = getJSONEditorValue();
            try{
                JSON.parse(jsonEditorValue);
            }catch(error){
                setFormError(prev => prev + error);
                inputHasError = true;
            }

            if(inputHasError){
                showErrorBox(!errorBox);
            }
            else{
                showSuccessBox(true);
                console.log("SUCCESS BOX!: " + successBox);
                updateForm(filename, newFileName, formJSON, getJSONEditorValue());
            }
        }

        return(
            <div className = {styles.container}>

                <div className = {styles.add_Item_container}>
                    <Button text = "+ New item" color = "green" handleClick = {() => {
                        
                        setFileName("");
                        mount ? setFormJSON(getJSONEditorValue()): setFormJSON("{}");
                        setShowEditor(!showEditor);
                    }}/>
                </div>

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
                            {/* to-do: pop up confirmation window */}
                            <Button text = "Delete" color = "red" handleClick = {() => {
                                setFileName(entry.FileName);
                                handleDelete();
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
                                console.log("CLOSE button clicked");
        
                                // todo - fix this
                                // console.log("parsed_obj[filename].entry: " + parsed_obj[objectIndex].entry);
                                handleEditorUnmount();
                                setNewFileName(null);
                                setShowEditor(!showEditor);
                            }}/> 
                        </div>
                    </form>

                        {/* for form Error */}
                        {errorBox == true && (
                            <div className = {styles.error_box_container}>
                                <p>{formError}</p>

                                <div>
                                    <Button text = "Dismiss" color = "grey" handleClick = {() => {
                                        // handleEditorUnmount();
                                        // setNewFileName(null);
                                        setFormError("");
                                        showErrorBox(!errorBox);
                                    }}/>
                                </div>
                            </div>
                        )}
                        {successBox == true && (
                            <div className = {styles.success_box_container}>
                                <p>Success adding {newFileName} into Development database</p>

                                <div>
                                    <Button text = "Dismiss" color = "grey" handleClick = {() => {
                                        handleEditorUnmount();
                                        setNewFileName(null);
                                        setShowEditor(!showEditor);
                                        showSuccessBox(false);
                                    }}/>
                                </div>
                            </div>
                        )}
                        
                    </div>

                )}
                <div>
                    {showDeleteConfirm == true && (
                        <div className = {styles.background_opacity}>
                        <div className = {styles.delete_confirmation_container}>

                            <p> Are you sure you want to delete this Item from Development? </p>
                            
                            <div className = {styles.footer_buttons_container}>
                                <Button text = "Delete" color = "orange" handleClick = {() => {
                                    deleteItem(filename);
                                    setFileName(null);
                                    setShowDeleteConfirm(false);
                                    // render delete success box                                    
                                }}/>
                                <Button text = "Close" color = "grey" handleClick = {() => {
                                    setFileName(null);
                                    setShowDeleteConfirm(false);
                                }}/>
                            </div>
                        </div>
                        </div>
                    )}

                </div>


                <div>
                    <Messagebox type = "success" message = "Success adding Item into Development"/>
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
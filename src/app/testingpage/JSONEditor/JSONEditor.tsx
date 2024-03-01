"use client";
import React, { useState, useRef } from 'react'
import styles from "./jsoneditor.module.css";

// services
import { Editor } from '@monaco-editor/react';
import Button from '@/components/button/Button';
import Messagebox from '@/components/messagebox/Messagebox';
import { ActionTypes } from '../Folder/Folder';
import { addDevelopmentJSON, editDevelopmentJSON } from '../services';

/*
todo:
    - add version calling and passing to dynamodb.js
    - add uuid()
    - add doesItemExist() ?
    - add onblur from content container
    - clean up states
    - clean up messagebox displays

done: 
    - add e.stopPropogation when jsonEditor click
*/
// export const JSONEditor = ({filename, json, hideEditor, action}: {filename: string, json: string, hideEditor: any, action: ActionTypes}):JSX.Element => {
export const JSONEditor = ({filename, json, parent, id, hideEditor, action}:
     {filename: string, json: string, parent?: string, id?: number, hideEditor: any, action: ActionTypes}):JSX.Element => {

    const [tempJSON, setTempJSON] = useState(json);
    const [tempFilename, setTempFilename] = useState(filename);
    const [newFilename, setNewFilename] = useState(filename);
    const [message, setMessage] = useState({type: "", value: ""});

    const editorRef = useRef(null);
    const handleEditorDidMount = (editor: any, monaco: any) => {
        console.log("insdie handleEditorDidMount()!");
        editorRef.current = editor; 
    }
    const handleEditorUnmount = () => {
        setTempJSON("");
        setTempFilename("");
        setNewFilename("");
        editorRef.current = null;

        // return to parent
        hideEditor(); 
    }

    const handleSave = async(e: any) => {
        console.log("inside handleSave!()");

        // if editor is not mounted, ignore request
        if(editorRef.current == null)
            return;

        console.log("made it 1");

        let formError = "";
        var curJSON_trim, newJSON_trim, curFilename_trim, newFilename_trim;

        try{
            // check if valid json
            [curJSON_trim, newJSON_trim] = [JSON.stringify(JSON.parse(tempJSON)), JSON.stringify(JSON.parse(editorRef.current.getValue()))];
            [curFilename_trim, newFilename_trim] = [tempFilename.trim(), newFilename.trim()];

            console.log("curJSON_trim: " + curJSON_trim); console.log("newJSON_trim: " + newJSON_trim);
            console.log("curFileName_trim: " + curFilename_trim); console.log("newFilename_trim: " + newFilename_trim);
            
            // todo: add does filename exist in current dir

            if(curJSON_trim == newJSON_trim && curFilename_trim == newFilename_trim)
                formError += "Please edit the current item before saving\n";

        }catch(error){
            formError += error;
        }


        if(formError != "")
        {
            console.log("formError: " + formError);
            setMessage({type: "error", value: formError});
        }
        else 
        {
            console.log("INSIDE ELSE!");
            if(action == "File new")
            {
                await addDevelopmentJSON({ 
                    parent: parent as string, // "as string" - to resolve "!" non-null assertion
                    newItemName: newFilename_trim as string,
                    newItemValue: newJSON_trim as string,
                    isFolder: false,
                });
            }
            else if (action == "File edit")
            {   
                await editDevelopmentJSON({
                    id: id as number,
                    newItemName: newFilename_trim as string,
                    newItemValue: newJSON_trim as string,
                });
            }

            // update states in case of user decides to make further edits on same json value
            setTempFilename(newFilename_trim as string);
            setTempJSON(newJSON_trim as string);

            setMessage({type: "success", value: `Success adding "${newFilename}" into Development database`});
        }

    }

    return (
        <div className = {styles.container} onClick = {(e: any) => e.stopPropagation()}>
            <div className = {styles.background_opacity}>
                <form action = {handleSave} className = {styles.editor_container}>
                    <div className = {styles.filename_header}> 
                        <p>Current file</p>
                    </div>

                    <input
                        type = "text" 
                        autoFocus
                        className = {styles.filename_textarea}
                        defaultValue = {tempFilename}
                        required = {true}
                        minLength = {3}
                        onChange = {(event) => setNewFilename(event.target.value)}
                        placeholder = "Enter Filename"
                    />

                    <Editor
                        className = {styles.editor}
                        height = {400}
                        width = "90%"
                        theme = "light"
                        defaultLanguage = "json"
                        defaultValue = {JSON.stringify(JSON.parse(tempJSON), null, 4)}
                        onMount = {handleEditorDidMount}
                    />
                    <div className = {styles.save_close_buttons}>
                        {/* <Button buttonType = "submit" text = "Save" color = "blue"/> */}
                        <Button text = "Save" color = "blue" handleClick = {(e: any) => handleSave(e)}/>
                        <Button text = "Close" color = "grey" handleClick = {() => {        
                            handleEditorUnmount();
                        }}/> 
                    </div>
                </form>
            </div>

            {message.type == "error" && 
                <Messagebox type = "error" message = {message.value} 
                    buttons = {[
                        <Button text = "Dismiss" color = "grey" handleClick = {() => { setMessage({type: "", value: ""}) }}/>
                    ]}
                />
            }
            {message.type == "success" && 
                <Messagebox type = "success" message = {message.value} 
                    buttons = {[
                        <Button text = "Dismiss" color = "grey" handleClick = {() => { setMessage({type: "", value: ""}) }}/>
                    ]}
                />
            }

        </div>
    )
};

export default JSONEditor;
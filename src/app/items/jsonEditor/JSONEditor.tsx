"use client";
import React, { useState, useRef } from 'react'
import styles from "./jsoneditor.module.css";

// services
import { Editor } from '@monaco-editor/react';
import Button from '@/components/button/Button';
import Messagebox from '@/components/messagebox/Messagebox';
import { doesItemExist, updateForm } from '../services';

// todo - add useReducer()
export const JSONEditor = ({filename, json, hideEditor}: {filename: string, json: string, hideEditor: any}):JSX.Element => {

    const [tempJSON, setTempJSON] = useState<null | string>(json);
    const [tempFilename, setTempFilename] = useState<null | string>(filename);
    const [newFilename, setNewFilename] = useState<null | string>(filename);
    const [mount, setMount] = useState(false);
    const [message, setMessage] = useState< null | string | "success">(null);

    const editorRef = useRef(null);
    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;
        setMount(true);
    }
    const handleEditorUnmount = () => {
        setTempJSON(null);
        setTempFilename(null);
        setNewFilename(null);
        editorRef.current = null;
        setMount(false);

        // return to parent
        hideEditor(); 
    }
    const getJSONEditorValue = ():string => {
        return editorRef.current.getValue();
    }

    const handleSave = async() => {
        
        if(!mount)
            return;

        let formError = "";
        const jsonEditorValue = getJSONEditorValue();

        var curJSON_trim, newJSON_trim, curFilename_trim, newFilename_trim;

        try{
            // check if valid json
            [curJSON_trim, newJSON_trim] = [JSON.stringify(JSON.parse(tempJSON)), JSON.stringify(JSON.parse(jsonEditorValue))];
            [curFilename_trim, newFilename_trim] = [tempFilename.trim(), newFilename.trim()];

            console.log("curJSON_trim: " + curJSON_trim);
            console.log("newJSON_trim: " + newJSON_trim);
    
            console.log("curFileName_trim: " + curFilename_trim);
            console.log("newFilename_trim: " + newFilename_trim);

            // check if item already exists - if so, reject and render
            if(curFilename_trim == "")
                if(await doesItemExist(newFilename))
                    formError += `Item with ${newFilename_trim}'s Filename already exists.\n\n`;
        
            if(curJSON_trim == newJSON_trim && curFilename_trim == newFilename_trim)
                formError += "Please edit the current item before saving\n";

        }catch(error){
            formError += error;
        }

        if(formError != ""){
            console.log("formError: " + formError);
            setMessage(formError);
        }else{
            await updateForm(curFilename_trim, newFilename_trim, curJSON_trim, newJSON_trim);    
            setTempFilename(newFilename_trim);
            setTempJSON(newJSON_trim);
            setMessage("success");
        }

    }

    return (
        <div className = {styles.container}>
            <div className = {styles.background_opacity}>
                <form action = {handleSave} className = {styles.editor_container}>
                    <div className = {styles.filename_header}> 
                        <p>Current file</p>
                    </div>

                    <input
                        className = {styles.filename_textarea}
                        type = "text" 
                        defaultValue = {tempFilename /* || "" */}
                        onChange = {(event) => setNewFilename(event.target.value)}
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
                        defaultValue = {JSON.stringify(JSON.parse(tempJSON), null, 4)}
                        onMount = {handleEditorDidMount}
                    />
                    <div className = {styles.save_close_buttons}>
                        <Button buttonType = "submit" text = "Save" color = "blue"/>
                        <Button text = "Close" color = "grey" handleClick = {() => {        
                            handleEditorUnmount();
                        }}/> 
                    </div>
                </form>
            </div>

            {message != null && message != "success" && 
                <Messagebox type = "error" message = {message} 
                    buttons = {[
                        <Button text = "Dismiss" color = "grey" handleClick = {() => {
                            setMessage(null); 
                        }}/>
                    ]}
                />
            }
            {message == "success" && 
                <Messagebox type = "success" message = {`Success adding "${newFilename}" into Development database`} 
                    buttons = {[
                        <Button text = "Dismiss" color = "grey" handleClick = {() => {
                            setMessage(null);
                        }}/>
                    ]}
                />
            }

        </div>
    )
};

export default JSONEditor;
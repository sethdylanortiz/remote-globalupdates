"use client";

import React, { useState, useRef } from "react";
import styles from "./Entry.module.css";
import Image from "next/image";
import Button from "../button/Button";

// import JSONEditor from "../JSONEditor/JSONEditor";
import { Editor } from "@monaco-editor/react";

// icons
import icon_file from "../../../public/icon_file.png";
import icon_trash from "../../../public/icon_delete.png";

// const updateForm = async({curFileName, newFileName, curJSON, newJSON} : {curFileName: string, newFileName: string, curJSON: string, newJSON: string}) => {
const updateForm = async(curFileName: string, newFileName: string, curJSON: string, newJSON: string) => {    
    console.log("updateForm(), SAVE button pressed");

    // if newFileName == "" or null
    // make aws call to create a new item with newFileName + newJSON
    // make aws call to remove curFileName
    const [curFileName_trim, newFileName_trim] = [curFileName.replace(/\s/g,""), newFileName.replace(/\s/g,"")];
    if(curFileName_trim !== newFileName_trim)
    {
        console.log("updateForm() change in filename, curFileName_trim != newFileName_trim");
        console.log("updateForm() curFileName_trim: " + curFileName_trim);
        console.log("updateForm() newFileName_trim: " + newFileName_trim);
    }
    else{
        console.log("updateForm() curJSON == newJSON, ignore call");
        console.log("updateForm() curFileName_trim: \n" + curFileName_trim);
        console.log("updateForm() newFileName_trim: \n" + newFileName_trim);
    }

    // if only newJSON is provided (no need to create a new entry/pk wasn't changed)
    // make aws call to update 'entry' for specific curFileName
    // make sure on get() call we format JSON.stringify(str, null , 4);
    const [curJSON_trim, newJSON_trim] = [curJSON.replace(/\s/g,""), newJSON.replace(/\s/g,"")];
    if(curJSON_trim !== newJSON_trim)
    {
        console.log("updateForm() change in JSON, curJSON_trim !== newJSON_trim");

        // const response_obj = await fetch("http://localhost:3000/api/udpateEntry", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: newJSON
        // });
        
        // console.log("Entry.tsx repsonse_obj: " + response_obj);
        // const {success}: any = await response_obj.json(); 
        // console.log("suceess?: " + success); // return this - true/false
    }
    else{
        console.log("updateForm() curJSON == newJSON, ignore call");
        console.log("updateForm() curJSON_trim: \n" + curJSON_trim);
        console.log("updateForm() newJSON_trim: \n" + newJSON_trim);
        return;
    }

    // on success, return notification to overwrite temp str?
}

const Entry = ({obj_str}: {obj_str: string}):JSX.Element => {

    // on "edit" button press, pass props: (filename & entry) and display JSONEditor component
    const [showEditor, setShowEditor] = useState(false);


    // for json <Editor/> component
    const [formJSON, setFormJSON] = useState("");
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;

        // getEditorValue();
    }
    const getJSONEditorValue = ():string => {

        // console.log("\n" + "editorRef.current.getValue(): \n" + editorRef.current.getValue());
        return editorRef.current.getValue();
        // instead of printing, return or make call to aws
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
                        alt = "file_icon.png"
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
                            alt = "icon_trash"
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
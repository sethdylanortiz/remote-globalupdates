"use client";

import React, { useState } from "react";
import styles from "./Entry.module.css";
import Image from "next/image";
import Button from "../button/Button";
import JSONEditor from "../JSONEditor/JSONEditor";

// icons
import icon_file from "../../../public/icon_file.png";
import icon_trash from "../../../public/icon_delete.png";

const updateForm = async({curFileName, newFileName, newJSON} : {curFileName: string, newFileName: string, newJSON: string}) => {

    // if newFileName == "" or null
    // make aws call to create a new item with newFileName + newJSON
    // make aws call to remove curFileName

    // if only newJSON is provided (no need to create a new entry/pk wasn't changed)
    // make aws call to update 'entry' for specific curFileName
    
    // on success, return notification to overwrite temp str?

}

const Entry = ({obj_str}: {obj_str: string}):JSX.Element => {

    // console.log("inside ENTRY()");
    // on "edit" button press, pass props: (filename & entry) and display JSONEditor component
    const [showEditor, setShowEditor] = useState(false);

    // to be updated on "SAVE" success - callback updateForm()
    const [formJSON, setFormJSON] = useState("");

    try {
        const parsed_obj = JSON.parse(obj_str);
        // console.log("Entry.tsx parsed_obj: " + parsed_obj);
        // console.log("Entry.tsx parsed_obj.FileName: " + parsed_obj.FileName);

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
                            placeholder = {parsed_obj.FileName} // change to value, onChange = {handleChange}
                        />

                        <JSONEditor entry = {parsed_obj.entry}/>

                        <div className = {styles.save_close_buttons}>
                            <Button text = "SAVE" color = "blue" handleClick = {() => console.log("") }/>
                            <Button text = "CLOSE" color = "grey" handleClick = {() => {
                                {/* add more, move to outside function */}
                                
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
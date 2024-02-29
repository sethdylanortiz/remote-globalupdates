"use client";
import React, { useState } from 'react'
import styles from "./folder.module.css";

// services
import Button from '@/components/button/Button';
import { updateDevelopmentJSONData } from '../services';

/*
todo:
- new file
- new folder

- edit file
- delete file
*/

const Folder = ({json} : {json: any}) => {

    const [expand, setExpand] = useState(false);
    const [isNewFolder, setIsNewFolder] = useState(false);
    const [inputText, setInputText] = useState("");

    const handleNewItem = (e: any, isFolder: boolean) => {
        e.stopPropagation();
        setExpand(true);

        if(isFolder == true)
        {
            setIsNewFolder(true);
        }
    }
    const addFolder = (e: any) => {
        // to prevent refresh after form submission
        e.preventDefault();

        // todo: add min characater count checking
        updateDevelopmentJSONData({parent: json.name, newItemName: inputText, isFolder: true});

        console.log("end of addFolder()");
    }

    if(json.__isFolder == false)
    {
        return (
            <span className = {styles.file}> 📄 {json.name} </span>
        )
    }
    // else
    return (
        <div>

            <div className = {styles.folder} onClick = {() => setExpand(!expand)}>
                <span>📁 {json.name}</span>

                <div className = {styles.button_container}>
                    {/* <button className = {styles.button} onClick = {(e) => handleNewItem(e, true)}>+ Folder</button> */}
                    <Button text = "+ Folder" color = "grey" handleClick = {(e: any) => handleNewItem(e, true)}/>
                    <Button text = "+ File" color = "grey" handleClick = {(e: any) => handleNewItem(e, false)}/>
                </div>
            </div>

            <div style = {{display: expand ? "block" : "none", paddingLeft: 50}}>

                {isNewFolder && (
                    <div className = {styles.new_folder}>

                        <form className = {styles.folder_input} onSubmit = {addFolder}>
                        {/* <div className = {styles.folder_input}> */}
                            <span>📁</span>
                            <input 
                                type = "text"
                                value = {inputText}
                                onChange = {(e) => setInputText(e.target.value)}
                                autoFocus
                            />
                            {/* <Button text = "Save" color = "blue" buttonType = "submit"/> */}
                            <Button text = "Save" color = "blue" handleClick = {(e: any) => addFolder(e)}/>
                            <Button text = "Cancel" color = "grey" handleClick = {() => setIsNewFolder(false)}/>
                        </form>
                        
                    </div>
                    )}



                {
                    json.__items.map((item: any) => {
                        return <Folder json = {item}/>
                    })
                }
            </div>

        </div>
    )
    
}

export default Folder;
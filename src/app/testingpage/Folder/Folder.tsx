"use client";
import React, { useState } from 'react'
import styles from "./folder.module.css";

// services
import Button from '@/components/button/Button';
import { updateDevelopmentJSON, deleteDevelopmentJSON } from '../services';

/*
todo:
    - new file

    - edit file
    - delete file

    - edit folder name
    - delete folder

completed: 
    - new folder

*/
const Folder = ({json} : {json: any}) => {

    const [expand, setExpand] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [newFolder, setNewFolder] = useState(false);
    const [inputText, setInputText] = useState("");

    const handleNewItem = (e: any, isFolder: boolean) => {
        // to prevent click-though "+ Folder / + File" buttons
        e.stopPropagation();

        isFolder ? setNewFolder(true) : setNewFolder(false);
        setExpand(true);
        setShowInput(true);
    }
    // todo: add min characater count checking
    const addItem = (e: any) => {
        // to prevent click-though "+ Folder / + File" buttons
        e.stopPropagation();
        // to prevent refresh after form submission
        e.preventDefault();

        // check request is new folder or file
        if(newFolder == true)
        {
            updateDevelopmentJSON({parent: json.name, newItemName: inputText, isFolder: true});
        }else
        {
            ;
        }
        
        // hide "+ Folder" the drop down menu
        setShowInput(false);
    }
    const deleteItem = (e: any) => {
        // to prevent click-though "+ Folder / + File" buttons
        e.stopPropagation();
        // to prevent refresh after form submission
        e.preventDefault();

        console.log("json.name: " + json.name);

        // remove item
        deleteDevelopmentJSON({id: json.__id});
    }

    if(json.__isFolder == false)
    {
        return (
            <div className = {styles.file}>
                <span>📄 {json.name} </span>

                <div className = {styles.button_container}>
                    <Button text = "Delete" color = "orange" handleClick = {(e: any) => deleteItem(e)}/>
                    <Button text = "Edit" color = "blue"/>
                </div>
            </div>
        )
    }
    // else
    return (
        <div className = {styles.container}>

            <div className = {styles.folder} onClick = {() => setExpand(!expand)}>
                <span>📁 {json.name}</span>

                <div className = {styles.button_container}>
                    <Button text = "Delete" color = "orange" handleClick = {(e: any) => deleteItem(e)}/>
                    
                    <Button text = "+ Folder" color = "grey" handleClick = {(e: any) => handleNewItem(e, true)}/>
                    <Button text = "+ File" color = "grey" handleClick = {(e: any) => handleNewItem(e, false)}/>
                </div>
            </div>

            <div style = {{display: expand ? "block" : "none", paddingLeft: 50}}>

                {showInput && (
                    <div className = {styles.new_folder}>

                        <form className = {styles.folder_input} onSubmit = {addItem}>
                            {newFolder ? <span>📁</span>:  <span>📄</span>}
                            <input 
                                type = "text"
                                value = {inputText}
                                onChange = {(e) => setInputText(e.target.value)}
                                autoFocus
                            />
                            <Button text = "Save" color = "blue" handleClick = {(e: any) => addItem(e)}/>
                            <Button text = "Cancel" color = "grey" handleClick = {() => setShowInput(false)}/>
                        </form>
                        
                    </div>
                )}

                {
                    json.__items.map((item: any) => {
                        return <Folder json = {item} key = {json.__id}/>
                    })
                }
            </div>

        </div>
    )
    
}

export default Folder;
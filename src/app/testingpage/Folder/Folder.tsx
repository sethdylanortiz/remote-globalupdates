"use client";
import React, { useState } from 'react'
import styles from "./folder.module.css";

// services
import Button from '@/components/button/Button';
import { updateDevelopmentJSON, deleteDevelopmentJSON, renameDevelopmentJSON } from '../services';

/*
todo:
    -  add min characater count checking for form inputs

    - new file

    - edit file

completed: 
    - delete file


    - new folder
    - edit folder name
    - delete folder

*/
const Folder = ({json} : {json: any}) => {

    const [expand, setExpand] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [newFolder, setNewFolder] = useState(false);
    const [inputText, setInputText] = useState("");
    const [showRenameFolder, setShowRenameFolder] = useState(false);

    const cancelInput = (e: any) => {
        // to prevent click-though "+ Folder / + File" buttons
        e.stopPropagation();
        // to prevent refresh after form submission
        e.preventDefault();

        setInputText("");
    }
    const handleNewItem = (e: any, isFolder: boolean) => {
        e.stopPropagation();

        isFolder ? setNewFolder(true) : setNewFolder(false);
        setExpand(true);
        setShowInput(true);
    }

    const addItem = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        // check request is new folder or file
        if(newFolder == true)
        {
            updateDevelopmentJSON({parent: json.name, newItemName: inputText, isFolder: true});
        }else
        {
            ;
        }
        
        setShowInput(false);
        setInputText("");
    }
    const deleteItem = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        // remove item
        deleteDevelopmentJSON({id: json.__id});
    }

    const handleRenameItem = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        setShowRenameFolder(true);
    }
    const renameFolder = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        // todo: make sure inputText.length > x

        // rename item
        renameDevelopmentJSON({id: json.__id, newname: inputText});

        setShowRenameFolder(false);
        setInputText("");
    }
    

    if(json.__isFolder == false)
    {
        return (
            <div className = {styles.file}>
                <span>📄 {json.name} </span>

                <div className = {styles.button_container}>
                    <Button text = "Edit" color = "blue"/>
                    <Button text = "Delete" color = "orange" handleClick = {(e: any) => deleteItem(e)}/>
                </div>
            </div>
        )
    }
    // else
    return (
        <div className = {styles.container}>

            <div className = {styles.folder} onClick = {() => setExpand(!expand)}>
                {showRenameFolder == false ? <span>📁 {json.name}</span> : 
                <form className = {styles.folder_rename}>
                    <span>📁</span>
                    <input
                        className = {styles.input}
                        required = {true}
                        autoFocus
                        type = "text"
                        placeholder = "New folder name"
                        onChange = {(e) => setInputText(e.target.value)}
                        minLength = {4}
                    /> 
                    {/* <div className = {styles.button_container}> */}
                        <Button text = "Save" buttonType = "submit" color = "blue" handleClick = {(e: any) => renameFolder(e)}/>
                        <Button text = "Cancel" color = "grey" handleClick = {(e: any) => {
                            cancelInput(e);
                            setShowRenameFolder(false);
                        }}/>
                    {/* </div> */}
                </form>
                }
                {/* <span>📁 {json.name}</span> */}

                <div className = {styles.button_container}>
                    <Button text = "+ Folder" color = "grey" handleClick = {(e: any) => handleNewItem(e, true)}/>
                    <Button text = "+ File" color = "grey" handleClick = {(e: any) => handleNewItem(e, false)}/>
                    <Button text = "Rename" color = "blue" handleClick = {(e: any) => handleRenameItem(e)}/>
                    <Button text = "Delete" color = "orange" handleClick = {(e: any) => deleteItem(e)}/>
                </div>
            </div>

            <div style = {{display: expand ? "block" : "none", paddingLeft: 50}}>

                {showInput && (
                    <div className = {styles.new_folder}>

                        <form className = {styles.folder_input} onSubmit = {addItem}>
                            {newFolder ? <span>📁</span>:  <span>📄</span>}
                            <input 
                                className = {styles.input}
                                required = {true}
                                autoFocus
                                type = "text"
                                placeholder = "New item name"
                                onChange = {(e) => setInputText(e.target.value)}
                            />
                            <Button text = "Save" color = "blue" handleClick = {(e: any) => addItem(e)}/>
                            <Button text = "Cancel" color = "grey" handleClick = {(e: any) => {
                                cancelInput(e);
                                setShowInput(false);
                            }}/>
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
"use client";
import React, { useState } from 'react'
import styles from "./folder.module.css";

// services
import Button from '@/components/button/Button';
import { addDevelopmentJSON, deleteDevelopmentJSON, editDevelopmentJSON } from '../services';
import JSONEditor from '@/app/items/JSONEditor/JSONEditor';

/*
todo:

done: 
    - new file
    - edit file

    - delete file 

    - new folder
    - edit folder name
    - delete folder

    - fix .map multiple __id occurance problem frontend [next.js problem]
    - add min characater count checking for form inputs
    - clean up <JSONEditor/>
*/
export type FileActionTypes = "File new" | "File edit" | "none";
export type FolderActionTypes = "Folder new" | "Folder rename" | "none";

const Folder = ({json} : {json: any}) => {

    // todo: make showinput(s) usestates into .types - except for expand
    const [fileAction, setFileAction] = useState<FileActionTypes>("none");
    const [folderAction, setFolderAction] = useState("none");

    const [inputText, setInputText] = useState("");
    const [expand, setExpand] = useState(false);

    const cancelInput = (e: any) => {
        // to prevent click-though "+ Folder / + File" buttons
        e.stopPropagation();
        // to prevent refresh after form submission
        e.preventDefault();

        setInputText("");
        setFolderAction("none");
    }
    const handleNewFolder = (e: any) => {
        e.stopPropagation();

        // expand display
        setExpand(true);

        setFolderAction("Folder new");
    }
    const addFolder = () => {
        // check request is new folder or file
        addDevelopmentJSON({parent: json.name, newItemName: inputText, newItemValue: "", isFolder: true});
        
        setInputText("");
        setFolderAction("none");
    }
    const handleNewFile = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        setFileAction("File new");
    }

    const deleteItem = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        // remove item
        deleteDevelopmentJSON({id: json.__id});
    }
    const handleRenameFolder = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        setFolderAction("Folder rename");
    }
    const renameFolder = () => {
        // rename item
        editDevelopmentJSON({id: json.__id, newItemName: inputText});

        setInputText("");
        setFolderAction("none");
    }


    if(json.__isFolder == false)
    {
        return (
            <div className = {styles.file}>
                <span>📄 {json.name} </span>

                <div className = {styles.button_container}>
                    <Button text = "Edit" color = "blue" handleClick = {(e: any) => {
                        e.stopPropagation();
                        
                        setFileAction("File edit");
                    }}/>
                    <Button text = "Delete" color = "orange" handleClick = {(e: any) => deleteItem(e)}/>
                </div>

                {fileAction == "File edit" && (
                    <JSONEditor 
                        filename = {json.name} 
                        json = {JSON.stringify(json.__value)}
                        id = {json.__id}
                        
                        hideEditor = {() => {
                            setFileAction("none");
                        }}
                        action = "File edit"
                    />
                )}
            </div>
        )
    }
    // else
    return (
        <div className = {styles.container}>

            <div className = {styles.folder} onClick = {() => setExpand(!expand)}>

                {folderAction != "Folder rename" && (
                    <div>
                        <span>📁 {json.name}</span> 

                        {fileAction == "File new" && (
                            <JSONEditor 
                                filename = ""
                                json = "{}"
                                parent = {json.name}

                                action = "File new"
                                hideEditor = {() => {
                                    setFileAction("none");
                                }}
                            />
                        )}
                    </div>
                )}
                {folderAction == "Folder rename" && (
                    <form className = {styles.folder_rename} action = {renameFolder}>
                        <span>📁</span>
                        <input
                            type = "text"
                            autoFocus
                            className = {styles.input}
                            required = {true}
                            minLength = {3}
                            placeholder = "Enter folder name"
                            onChange = {(e) => setInputText(e.target.value)}
                            onClick = {(e) => e.stopPropagation()}
                        /> 
                        <Button text = "Save" color = "blue" buttonType = "submit" handleClick = {(e: any) => e.stopPropagation() }/>
                        <Button text = "Cancel" color = "grey" handleClick = {(e: any) => cancelInput(e) }/>
                    </form>
                )}

                <div className = {styles.button_container}>
                    <Button text = "+ Folder" color = "grey" handleClick = {(e: any) => handleNewFolder(e)}/>
                    <Button text = "+ File" color = "grey" handleClick = {(e: any) => handleNewFile(e)}/>
                    <Button text = "Rename" color = "blue" handleClick = {(e: any) => handleRenameFolder(e)}/>
                    <Button text = "Delete" color = "orange" handleClick = {(e: any) => deleteItem(e)}/>
                </div>
            </div>

            <div style = {{display: expand ? "block" : "none", paddingLeft: 50}}>

                {folderAction == "Folder new" && (
                    <div className = {styles.new_folder}>
                        <form className = {styles.folder_input} action = {addFolder}>
                            <span>📁</span>
                            <input 
                                type = "text"
                                autoFocus
                                className = {styles.input}
                                required = {true}
                                minLength = {3}
                                placeholder = "Enter item name"
                                onChange = {(e) => setInputText(e.target.value)}
                                onClick = {(e) => e.stopPropagation()}
                            />
                            <Button text = "Save" color = "blue" buttonType = "submit" handleClick = {(e: any) => e.stopPropagation() }/>
                            <Button text = "Cancel" color = "grey" handleClick = {(e: any) => cancelInput(e)}/>
                        </form>
                    </div>
                )}

                { json.__items.map((item: any) => {
                        return <Folder json = {item} key = {json.__id}/>
                    })
                }
            </div>

        </div>
    )
    
}

export default Folder;
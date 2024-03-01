"use client";
import React, { useState } from 'react'
import styles from "./folder.module.css";

// services
import Button from '@/components/button/Button';
import { addDevelopmentJSON, deleteDevelopmentJSON, editDevelopmentJSON } from '../services';
import JSONEditor from '@/app/testingpage/JSONEditor/JSONEditor';

/*
todo:
    - clean up <JSONEditor/>

completed: 
    - new file
    - edit file

    - delete file 

    - new folder
    - edit folder name
    - delete folder

    - fix .map multiple __id occurance problem frontend [next.js problem]
    - add min characater count checking for form inputs
*/
export type ActionTypes = "File new" | "File edit" | "";

const Folder = ({json} : {json: any}) => {

    // todo: make showinput(s) usestates into .types - except for expand
    // const [isNewFile, setIsNewFile] = useState(false);
    const [fileAction, setFileAction] = useState<ActionTypes>("");

    const [inputText, setInputText] = useState("");
    const [expand, setExpand] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [showRenameFolder, setShowRenameFolder] = useState(false);
    // const [showJSONEditor, setJSONShowEditor] = useState(false);

    const cancelInput = (e: any) => {
        // to prevent click-though "+ Folder / + File" buttons
        e.stopPropagation();
        // to prevent refresh after form submission
        e.preventDefault();

        setInputText("");
    }
    const handleNewFolder = (e: any) => {
        e.stopPropagation();

        setExpand(true);
        setShowInput(true);
    }
    const addFolder = () => {

        // check request is new folder or file
        addDevelopmentJSON({parent: json.name, newItemName: inputText, newItemValue: "", isFolder: true});
        
        setShowInput(false);
        setInputText("");
    }
    const handleNewFile = (e: any) => {
        console.log("handleNewFile(), fileAction: " + fileAction);
        e.stopPropagation();
        // e.preventDefault();

        // setJSONShowEditor(true);
        setFileAction("File new");
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
    const renameFolder = () => {
        // rename item
        editDevelopmentJSON({id: json.__id, newItemName: inputText});

        setShowRenameFolder(false);
        setInputText("");
    }


    if(json.__isFolder == false)
    {
        return (
            <div className = {styles.file}>
                <span>📄 {json.name} </span>

                <div className = {styles.button_container}>
                    <Button text = "Edit" color = "blue" handleClick = {(e: any) => {
                        e.stopPropagation();

                        // setJSONShowEditor(true);
                        // setIsNewFile(false);
                        
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
                            setFileAction("");
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

                {showRenameFolder == false ? 
                    <div>
                        <span>📁 {json.name}</span> 

                        {fileAction == "File new" && (
                            <JSONEditor 
                                filename = ""
                                json = "{}"
                                parent = {json.name}

                                action = "File new"
                                hideEditor = {() => {
                                    setFileAction("");
                                }}
                            />
                        )}
                    </div>
                     :
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
                        {/* <Button text = "Save" buttonType = "submit" color = "blue" handleClick = {(e: any) => renameFolder(e)}/> */}
                        <Button text = "Save" color = "blue" buttonType = "submit" handleClick = {(e: any) => {
                            e.stopPropagation();
                        }}/>
                        <Button text = "Cancel" color = "grey" handleClick = {(e: any) => {
                            cancelInput(e);
                            setShowRenameFolder(false);
                        }}/>
                    </form>
                }

                <div className = {styles.button_container}>
                    <Button text = "+ Folder" color = "grey" handleClick = {(e: any) => handleNewFolder(e)}/>
                    <Button text = "+ File" color = "grey" handleClick = {(e: any) => handleNewFile(e)}/>
                    <Button text = "Rename" color = "blue" handleClick = {(e: any) => handleRenameItem(e)}/>
                    <Button text = "Delete" color = "orange" handleClick = {(e: any) => deleteItem(e)}/>
                </div>
            </div>

            <div style = {{display: expand ? "block" : "none", paddingLeft: 50}}>

                {showInput && (
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
                            <Button text = "Save" color = "blue" buttonType = "submit" handleClick = {(e: any) => {
                                e.stopPropagation();
                            }}/>
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
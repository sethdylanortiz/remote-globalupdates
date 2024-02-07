"use client";
import React, { useState } from "react";
import styles from "./entry.module.css";

// services
import { deleteItem, Item, getEntry } from "../services";
import Button from "../../../components/button/Button";
import Messagebox from "../../../components/messagebox/Messagebox";
import EntryCard from "@/components/entrycard/EntryCard";
import JSONEditor from "../jsonEditor/JSONEditor";

// todo - find a better way to handle so many useState(), add useReducer?
// check for memory leak on deleteItem()
const Entry = ({item}: {item: Item}):JSX.Element => {

    // for editor state
    const [showEditor, setShowEditor] = useState(false);
    const toggleShowEditor = () => {
        setShowEditor(false);
    }

    // for handling form errors
    const [successBox, showSuccessBox] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // for textarea filename
    const [filename, setFilename] = useState<null | string>(null);

    // for json <Editor/> component
    const [json, setJSON] = useState<null | string>(null);
    
    try {
        console.log("filename: " + filename);
        console.log("json: " + json);
        return(
            <div className = {styles.container}>

                <EntryCard filename = {item.Filename} type = "none" buttons = {[
                    <Button key = "Edit" text = "Edit" color = "blue" handleClick = {async() => {
                            // aws db call to get item.Filename's entry
                            setJSON(await getEntry(item.Filename));
                            setFilename(item.Filename);
                            setShowEditor(true);
                    }}/>,
                    <Button key = "Delete" text = "Delete" color = "red" handleClick = {() => {
                        setFilename(item.Filename);
                        setShowDeleteConfirm(true);
                    }}/>
                    ]}
                />

                {showEditor == true && 
                    <JSONEditor filename = {filename} json = {json} hideEditor = {toggleShowEditor}/>
                }
                
                {showDeleteConfirm == true && (
                    <div>
                        <Messagebox type = "confirmation" message = "Are you sure you want to delete this Item from Development?" 
                            buttons = {[
                                <Button text = "Delete" color = "orange" handleClick = {() => {
                                    deleteItem(filename);
                                    setFilename(null);
                                    setJSON(null);
                                    showSuccessBox(true);
                                }}/>,
                                <Button text = "Close" color = "grey" handleClick = {() => {
                                    setFilename(null);
                                    setJSON(null);
                                    setShowDeleteConfirm(false);
                                }}/>
                            ]}
                        />
                        {successBox == true && (
                            <Messagebox type = "success" message = {`Success deleting "${filename}" from Development database`} 
                                buttons = {[
                                    <Button text = "Dismiss" color = "grey" handleClick = {() => {
                                        setFilename(null);
                                        setJSON(null);
                                        showSuccessBox(false);
                                        setShowDeleteConfirm(false);
                                    }}/>
                                ]}
                            />
                        )}
                    </div>
                )}
            </div>
        
        );
    } catch(error) {
        console.log("filename:              " + filename);
        console.log("json:              " + json?.length);

        return <p>Error: {error?.message ?? JSON.stringify(error)}</p>
    }
}

export default Entry;
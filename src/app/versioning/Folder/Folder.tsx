"use client";
import React, { useState } from 'react'
import styles from "./folder.module.css";

// services
import Button from '@/components/button/Button';
import JSONEditor from '@/app/items/JSONEditor/JSONEditor';

const Folder = ({json}: {json: any}) => {

    const [expand, setExpand] = useState(false);
    const [showFile, setShowFile] = useState(false);

    if(json.__isFolder == false)
    {
        return (
            <div className = {styles.file}>
                <span>📄 {json.name} </span>

                <div className = {styles.button_container}>
                    <Button text = "View" color = "blue" handleClick = {(e: any) => {
                        e.stopPropagation();
                        setShowFile(true)
                    }}/>
                </div>

                {showFile == true && (
                    <JSONEditor 
                        filename = {json.name} 
                        json = {JSON.stringify(json.__value)}
                        id = {json.__id}
                        
                        hideEditor = {() => {
                            setShowFile(false);
                        }}

                        action = "none"
                    />
                )}
            </div>
        )

    }
    // else
    return (
        <div className = {styles.container}>

            <div className = {styles.folder} onClick = {() => setExpand(!expand)}>

                <span>📁 {json.name}</span> 

            </div>

            <div style = {{display: expand ? "block" : "none", paddingLeft: 50}}>

                { 
                    json.__items.map((item: any) => {
                        return <Folder json = {item} key = {json.__id}/>
                    })
                }

            </div>

        </div>
    )
}

export default Folder
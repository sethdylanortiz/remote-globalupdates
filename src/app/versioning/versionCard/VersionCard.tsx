"use client"
import React, { useState } from 'react'
import styles from "./versioncard.module.css";

// services
import Button from '@/components/button/Button';
import { Editor } from "@monaco-editor/react";

const VersionCard = ({version, item}: {version: string, item: string}):JSX.Element => {
    const [showItem, setShowItem] = useState(false);
    
    return (
        <div className = {styles.version_card_container}>

            <p>Version: {version}</p>

            <div className = {styles.button_container}>
                <Button text = "View" color = "blue" handleClick = {() => {
                    setShowItem(true);
                }}/>
            </div>
            
            {showItem == true && 
                <div className = {styles.background_opacity}>
                <div className = {styles.display_container}>

                    <div className = {styles.display_header}>
                        <p>Selected version: {version}</p>
                    </div>

                    <div className = {styles.display_item}>
                        <Editor
                            height = {400} // change to %
                            width = "90%"
                            theme = "light"
                            defaultLanguage = "json"
                            defaultValue = {JSON.stringify(JSON.parse(item), null, 4)}
                            // add setting to now allow change
                            // onMount = {handleEditorDidMount} // look into this
                        />
                    </div>

                    <div className = {styles.display_button_container}>
                        <Button text = "Revert?" color = "orange"/>
                        <Button text = "Close" color = "grey" handleClick = {() => {
                            setShowItem(false);
                        }}/>
                    </div>
                </div>
                </div>
            }

        </div>
    )
};

export default VersionCard;
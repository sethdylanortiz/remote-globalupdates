"use client";
import React, { useState } from 'react'
import styles from "./mergebutton.module.css";

// services
import Button from '@/components/button/Button';
import Messagebox from '@/components/messagebox/Messagebox';
import { mergeTree } from '../services';

const MergeButton = () => {

    const [showMergeConfirmation, setShowMergeConfirmation] = useState(false);

    const handleMerge = (e: any) => {
        // to prevent click-though "+ Folder / + File" buttons
        e.stopPropagation();

        // merge dev json into live database
        mergeTree();
    };

    return (
        <div className = {styles.container}>       
            <Button text = "Merge all" color = "orange" handleClick = {() => setShowMergeConfirmation(true)} />

            {showMergeConfirmation == true && (
                <Messagebox 
                    type = "confirmation"
                    message = "Are you sure you want to apply these changes into LIVE?" 
                    buttons = {[
                        <Button text = "Merge" color = "orange" handleClick = {(e: any) => handleMerge(e)}/>,
                        <Button text = "Close" color = "grey" handleClick = {() => setShowMergeConfirmation(false)}/>
                    ]}
                />
            )}

        </div>
    )
}

export default MergeButton;
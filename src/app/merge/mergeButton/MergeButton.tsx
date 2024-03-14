"use client";
import React, { useState } from 'react'
import styles from "./mergebutton.module.css";

// services
import Button from '@/components/button/Button';
import Messagebox from '@/components/messagebox/Messagebox';
import { mergeTree } from '../services';
import Loading from '@/components/loading/Loading';

const MergeButton = () => {

    const [showMergeConfirmation, setShowMergeConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleMerge = (e: any) => {
        // to prevent click-though "+ Folder / + File" buttons
        e.stopPropagation();

        // start loading... ui
        setIsLoading(true);

        // merge dev json into live database
        mergeTree();
    };

    return (
        <div className = {styles.container}>       
            <Button text = "Merge all" color = "orange" handleClick = {() => setShowMergeConfirmation(true)} />

            {showMergeConfirmation == true && (
                <div>

                    {isLoading === true && (
                        <Loading/>
                    )}

                    <Messagebox 
                        type = "confirmation"
                        message = "Are you sure you want to apply these changes into LIVE?" 
                        buttons = {[
                            <Button text = "Merge" color = "orange" handleClick = {(e: any) => handleMerge(e)}/>,
                            <Button text = "Close" color = "grey" handleClick = {() => setShowMergeConfirmation(false)}/>
                        ]}
                    />

                </div>
            )}

        </div>
    )
}

export default MergeButton;
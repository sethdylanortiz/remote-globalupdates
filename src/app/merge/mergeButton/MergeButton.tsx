"use client";
import React, { useState } from 'react'
import styles from "./mergebutton.module.css";
import Image from 'next/image';

// services
import Button from '@/components/button/Button';
import Messagebox from '@/components/messagebox/Messagebox';
import { Items, SyncedItems, mergeAll } from '../services';
import { updateDB } from '../services';


// icons
import icon_checkmark from "../../../../public/icon_checkmark.png";

const MergeButton = ({newItems, syncedItemsDiffentEntry, deletedItems, currentVersion}: 
    {newItems: Items, syncedItemsDiffentEntry: SyncedItems, deletedItems: Items, currentVersion: number}) => {


    const [showConfirmationBox, setShowConfirmationBox] = useState(false);
    const [showSuccessBox, setShowSuccessBox] = useState(false);

    return (
        <div>
            <div>
                <Button text = "Merge All" color = "orange" handleClick = {() => {
                    setShowConfirmationBox(true);
                }}/>
            </div>

            {showConfirmationBox == true && 
            <Messagebox type = "confirmation" message = "Are you sure you want to merge this change into production?" buttons = {[
                    <Button text = "Merge" color = "orange" handleClick = {() => {
                        mergeAll(newItems, syncedItemsDiffentEntry, deletedItems, currentVersion);
                        setShowSuccessBox(true);
                        setShowConfirmationBox(false);
                    }}/>,
                    <Button text = "Cancel" color = "grey" handleClick = {() => {
                        setShowConfirmationBox(false);
                    }}/>
                ]}
            />
            }

            {showSuccessBox == true && 
                <Messagebox type = "success" message = {
                    <div className = {styles.merge_success_container}>
                        <Image
                            src = {icon_checkmark}
                            alt = "icon_checkmark.png"
                            height = {40}
                        />
                        <p>Completed. Changes have successfully been merged into PRODUCTION</p>
                    </div> }
                    buttons = {[
                        <Button text = "Close" color = "grey" handleClick = {() => {
                            setShowConfirmationBox(false);
                            setShowSuccessBox(false);
                        }}/>
                    ]}
                />
            }

        </div>


    )
}

export default MergeButton;
"use client";
import React, { useState } from "react";
import styles from "./revertbutton.module.css";

// services
import Button from "@/components/button/Button";
import Messagebox from "@/components/messagebox/Messagebox";
import { revertVersion } from "../services";

const RevertButton = ({versionNumber}: {versionNumber: number}) => {

    const [revertConfirmation, showRevertConfirmation] = useState(false);

    return(
        <div className = {styles.revertButton}>

            <p>Revert back to this version?</p>

            <Button 
                text = "Revert" color = "orange" 
                handleClick = {() => {showRevertConfirmation(true)}}
            />

            { revertConfirmation == true && (
                <Messagebox 
                    type = "confirmation"
                    message = {`Are you sure you want to revert back to this version: ${versionNumber}`}
                    buttons = {[
                        <Button text = "Confirm" color = "orange"
                            handleClick = {() => {revertVersion(versionNumber)}}
                        />,
                        <Button text = "Cancel" color = "grey"
                            handleClick = {() => {showRevertConfirmation(false)}}
                        />
                    ]}
                />
            ) }

        </div>
    );

};

export default RevertButton;
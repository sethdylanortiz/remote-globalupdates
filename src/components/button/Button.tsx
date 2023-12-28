/* 
to-do: 
- configure to have various sizes depending on mobile devices
*/
"use client"

import React from "react";
import styles from "./Button.module.css";

// add href, logo if exists?, where to add onclick?
const Button = ({text}: {text: string}):JSX.Element => {

    return(
        <div className = {styles.button_container}>
            {text}
        </div>
    );

}

export default Button;
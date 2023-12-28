/* 
to-do: 
- configure to have various sizes depending on mobile devices
*/
"use client"

import React from "react";
import styles from "./Button.module.css";

const getColor = ({color}: {color: string}) => {

    switch(color)
    {
        case "blue":
            return "#5C84FF";
        case "grey":
            return "#DEDEDE";
        default:
            return "yellow";
    }
}

// add href, logo if exists?, where to add onclick?
const Button = ({text, color}: {text: string, color: string}):JSX.Element => {

    return(
        <div 
        className = {styles.button_container}
        style = {{
            backgroundColor: getColor({color})
        }}>
            {text}
        </div>
    );
}

export default Button;
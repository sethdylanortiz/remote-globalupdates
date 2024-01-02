/* 
to-do: 
- configure to have various sizes depending on mobile devices
*/
"use client"
import React from "react";
import styles from "./button.module.css";

const getColor = ({color}: {color: string}) => {

    switch(color)
    {
        case "blue":
            return "#5C84FF";
        case "grey":
            return "#DEDEDE";
        case "green":
            return "#2CB707";
        default:
            return "yellow";
    }
}

// add href, logo if exists?, where to add onclick?
const Button = ({text, color, handleClick}: {text: string, color: string, handleClick: any}):JSX.Element => {

    return(
        <button
        className = {styles.button_container}
        style = {{
            backgroundColor: getColor({color})
        }}
        onClick = {handleClick}
        >
            {text}
        </button>
    );
}

export default Button;
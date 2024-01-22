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
        case "red":
            return "#E34127";
        case "blue":
            return "#498cf5";
        case "grey":
            return "#DEDEDE";
        case "green":
            return "#2CB707";
        case "yellow":
            return "yellow";
        case "orange":
            return "#FB842D";
        default:
            return "white";
    }
}

// add href, logo if exists?, where to add onclick?
const Button = ({text, color, handleClick}: {text: string, color: string, handleClick?: any}):JSX.Element => {

    const background_color = getColor({color});
    const font_color = color == "blue" ? "white" : "black"; 

    return(
        <button
        className = {styles.button_container}
        style = {{
            // borderColor: "#2CB707",
            // borderWidth: "2px",
            backgroundColor: background_color,
            color: font_color
        }}
        onClick = {handleClick}
        >
            {text}
        </button>
    );
}

export default Button;
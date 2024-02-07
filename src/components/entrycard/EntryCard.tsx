"use client";
import React from 'react'
import styles from "./entrycard.module.css";
import Image from 'next/image';

// icons
import icon_file from "../../../public/icon_file.png"

const getBackgroundColor = (type: string):string => {
    switch(type){
        case "new":
            return "#B7F896"// return "#92DA63";
        case "synced":
            return "#E6DD80";
        case "deleted":
            return "#FE9B9B";
        case "none":
            return "white";
        default:
            return "white";
    };
}

const EntryCard = ({filename, type, buttons} : {filename: string, type: string, buttons: any}) => {
    return (
        <div className = {styles.container} style = {{background: getBackgroundColor(type) }}>

            <div className = {styles.file_filename}>
                <Image
                    src = {icon_file}
                    alt = "icon_file.png"
                    height = {45}
                />
                <p>{filename}</p>
            </div>

            <div className = {styles.button_container}>
                {buttons}
            </div>
            
        </div>
    )
}

export default EntryCard;
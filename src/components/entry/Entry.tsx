"use client";

import React from "react";
import styles from "./Entry.module.css";
import Image from "next/image";

// refs
import Buttons from "./Buttons";
import Button from "../button/Button";

// icons
import icon_file from "../../../public/icon_file.png";
import icon_trash from "../../../public/icon_delete.png";

// jsx object/element that handles entry row on page
// onclick - opens up new panel to edit json
// const Entry = ({a_str, b_str}: {a_str: string, b_str: string}):JSX.Element => {

const Entry = ({obj_str}: {obj_str: string}):JSX.Element => {

    try {
        console.log("-------------------");
        const parsed_obj = JSON.parse(obj_str);
        console.log("obj_str: " + obj_str);
        console.log("parsed_obj: " + parsed_obj);
        console.log("parsed_obj.filename: " + parsed_obj.filename);

        return(
            // to contain: file symbol, name, edit button on hover
            <div className = {styles.entry_container}>

                <div className = {styles.file}>

                    <Image
                        src = {icon_file}
                        alt = "file_icon.png"
                        width = {40}
                    />

                    <p>{parsed_obj.filename}</p>
                </div>

                <div className = {styles.edit_trash_buttons}>

                    <Button text = "Edit" color = "blue"/>

                    <div className = {styles.trash_button}>
                        <Image
                            src = {icon_trash}
                            alt = "icon_trash"
                            width = {30}
                        />
                    </div>
                </div>

            </div>
            // end - {entry.metadata}

        );

    } catch(error) {
        console.log("ERROR");
        return <p>Error: {error?.message ?? JSON.stringify(error)}</p>
    }
}

export default Entry;
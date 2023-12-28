// necessary? since this will be a child/called from another client component
// move into seperate component so any other can call/use - create dynamic button
"use client";

import React, { Fragment, useState } from "react";
import styles from "./EditJSONButton.module.css";
import Image from "next/image";

// icons
import icon_trash from "../../../public/icon_delete.png";

// icons: https://www.iconpacks.net/free-icon/empty-paper-black-outline-19837.html
// isShown on hover: https://upmostly.com/tutorials/react-onhover-event-handling-with-examples
const EditJSONButton = ():JSX.Element => {

    return(
        <div className = {styles.button_container} >

            <div className = {styles.edit_button}>
                <p>Edit</p>
            </div>

            <div className = {styles.trash_button}>
                <Image
                    src = {icon_trash}
                    alt = "icon_trash"
                    width = {30}
                />
            </div>
        </div>

    );
}

export default EditJSONButton;
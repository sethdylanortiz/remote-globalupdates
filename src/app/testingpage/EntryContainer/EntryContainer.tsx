"use client";
import React, { useState } from 'react'
import styles from "./entrycontainer.module.css";

// services
import Folder from '../Folder/Folder';


const EntryContainer = ({explorerData}: {explorerData: any}) => {

    const [JSONdata, setJSONData] = useState(explorerData);

    return (
        <div className = {styles.entry_container}>
            
            <Folder json = {JSONdata}/>

        </div>
    )
};

export default EntryContainer;
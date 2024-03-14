"use server";

import React from "react";
import styles from "./mergepage.module.css";

// services
import Folder from "./Folder/Folder";
import MergeButton from "./MergeButton/MergeButton";
import { compareTrees } from "./services";
import Link from "next/link";
import { getVersion } from "../global_services/globalservices";

/*
todo:
- add suspense

done:
- aws call in services for current Live version
- aws call in services for current development version
- comparsion and folder display
- add merge button
- add no change display

*/

const MergePage = async() => {
    
    const mergeJSON = await compareTrees();
    // console.log("$ mergeJSON: "); console.log(JSON.stringify(mergeJSON, null, 4));
    const currentLiveVersion = await getVersion();

    return (
        <div>

            <div className = {styles.versionContainer}>
                <span>Current live version: <span style = {{fontWeight: "bold"}}>{currentLiveVersion}</span></span>
            </div>

            {mergeJSON === -1 ? 
                <div className = {styles.message}>

                    <span>There are no current changes made to the Development configuration</span>
                    <br/>
                    <span>Navigate to the <Link href = "/items" className = {styles.link}> Development</Link> to start editing</span>
                
                </div>
                :
                <div className = {styles.container}>

                    <Folder tree = {mergeJSON}/>
                    <MergeButton/>

                </div>
            }
        </div>
    )

}

export default MergePage;  
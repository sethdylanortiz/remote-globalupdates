import React from "react";
import styles from "./page.module.css";

const MergePage = async() => {

    // todo - implement cache search before making another aws call
    // aws call dev database
    // aws call live database
    // add logic to compare, list compare entries
    // onclick of entries, opens comparison json
        // merge
            // update entry in db 'version' - for polling
    // if no changes, dsplay - all entrys are up to date

    return(
        <div className = {styles.container}>
            
        </div>
    );
}

export default MergePage;
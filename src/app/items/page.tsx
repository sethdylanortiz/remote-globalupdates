import React from "react";
import styles from "./itemspage.module.css";
import Entry from "@/components/entry/Entry"; 
// todo - <Add/New> Entry button functionality:
import Button from "@/components/button/Button";

// services
import { getDevelopmentItems } from "./services";

/* 
to-do:
    - fetch aws by chunks of 5 entries, getting filenames and their strings/values
    - cache?
    - implement redirect(/all items)
    - add useReducer
*/
const ItemsPage = async() => {

    // on page load
    const developmentDB_response = await getDevelopmentItems();
    const {entries_dev_obj}: any = await developmentDB_response.json();
    console.log("ItemsPage.tsx, entries_dev_obj: ");
    console.log(entries_dev_obj);

    return(
        // to-do: move styles.container into globals.css
        <div className = {styles.container}>
            
            <div className = {styles.header_section}>
                <p>Development configuration - all items</p>
            </div>

            <div className = {styles.items_container}>

                {/* pass all items */}
                <Entry
                    dev_obj_str = {JSON.stringify(entries_dev_obj.Items)}
                />

            </div>

        </div>
    )
}

export default ItemsPage;
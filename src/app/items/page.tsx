import React from "react";
import styles from "./itemspage.module.css";
import Entry from "@/app/items/entry/Entry"; 
import { Suspense } from 'react'

// services
import { getDevelopmentItems } from "./services";

/* 
to-do:
    - fetch aws by chunks of 5 entries, getting filenames and their strings/values
    - cache?
    - add useReducer
    - CHANGE - to map over aws call and create an invidual entry -> don't send entire string to <entry>
    - add <suspense>
*/
const ItemsPage = async() => {
    // on page load
    const {entries_dev_obj} = await getDevelopmentItems();
    // console.log("ItemsPage.tsx, entries_dev_obj: "); console.log(entries_dev_obj);

    return(
        // to-do: move styles.container into globals.css
        <div className = {styles.container}>
            
            <div className = {styles.header_section}>
                <p>Development configuration - all items</p>
            </div>

            <div className = {styles.items_container}>

                {/* pass all items */}
                <Suspense fallback = {<p>Loading...</p>}>
                    <Entry
                        dev_obj_str = {JSON.stringify(entries_dev_obj.Items)}
                    />
                </Suspense>

            </div>

        </div>
    )
}

export default ItemsPage;
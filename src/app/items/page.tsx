import React from "react";
import styles from "./itemspage.module.css";
import { Suspense } from 'react'

// services
import { getDevelopmentFilenames } from "./services";
import Entry from "@/app/items/entry/Entry"; 
import AddItem from "./addItem/AddItem";
/* 
to-do:
    - fetch aws by chunks of 5 entries, getting filenames and their strings/values
    - cache?
    - add useReducer
    - update <suspense>
*/
const ItemsPage = async() => {

    const dev_filenames = await getDevelopmentFilenames();

    return(
        // to-do: move styles.container into globals.css
        <div className = {styles.container}>
            
            <div className = {styles.header_section}>
                <p>Development configuration - all items</p>
            </div>

            <div className = {styles.add_Item_container}>
                <AddItem/>
            </div>

            <div className = {styles.items_container}>
                <Suspense fallback = {<p>Loading...</p>}>
                    {dev_filenames?.map((item: any) => 
                        <Entry item = {item} key = {item.Filename} />
                    )}
                </Suspense>
            </div>

            {dev_filenames == null && 
                <div className = {styles.no_items_db}> 
                    <p>Looks like the development database is empty...</p>
                    <p>Add a new item to begin a new entry</p>
                </div>
            }

        </div>
    )
}

export default ItemsPage;
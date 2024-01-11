/* 
key: filename, value: string object

to-do:
- fetch aws by chunks of 5 entries, getting filenames and their strings/values
- cache?
- onclick, open cached filename's values - formatted json ready for edit + json schema checking
- on change submit - push to dev database and overwrite cache
- implement redirect(/all items)
- on merge tab, show all changes from current dev version agaisnt production version
*/
import React from "react";
import styles from "./page.module.css";
import fetch from "node-fetch";
import Entry from "@/components/entry/Entry"; 
// todo - add functionality:
import Button from "@/components/button/Button";

// add useReducer https://www.youtube.com/watch?v=RZPAQV7JvNU&ab_channel=LamaDev
const ItemsPage = async() => {

    // look into caching this - uncheck web browser 'disable' cache?
    const getEntryData = async() => {
        // add try-catch
        const response_obj = await fetch("http://localhost:3000/api/getEntries", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
        });
        return response_obj;
    }

    // on page load
    const testing_ret_obj = await getEntryData();
    const {entries_dev_obj}: any = await testing_ret_obj.json();

    return(
        // to-do: move styles.container into globals.css
        <div className = {styles.container}>
            
            <p className = {styles.instruction}>Development configuration - all items</p>

            <div className = {styles.items_container}>

                {/* pass all items */}
                <Entry
                    obj_str = {JSON.stringify(entries_dev_obj.Items)}
                />

            </div>

        </div>
    )
}

export default ItemsPage;
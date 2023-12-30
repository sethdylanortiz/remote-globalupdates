/* 
key: filename, value: string object

to-do:
- fetch aws by chunks of 5 entries, getting filenames and their strings/values
- cache?
- onclick, open cached filename's values - formatted json ready for edit + json schema checking
- on change submit - push to dev database and overwrite cache
- on merge tab, show all changes from current dev version agaisnt production version
*/

import React from "react";
import styles from "./page.module.css";

import Entry from "@/components/entry/Entry"; 
import JSONEditor from "@/components/JSONEditor/JSONEditor";

// database calling
import fetch from 'node-fetch';

// sample data - todo: pull from aws and load
const items = [
    {
        "filename": "filasdaename1", 
            "body": JSON.stringify({
            "src": "Images/Sun1.png", 
            "name": "sun1",
            "hOffset": 100
        })
    },
    {
        "filename": "123456789012345678901234567890", 
            "body": JSON.stringify({
            "src": "Images/Sun2.png", 
            "name": "sun2",
            "hOffset": 200
        })
    }
];

const ItemsPage = async() => {

    const getEntryData = async() => {
    
        // add try-catch
        const response_obj = await fetch("http://localhost:3000/api/getEntries", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
        });

        // console.log("\n" + "page.tsx getEntryData() response_obj: " + response_obj);
        // add to set vars - global
        return response_obj;
    }

    // on page load
    const testing_ret_obj = await getEntryData();
    const {entries_obj}: any = await testing_ret_obj.json();
    // console.log("page.tsx testing_ret_obj: " + entries_obj);
    
    // console.log("page.tsx entries_obj.Items[0].entry: \n" + entries_obj.Items[0].entry);

    return(
        // to-do: move styles.container into globals.css
        <div className = {styles.container}>
            <p>All Items</p>
            <div className = {styles.items_container}>

                {entries_obj.Items.map((item: any) => 

                        // console.log("\n" + "page.tsx Items.map(), item.FileName: "+ item.FileName);
                        // console.log("page.tsx Items.map(), item.entry: \n" + item.entry);
                        // console.log("page.tsx Items.map(), JSON.stringify(item): \n" + JSON.stringify(item));
                        <Entry
                            key = {item.FileName}
                            obj_str = {JSON.stringify(item)}
                        />
                )}
        
            </div>

        </div>
    )
}

export default ItemsPage;
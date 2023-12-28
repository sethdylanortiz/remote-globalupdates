import React from "react";
import styles from "./items-page.module.css";
import Link from "next/link";

import Entry from "@/components/entry/Entry"; 

/* 
key: filename, value: string object

to-do:
- fetch aws by chunks of 5 entries, getting filenames and their strings/values
- cache?
- onclick, open cached filename's values - formatted json ready for edit + json schema checking
- on change submit - push to dev database and overwrite cache
- on merge tab, show all changes from current dev version agaisnt production version
*/

// sample data - todo: pull from aws and load
const items = [
    {
        "filename": "filename1", 
            "body": JSON.stringify({
            "src": "Images/Sun1.png", 
            "name": "sun1",
            "hOffset": 100
        })
    },
    {
        "filename": "filename2", 
            "body": JSON.stringify({
            "src": "Images/Sun2.png", 
            "name": "sun2",
            "hOffset": 200
        })
    },
    {
        "filename": "filename3", 
            "body": JSON.stringify({
            "src": "Images/Sun3.png", 
            "name": "sun3",
            "hOffset": 300
        })
    }
];

const ItemsPage = () => {

    console.log("\n" + "items[1].filename: " + items[1].filename);
    console.log("typeof items[1].filename: " + typeof(items[1].filename));

    const test_str = JSON.stringify(items[1].filename);
    console.log("\n" + "test_str: " + test_str);
    console.log("typeof test_str: " + typeof(test_str));

    const test_obj = JSON.stringify(items[1]);
    console.log("\n" + "test_obj: " + test_obj);
    console.log("typeof test_obj: " + typeof(test_obj));

    return(
        // to-do: move styles.container into globals.css
        <div className = {styles.container}>
            <p>All Items</p>
            <div className = {styles.items_container}>

                {items.map(item => 
                    <Entry
                        key = {item.filename}
                        obj_str = {JSON.stringify(item)}
                    />
                )}

            </div>
        </div>
    );
}

export default ItemsPage;
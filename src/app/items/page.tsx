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
import styles from "./items-page.module.css";

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


        console.log("\n" + "page.tsx getEntryData() response_obj: " + response_obj);
        return response_obj;
        // add to set vars - global
    }

    // on page load
    const testing_ret_obj = await getEntryData();
    const {entries_obj}: any = await testing_ret_obj.json();

    // console.log(entries_obj.Items);
    // console.log("page.tsx entries_obj.Items[0].entry: \n" + entries_obj.Items[0].entry);
    // console.log("page.tsx entries_obj.Items[1].entry: \n" + entries_obj.Items[1].entry);
    // console.log("page.tsx entries_obj.Items[2].entry: \n" + entries_obj.Items[2].entry);
    

    // method 2 - 

    // method 1 - parse then stringify
    // console.log("\n\n---------------------");
    // let items_0 = entries_obj.Items[2].entry;
    // console.log(items_0);
    // items_0 = JSON.parse(items_0);
    // console.log(items_0);
    // items_0 = JSON.stringify(items_0, null, 4); // to remove whitespace/format
    // console.log(items_0);

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
            
            {/* edit to create JSONEditor on Entry press - add onClick to <Entry>, pass in values */}
            <JSONEditor filename = {entries_obj.Items[0].FileName} entry = {entries_obj.Items[0].entry}/>
            <JSONEditor filename = {entries_obj.Items[1].FileName} entry = {entries_obj.Items[1].entry}/>
            <JSONEditor filename = {entries_obj.Items[2].FileName} entry = {entries_obj.Items[2].entry}/>

        </div>
    );
}

export default ItemsPage;
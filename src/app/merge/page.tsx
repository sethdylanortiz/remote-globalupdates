import React from "react";
import styles from "./page.module.css";
import DiffEntry from "@/components/diffEntry/DiffEntry";

// services
import { getDifferenceEntries, getItemsDatabase } from "./services";

// todo - implement cache search before making another aws call
// aws call dev database
// aws call live database
// add logic to compare, list compare entries
// onclick of entries, opens comparison json
    // merge
        // update entry in db 'version' - for polling
// if no changes, dsplay - all entrys are up to date

const MergePage = async() => {
    
    // on page load
    const get_items_databases = await getItemsDatabase();
    const {entries_dev_obj, entries_prod_obj} = await get_items_databases.json();

    const res_obj = await getDifferenceEntries(JSON.stringify(entries_dev_obj.Items), JSON.stringify(entries_prod_obj.Items));
    console.log("res_obj:   " + res_obj + "\n\n");
    const {newItems, syncedItemsDiffentEntry, deletedItems} = JSON.parse(res_obj);
    console.log("MergePage.tsx, newItems: "); console.log(newItems);
    console.log("MergePage.tsx, syncedItemsDiffentEntry: "); console.log(syncedItemsDiffentEntry);
    console.log("MergePage.tsx, deletedItems: "); console.log(deletedItems);

    return(
        <div className = {styles.container}>

            <DiffEntry
                newItems = {newItems}
                syncedItemsDiffentEntry = {syncedItemsDiffentEntry}
                deletedItems = {deletedItems}
            />
            
        </div>
    );
}

export default MergePage;
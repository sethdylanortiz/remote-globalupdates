import React from "react";
import styles from "./mergepage.module.css";

// services
import { getDifferenceEntries, getItemsDatabase } from "./services";
import DiffEntry from "@/components/diffEntry/DiffEntry";

const MergePage = async() => {
    // on page load
    const get_items_databases = await getItemsDatabase();
    const {entries_dev_obj, entries_prod_obj} = await get_items_databases.json();

    const res_obj = await getDifferenceEntries(JSON.stringify(entries_dev_obj.Items), JSON.stringify(entries_prod_obj.Items));
    const {newItems, syncedItemsDiffentEntry, deletedItems} = JSON.parse(res_obj);
    // console.log("MergePage.tsx, newItems: "); console.log(newItems);
    // console.log("MergePage.tsx, syncedItemsDiffentEntry: "); console.log(syncedItemsDiffentEntry);
    // console.log("MergePage.tsx, deletedItems: "); console.log(deletedItems);

    return(
        <div className = {styles.container}>
            
            <div className = {styles.header_section}>
                <div className = {styles.header_text}>
                        <p>The following entries are to be Added, Updated, OR Deleted:</p>
                        <p>Current PRODUCTION version: </p>
                </div>
            </div>
            
            { newItems.length == 0 && syncedItemsDiffentEntry.length == 0 && deletedItems.length == 0 ? 
                <section className = {styles.no_changes_message_container}>
                    <p>Looks like the PRODUCTION database is up to date...</p>
                </section>
                :
                <DiffEntry
                    newItems = {newItems}
                    syncedItemsDiffentEntry = {syncedItemsDiffentEntry}
                    deletedItems = {deletedItems}
                />
            }

        </div>
    );
}

export default MergePage;
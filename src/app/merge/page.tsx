import React from "react";
import styles from "./mergepage.module.css";

// services
import DiffEntry from "@/app/merge/diffEntry/DiffEntry";
import MergeButton from "./mergeButton/MergeButton";
import { getDifferenceEntries, getItemsDatabase, getCurrentLiveVersion, Item, SyncedItem} from "./services";

const MergePage = async() => {

    // get current live version
    const current_version = await getCurrentLiveVersion();
    const {entries_dev_arr, entries_prod_arr} = await getItemsDatabase();
    const res_obj = await getDifferenceEntries(JSON.stringify(entries_dev_arr), JSON.stringify(entries_prod_arr));
    const {newItems, syncedItemsDiffentEntry, deletedItems} = JSON.parse(res_obj);

    return(
        <div className = {styles.container}>
            
            <div className = {styles.header_section}>
                <div className = {styles.header_text}>
                        <p>The following entries are to be updated, added, or deleted:</p>
                        <p>Current Live version: {current_version}</p>
                </div>
            </div>
            
            { newItems.length == 0 && syncedItemsDiffentEntry.length == 0 && deletedItems.length == 0 ? 
                <section className = {styles.no_changes_message_container}>
                    <p>Looks like the Live database is up to date...</p>
                </section>
                :
                <div className = {styles.cards_container}>
                    {newItems.map((item: Item) => 
                        <DiffEntry item = {item} item_type = "new" key = {item.Filename}/>
                    )}
                    {syncedItemsDiffentEntry.map((item: SyncedItem) => 
                        <DiffEntry item = {item} item_type = "synced" key = {item.Filename}/>
                    )}
                    {deletedItems.map((item: Item) => 
                        <DiffEntry item = {item} item_type = "deleted" key = {item.Filename}/>
                    )}
                    
                    <div className = {styles.merge_button_container}>
                        <MergeButton 
                            newItems = {newItems} 
                            syncedItemsDiffentEntry = {syncedItemsDiffentEntry} 
                            deletedItems = {deletedItems}
                            currentVersion = {current_version}
                        />
                    </div>
                </div>
            }

        </div>
    );
}

export default MergePage;
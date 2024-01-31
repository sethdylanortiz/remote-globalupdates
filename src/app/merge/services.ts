"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// services
import { getEntryDB, updateEntryDB, deleteEntryDB } from "../lib/dynamodb";

export type Item = {
    FileName: string,
    entry: string
};
export type Items = Item[];

export type SyncedItem = {
    FileName: string,
    dev_entry: string,
    prod_entry: string
};
export type SycnedItems = SyncedItem[];

const getItemsDatabase = async() => {
    try{
        const [items_dev_obj, items_prod_obj] = await Promise.all([getEntryDB("development"), getEntryDB("production")]);
        return {entries_dev_obj: items_dev_obj, entries_prod_obj: items_prod_obj};
    } catch(error){
        console.log("services.tsx getItemsDatabase() error: " + error);
        redirect("/404");
    }
}

// compare objects, find differences - to be mapped and displayedmain.ts(31,31): error TS2345: Argument of type 'string' is not assignable to parameter of type '{ filename: string; entry: string; }'.
// todo - edit function, put logic into for loop to iterate and add changes in order of dev_obj
const getDifferenceEntries = async(dev_obj_str: string, prod_obj_str: string) => {

    try{
        const [prod_obj, dev_obj] = await Promise.all([JSON.parse(prod_obj_str), JSON.parse(dev_obj_str)]);

        // SYNC: loop through and find what exists
        const dev_obj_filenames = dev_obj.map((item: any) => {
        return item.FileName 
        });
        const prod_obj_filenames = prod_obj.map((item: any) => {
        return item.FileName 
        });

        // SYNCED: items that exist in both => and include differences in entry{} values
        var syncedItemsDiffentEntry = new Array();
        dev_obj.map((item: Item) => {
            // find filenames that exist in both objs && differnence in entry
            let found_index = prod_obj_filenames.indexOf(item.FileName);
            if(found_index !== -1 && prod_obj[found_index].entry !== item.entry)
            syncedItemsDiffentEntry.push({ 
                    FileName: item.FileName,
                    dev_entry: item.entry,
                    prod_entry: prod_obj[found_index].entry
                });
        });
        // console.log("services.ts, syncedItemsDiffentEntry: "); console.log(syncedItemsDiffentEntry);

        // NEW: if item inside dev_obj dne inside of prod_obj => is marked as a new entry
        const newItems = dev_obj.filter((item: Item) => {
            if(!prod_obj_filenames.includes(item.FileName))
            return item;
        });
        // console.log("newItems: "); console.log(newItems);

        // DELETE: loop prod.entry[] and if entry dne inside of dev.entry[]
        const deletedItems = prod_obj.filter((item: Item) => {
            if(!dev_obj_filenames.includes(item.FileName))
                return item;
        });
        // console.log("deletedItems"); console.log(deletedItems);

        return(JSON.stringify({newItems, syncedItemsDiffentEntry, deletedItems}));
    }
    catch(error){
        console.log("services.tsx getDifferenceEntries() error: " + error);
        redirect("/404");
    }
}

const mergeAll = async({newItems, syncedItemsDiffentEntry, deletedItems}: {newItems: Items, syncedItemsDiffentEntry: SycnedItems, deletedItems: Items}) => {
    console.log("services.ts, inside mergeAll()! ");

    var item_type_index = "newItems";
    try{
        newItems.map(async(item: Item) => {
            await updateEntryDB(item.FileName, item.entry, "production");
            console.log(`successfully updated ${item.FileName}'s Item!`);
        });
        revalidatePath("/merge");  // update cached items/entries

        item_type_index = "syncedItemsDiffentEntry";
        syncedItemsDiffentEntry.map(async(item: SyncedItem) => {
            await updateEntryDB(item.FileName, item.dev_entry, "production");
            console.log(`successfully updated ${item.FileName}'s Item!`);
        });
        revalidatePath("/merge");  // update cached items/entries

        item_type_index = "deletedItems";
        deletedItems.map(async(item: Item) => {
            await deleteEntryDB(item.FileName, "production");
            console.log(`successfully updated ${item.FileName}'s Item!`);
        });
        revalidatePath("/merge");  // update cached items/entries

    }catch(error) {
        console.log("services.ts ERROR handleMerge(), error: " + error);
        console.log("services.ts ERROR handleMerge(), item_type_index: " + item_type_index);
        redirect("/404");
    };

    console.log("end of mergeAll()!");
}

export { getDifferenceEntries, getItemsDatabase, mergeAll }
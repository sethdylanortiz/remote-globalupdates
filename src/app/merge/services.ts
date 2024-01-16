"use server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation"; // https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function
import { revalidatePath } from "next/cache"; // https://nextjs.org/docs/app/api-reference/functions/revalidatePath
import { getEntryDB, updateEntryDB, deleteEntryDB } from "../lib/dynamodb";

type Item = {
    FileName: string,
    entry: string
};
type Items = [Item];

type SyncedItem = {
    FileName: string,
    dev_entry: string,
    prod_entry: string
};
type SycnedItems = [SyncedItem];

const getItemsDatabase = async() => {
    console.log("\n\n" + "inside services.ts, getItemsDatabase()");
    
    try{
        const items_dev_obj = await getEntryDB("development");
        const items_prod_obj = await getEntryDB("production");

        return NextResponse.json({
            responseMsg: ["services.ts SUCCESS getEntryDB()"],
            entries_dev_obj: items_dev_obj,
            entries_prod_obj: items_prod_obj,

            success: true,
        });
    } catch(error){

        return NextResponse.json({
            responseMsg: ["services.ts ERROR getEntryDB()"],
            entries_dev_obj: null,
            entries_prod_obj: null,

            success: false,
        });
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

    }catch(error){
        console.log("services.ts ERROR handleMerge(), error: " + error);
        console.log("services.ts ERROR handleMerge(), item_type_index: " + item_type_index);
    };

    // revalidatePath("/merge");  // update cached items/entries
    console.log("end of mergeAll()!");
}

// compare objects, find differences - to be mapped and displayedmain.ts(31,31): error TS2345: Argument of type 'string' is not assignable to parameter of type '{ filename: string; entry: string; }'.
// todo - edit function, put logic into for loop to iterate and add changes in order of dev_obj
const getDifferenceEntries = async(dev_obj_str: string, prod_obj_str: string) => {

    const [prod_obj, dev_obj] = await Promise.all([JSON.parse(prod_obj_str), JSON.parse(dev_obj_str)]);
    // console.log("services.ts, prod_obj_str: "); console.log(prod_obj_str);
    // console.log("\n" + "services.ts, dev_obj_str: "); console.log(dev_obj_str);

    // SYNC: loop through and find what exists
    const dev_obj_filenames = dev_obj.map((item: any) => {
       return item.FileName 
    });
    const prod_obj_filenames = prod_obj.map((item: any) => {
       return item.FileName 
    });
    console.log("dev_obj_filenames: "); console.log(dev_obj_filenames);
    console.log("prod_obj_filenames: "); console.log(prod_obj_filenames);

    // SYNCED: items that exist in both => and include differences in entry{} values
    var syncedItemsDiffentEntry = new Array();
    dev_obj.map((item: any) => {
        // find filenames that exist in both objs && differnence in entry
        let found_index = prod_obj_filenames.indexOf(item.FileName);
        if(found_index !== -1 && prod_obj[found_index].entry !== item.entry)
        syncedItemsDiffentEntry.push({ 
                FileName: item.FileName,
                dev_entry: item.entry,
                prod_entry: prod_obj[found_index].entry
            });
    });
    console.log("services.ts, syncedItemsDiffentEntry: "); console.log(syncedItemsDiffentEntry);

    // NEW: if item inside dev_obj dne inside of prod_obj => is marked as a new entry
    const newItems = dev_obj.filter((item: any) => {
        if(!prod_obj_filenames.includes(item.FileName))
        return item;
    });
    console.log("newItems: "); console.log(newItems);

    // DELETE: loop prod.entry[] and if entry dne inside of dev.entry[]
    const deletedItems = prod_obj.filter((item: any) => {
        if(!dev_obj_filenames.includes(item.FileName))
            return item;
    });
    console.log("deletedItems"); console.log(deletedItems);

    return(JSON.stringify({newItems, syncedItemsDiffentEntry, deletedItems}));
}

export { getDifferenceEntries, getItemsDatabase, mergeAll}
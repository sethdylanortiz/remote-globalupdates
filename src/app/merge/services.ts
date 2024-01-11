"use server";
import { NextResponse } from "next/server";
import { getEntryDB } from "../lib/dynamodb";

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
            status: 200
        });
    } catch(error){

        return NextResponse.json({
            responseMsg: ["services.ts ERROR getEntryDB() for ${database_type}"],
            entries_dev_obj: null,
            entries_prod_obj: null,

            success: false,
            status: 500
        });
    }
}

// compare objects, find differences - to be mapped and displayedmain.ts(31,31): error TS2345: Argument of type 'string' is not assignable to parameter of type '{ filename: string; entry: string; }'.
// todo - edit function, put logic into for loop to iterate and add changes in order of dev_obj
const getDifferenceEntries = async(dev_obj_str: string, prod_obj_str: string) => {

    const [prod_obj, dev_obj] = await Promise.all([JSON.parse(prod_obj_str), JSON.parse(dev_obj_str)]);
    console.log("services.ts, prod_obj_str: "); console.log(prod_obj_str);
    console.log("\n" + "services.ts, dev_obj_str: "); console.log(dev_obj_str);

    // SYNC: loop through and find what exists
    const dev_obj_filenames = dev_obj.map((item: any) => {
       return item.FileName 
    });
    const prod_obj_filenames = prod_obj.map((item: any) => {
       return item.FileName 
    });
    console.log("dev_obj_filenames: "); console.log(dev_obj_filenames);
    console.log("prod_obj_filenames: "); console.log(prod_obj_filenames);

    const syncedItemsDiffentEntry = dev_obj.filter((item: any) => {
        // find filenames that exist in both objs && differnence in entry
        let found_index = prod_obj_filenames.indexOf(item.FileName);
        console.log("found_index: " + found_index);
        if(found_index !== -1 && prod_obj[found_index].entry !== item.entry)
            return item;
    });
    console.log("syncedItemsDiffentEntry: "); console.log(syncedItemsDiffentEntry);

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

export { getDifferenceEntries, getItemsDatabase }
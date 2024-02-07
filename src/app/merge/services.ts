"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// services
import { getItemsDB, updateEntryDB, deleteEntryDB, updateConfigVersionsDB, getLiveVersionDB } from "../lib/dynamodb";

export type Item = {
    Filename: string,
    Entry: string
};
export type Items = Item[];

export type SyncedItem = {
    Filename: string,
    dev_entry: string,
    prod_entry: string
};
export type SyncedItems = SyncedItem[];

const getItemsDatabase = async() => {
    try{
        const [items_dev_obj, unfiltered_items_prod_obj] = await Promise.all([getItemsDB("development"), getItemsDB("production")]);
        const items_prod_obj = unfiltered_items_prod_obj.Items?.filter((item: any) => item.Filename !== "VERSION" );
        return {entries_dev_arr: items_dev_obj.Items, entries_prod_arr: items_prod_obj};
    } catch(error){
        console.log("services.ts getItemsDatabase() error: " + error);
        redirect("/404");
    };
};

const getCurrentLiveVersion = async() => {
    try{
        const request = await getLiveVersionDB();
        return request.Item ? Number(request.Item.Entry) : redirect("/404");
    }catch(error){
        console.log("services.ts getCurrentLiveVersion() error: " + error);
        redirect("/404");
    };

};

// compare objects, find differences - to be mapped and displayedmain.ts(31,31): error TS2345: Argument of type 'string' is not assignable to parameter of type '{ filename: string; entry: string; }'.
// todo - edit function, put logic into for loop to iterate and add changes in order of dev_obj
const getDifferenceEntries = async(dev_obj_str: string, prod_obj_str: string) => {

    try{
        const [prod_obj, dev_obj] = await Promise.all([JSON.parse(prod_obj_str), JSON.parse(dev_obj_str)]);

        // SYNC: loop through and find what exists
        const dev_obj_filenames = dev_obj.map((item: any) => { return item.Filename; });
        const prod_obj_filenames = prod_obj.map((item: any) => { return item.Filename; });

        // SYNCED: items that exist in both => and include differences in entry{} values
        var syncedItemsDiffentEntry = new Array();
        dev_obj.map((item: Item) => {
            // find filenames that exist in both objs && differnence in entry
            let found_index = prod_obj_filenames.indexOf(item.Filename);
            if(found_index !== -1 && prod_obj[found_index].Entry !== item.Entry)
            syncedItemsDiffentEntry.push({ 
                    Filename: item.Filename,
                    dev_entry: item.Entry,
                    prod_entry: prod_obj[found_index].Entry
                });
        });
        // console.log("services.ts, syncedItemsDiffentEntry: "); console.log(syncedItemsDiffentEntry);

        // NEW: if item inside dev_obj dne inside of prod_obj => is marked as a new entry
        const newItems = dev_obj.filter((item: Item) => {
            if(!prod_obj_filenames.includes(item.Filename))
            return item;
        });
        // console.log("newItems: "); console.log(newItems);

        // DELETE: loop prod.Entry[] and if entry dne inside of dev.Entry[]
        const deletedItems = prod_obj.filter((item: Item) => {
            if(!dev_obj_filenames.includes(item.Filename))
                return item;
        });
        // console.log("deletedItems"); console.log(deletedItems);

        return(JSON.stringify({newItems, syncedItemsDiffentEntry, deletedItems}));
    }
    catch(error){
        console.log("services.tsx getDifferenceEntries() error: " + error);
        redirect("/404");
    };
};

const mergeAll = async(newItems: Items, syncedItemsDiffentEntry: SyncedItems, deletedItems: Items, currentVersion: number) => {
    console.log("services.ts, inside mergeAll()! ");

    var item_type_index = "newItems";
    try{
        newItems.map(async(item: Item) => {
            await updateEntryDB(item.Filename, item.Entry, "production");
            console.log(`successfully updated ${item.Filename}'s Item!`);
        });
        revalidatePath("/merge");

        item_type_index = "syncedItemsDiffentEntry";
        syncedItemsDiffentEntry.map(async(item: SyncedItem) => {
            await updateEntryDB(item.Filename, item.dev_entry, "production");
            console.log(`successfully updated ${item.Filename}'s Item!`);
        });
        revalidatePath("/merge");

        item_type_index = "deletedItems";
        deletedItems.map(async(item: Item) => {
            await deleteEntryDB(item.Filename, "production");
            console.log(`successfully updated ${item.Filename}'s Item!`);
        });
        revalidatePath("/merge");

        // update Live versioning DB
        const items_prod_obj = await getItemsDB("production");
        const items_prod_arr = items_prod_obj.Items;
        const newVersion = currentVersion + 1;
        var version_package = "[";

        // iterate through LIVE db entries and build out return json
        // todo - fix type ": any"
        items_prod_arr?.map((item: any) => {
            if(item.Filename == "VERSION")
            {
                item.Entry = newVersion.toString();
            }
            version_package += JSON.stringify(item) + ",";
        });
        version_package = version_package.substring(0, version_package.length - 1) + "]";
        console.log("version_package: \n" + version_package);
        console.log(JSON.parse(version_package));
        
        await updateConfigVersionsDB(newVersion, version_package);
        revalidatePath("/versioning");

        // update Live DB version # entry 
        await updateEntryDB("VERSION", newVersion, "production");
        revalidatePath("/merge");

    }catch(error) {
        console.log("services.ts ERROR handleMerge(), error: " + error);
        console.log("services.ts ERROR handleMerge(), item_type_index: " + item_type_index);
        redirect("/404");
    };

    console.log("end of mergeAll()");
};

export { getDifferenceEntries, getItemsDatabase, mergeAll, getCurrentLiveVersion};